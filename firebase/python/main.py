from flask import Flask, jsonify, request
from typing_extensions import TypedDict
import json
from langchain import hub
from langgraph.graph import StateGraph, START, END
from playwright.async_api import Page, async_playwright
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from typing import List

load_dotenv()  # 同じディレクトリ(company-crawler)にある .env を読み込む

llm = ChatOpenAI(model="gpt-4o")

class State(TypedDict):
    steps :int
    page :Page
    click_or_extract:str # "click" もしくは "extract" になる
    employeeCount:str
    sales:str
    businessActivities:List[str]
    headOfficeAddress:str
    capital:str
    established:str

class SelectedHrefOutput(BaseModel):
    """会社概要に関するurlとそのidを選択"""
    id:str = Field(description="プライマリーキー")
    url:str = Field(description="会社概要に関連するurl")

async def extract_links(page: Page):
    """指定されたページからリンク情報を抽出し、URLとリンクのリストをJSON文字列として返す関数。
    各リンクは以下の形式の辞書として返されます:
        - id: 文字列の連番
        - href: リンク先のURL
        - text: 余分な空白を除去したリンクテキスト
    """
    # 現在のページURLを取得
    extracted_data = {
        "links": []
    }

    # ページ内のすべての <a> タグからリンク情報を抽出
    extracted_data["links"] = await page.evaluate(
        """() => {
            const links = document.querySelectorAll("a");
            return Array.from(links).map((link, index) => ({
                id: String(index + 1), // 連番を文字列として設定
                href: link.href,
                text: (link.textContent || "").replace(/\\s+/g, " ").trim(),
            }));
        }"""
    )

    # JSON文字列に変換して返す
    return extracted_data


async def judge_company_overview(state:State):
    """会社概要ページに今いるのかどうかを判定する関数

    ページ内のHTMLテキストからLLMにより評価し、
    'yes' が含まれていれば {"click_or_extract": "extract"} を、
    'no' なら {"click_or_extract": "click"} として返します。
    """
    steps = state["steps"]
    if steps > 3:  # extract_company_overviewへ
        return {"click_or_extract": "extract"}
    else:
        # await を使って非同期にHTMLテキストを抽出
        html_text = await extract_html_text(state["page"])
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "今いるページは会社概要ページですか？概要ページであればyesを、違うページであればnoと回答してください"
                ),
                (
                    "human", "{input}"
                )
            ]
        )
        gemini_llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
        chain = prompt | gemini_llm
        res = chain.invoke({
            "input": html_text
        })

        # res.contentの内容（small case で比較）をもとに判断
        result_str = res.content.lower() if hasattr(res, "content") else ""
        print("judge_company_overviewが含まれているかいないか？", result_str)
        if "yes" in result_str:
            print("judegmentでextractが更新されました。")
            return {"click_or_extract": "extract"}
        else:
            return {"click_or_extract": "click"}


async def click_company_overview(state:State):
    """会社概要ページに最も遷移しそうなボタンを選択し、その画面に遷移する関数。
    1. 現在のページからリンク情報を抽出し、
    2. LLMチェーンで適切な URL を選択、
    3. その URL へ遷移し、state の "page" を更新します。
    """
    steps = state["steps"]
    page = state["page"]
    selected_href_llm = llm.with_structured_output(SelectedHrefOutput)
    
    # 非同期関数としてリンク情報を取得
    extracted_links_data = await extract_links(page)
    print("extracted_linksのタイプは", type(extracted_links_data))
    extracted_links_data_str = json.dumps(extracted_links_data, ensure_ascii=False)
    print("extracted_linksのタイプは", type(extracted_links_data_str))
    # hubを利用して適切なURLの取得用プロンプトとチェーンを構築
    prompt =  ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "これからhtml情報を受け取ります。[会社概要]に関連していそうなidとそのurlを1つだけ教えてください。"
                ),
                (
                    "human", "{question}"
                )
            ]
        )
    chain =  prompt |selected_href_llm
    # chain.invoke は同期関数としてURLを返すと想定
    res = chain.invoke({"question": extracted_links_data_str})

    # 返されたURLに移動する
    await page.goto(res.url)

    # stateの"page"を更新した結果を返す
    return {"page": page, "steps": steps + 1}



