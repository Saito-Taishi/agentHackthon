import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 h-full bg-gray-100 dark:bg-gray-900 p-4">
      <nav className="space-y-2">
        <Link
          href="/upload"
          className="block px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          アップロード
        </Link>
        <Link
          href="/history"
          className="block px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          履歴
        </Link>
      </nav>
    </aside>
  );
}