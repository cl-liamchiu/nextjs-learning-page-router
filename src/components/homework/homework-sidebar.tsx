"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./homework-sidebar.module.scss";

const homeworkLinks = [
  { id: -1, label: "Home", href: "/" },
  { id: 1, label: "Homework 1", href: "/homework/1" },
  { id: 2, label: "Homework 2", href: "/homework/2" },
  { id: 3, label: "Homework 3", href: "/homework/3" },
  { id: 4, label: "Homework 4", href: "/homework/4" },
  { id: 5, label: "Homework 5", href: "/homework/5" },
  { id: 6, label: "Homework 6", href: "/homework/6" },
  { id: 7, label: "Homework 7", href: "/homework/7" },
  { id: 8, label: "Homework 8", href: "/homework/8" },
  // { id: 9, label: "Homework 9", href: "/homework/9" },
];

const HomeworkSidebar = () => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Homework Navigation</h2>
      <nav className={styles.nav} aria-label="Homework navigation">
        {homeworkLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          const linkClassName = isActive
            ? `${styles.link} ${styles.linkActive}`
            : styles.link;

          return (
            <Link key={link.id} href={link.href} className={linkClassName}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default HomeworkSidebar;
