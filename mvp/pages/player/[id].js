import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import { useState } from "react";
import { useRouter } from 'next/router'

export default function Id({test}) {
  const router = useRouter()
  const { pid } = router.query
  console.log(test)
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

export async function getServerSideProps(context) {
  const id = context.query.id
  // TODO make the request and pass it in as props, also i think i will query the database for champs here ? and pass that in as props or some form of it
  return {
    props: {test: 'context'}
  }
}