"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Topbar() {
  const pathname = usePathname();

  // Return active style if the current path starts with the provided link
  const linkClass = (href: string) =>
    `px-4 py-2 rounded-lg ${pathname?.startsWith(href)
      ? "bg-blue-500 text-white"
      : "hover:bg-gray-200 dark:hover:bg-gray-800"
    }`;

  return (
    <header className="w-full bg-gray-100 dark:bg-gray-900 p-4">
      <nav className="flex space-x-4">
        <Link href="/upload" className={linkClass("/upload")}>
          アップロード
        </Link>
        <Link href="/companies" className={linkClass("/companies")}>
          企業一覧
        </Link>
        <Link href="/record" className={linkClass("/record")}>
          記録
        </Link>
      </nav>
    </header>
  );
}
