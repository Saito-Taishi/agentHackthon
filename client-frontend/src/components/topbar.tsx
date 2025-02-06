"use client";

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
      <nav className="flex space-x-4 items-center">
        <Link href="/upload" className={linkClass("/upload")}>
          アップロード
        </Link>
        <Link href="/companies" className={linkClass("/companies")}>
          企業一覧
        </Link>
        <Link href="/record" className={linkClass("/record")}>
          名刺一覧
        </Link>
        <a
          href="https://forms.gle/roy9FTvHGmHH6ZvT6"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto px-4 py-2 rounded-lg bg-yellow-100 text-yellow-900 font-bold hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-50 dark:hover:bg-yellow-700 flex items-center"
        >
          アンケートのご協力お願いします。
        </a>
      </nav>
    </header>
  );
}
