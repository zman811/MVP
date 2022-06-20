import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import { useState } from "react";

export default function Id() {
  return (
    <div className={styles.center}>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/">
        <a href="#" role="button">Go Back</a>
      </Link>
      hello!
    </div>
  );
}
