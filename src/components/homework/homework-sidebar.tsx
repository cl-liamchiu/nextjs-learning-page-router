"use client";

import Link from "next/link";
import { useRouter } from "next/router";

const homeworkLinks = [
  { id: 1, label: "Homework 1", href: "/homework/1" },
  { id: 2, label: "Homework 2", href: "/homework/2" },
  { id: 3, label: "Homework 3", href: "/homework/3" },
  { id: 4, label: "Homework 4", href: "/homework/4" },
  { id: 5, label: "Homework 5", href: "/homework/5" },
];

const HomeworkSidebar = () => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <aside className="w-64 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Homework Navigation
      </h2>
      {homeworkLinks.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.id}
            href={link.href}
            className={`block p-2 mb-2 rounded transition-colors ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
};

export default HomeworkSidebar;
