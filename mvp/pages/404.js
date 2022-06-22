import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Custom404() {
  return (
    <main className="container" style={{textAlign: 'center'}}>
      <h1>
        404 - Page Not Found
      </h1>
      <main>
        <Link href="/">
          <a href="#" className="outline" role="button">
            Home
          </a>
        </Link>
      </main>
    </main>
  );
}