async def extract_company_overview(state:State):
    """会社概要ページから会社概要を取得"""
    page = state["page"]
    # ページのHTMLコンテンツを取得し、テキストのみを抽出
    html_content = await page.content()

    # BeautifulSoupを使用してHTMLをパースし、テキストのみを抽出
    soup = BeautifulSoup(html_content, 'html.parser')
    # スクリプトとスタイルタグを削除
    for script in soup(["script", "style"]):
        script.decompose()

    # テキストのみを取得
    text = soup.get_text()
    # 余分な空白と改行を整理
    lines = (line.strip() for line in text.splitlines())
    text = ' '.join(line for line in lines if line)
    prompt = hub.pull("zenn_company_overview")

    chain = prompt | llm
    res = chain.invoke({
        "question": text
    })
    return {
        "employeeCount":res["employeeCount"],
        "sales":res["sales"],
        "businessActivities":res["businessActivities"],
        "headOfficeAddress":res["headOfficeAddress"],
        "capital": res["capital"],
        "established":res["established"]
    }


async def extract_html_text(page: Page) -> str:
    """指定されたページからHTMLのテキストのみを抽出する関数。

    ページのHTMLコンテンツを取得し、<script> や <style> タグなど不要な部分を除去した上で、
    残りの可視テキストを返します。
    """
    # ページのHTMLを非同期に取得
    html_content = await page.content()

    # BeautifulSoupでHTMLをパースし不要なタグを削除
    soup = BeautifulSoup(html_content, 'html.parser')
    for tag in soup(["script", "style"]):
        tag.decompose()

    # ページ内のテキストのみを取得
    text = soup.get_text()

    # 余分な空白や改行を整理
    lines = (line.strip() for line in text.splitlines())
    clean_text = " ".join(line for line in lines if line)
    return clean_text


graph_builder = StateGraph(State)
# 会社概要ページにいるかの判定。
graph_builder.add_node("judge_company_overview", judge_company_overview)
graph_builder.add_node("extract_company_overview", extract_company_overview)
graph_builder.add_node("click_company_overview", click_company_overview)

intermediates = ["click_company_overview", "extract_company_overview"]

def route_click_or_extract(state:State):
    if state["click_or_extract"] =="extract":
        return "extract_company_overview"
    else:
        return "click_company_overview"

graph_builder.add_edge(START,"judge_company_overview")

graph_builder.add_conditional_edges(
    "judge_company_overview",
    route_click_or_extract,
    intermediates,
)

graph_builder.add_edge("click_company_overview","judge_company_overview")
graph_builder.add_edge("extract_company_overview", END)

async def call_agent(page):
    graph = graph_builder.compile()
    res = await graph.ainvoke({
        "steps":0,
        "page":page,
        "click_or_extract":"click",
        "employeeCont":"null",
        "sales":"null",
        "businessActivities":"null",
        "headOfficeAddress":"null",
        "capital":"null",
        "established":"null",
        })

    return res

app = Flask(__name__)

@app.route('/crawl', methods=['POST'])
async def crawl_company():
    data = request.get_json()

    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400

    url = data['url']
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(headless=False)
    page = await browser.new_page()
    await page.goto(url)
    res = await call_agent(page)
    print("最終的な出力は以下のようになりました。", res)
    await browser.close()
    response_data = {
        "employeeCount": res.get("employeeCount"),
        "sales": res.get("sales"),
        "businessActivities": res.get("businessActivities"),
        "headOfficeAddress": res.get("headOfficeAddress"),
        "capital": res.get("capital"),
        "established": res.get("established")
    }
    return jsonify(response_data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
