
import { cookies } from "next/headers";
import oauthClient from "@/utils/auth/google_oauth";
import RecordClientComponent from "./recordPage";

export default async function RecordPage() {

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("google_access_token")?.value
  oauthClient.setCredentials({ access_token: accessToken })
  console.log("accessTokenは", accessToken)

  return (
    <>
      <RecordClientComponent />
    </>
  );
}
