import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Custom500() {
  return (
    <div className={styles.center}>
      <h1>
        500 - Page Not Found
      </h1>
        <Link href="/">
          <a href="#" className="outline" role="button">
            Home
          </a>
        </Link>
    </div>
  );
}