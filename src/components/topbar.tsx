import Link from "next/link";

export function Topbar() {
    return (
        <header className="w-full bg-gray-100 dark:bg-gray-900 p-4">
            <nav className="flex space-x-4">
                <Link
                    href="/upload"
                    className="px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    アップロード
                </Link>
                <Link
                    href="/companies"
                    className="px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    履歴
                </Link>
            </nav>
        </header>
    );
}
