import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import axios from 'axios'
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [nameErr, setNameErr] = useState(false);

  const handleUsername = (e) => {
    setUsername(e.target.value);
    if (nameErr) {
      setNameErr(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
    if (username.length < 1) {
      setNameErr(true);
    } else {
      router.push(`/player/${username}`);
    }
  };
  return (
    <div className={styles.center}>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3>
        Welcome to league rating <br />
        <br /> Please enter a username below:
      </h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsername}
            placeholder="Enter Name Here"
          />
        </label>
        <input type="submit" className="outline" value="Go!" />
        {nameErr && (
          <small className={styles.red}>Error with name, try again</small>
        )}
      </form>
    </div>
  );
}

export async function getStaticProps(context) {
  // TODO format data and add it to the database/update it
  const db = require('../util/mongodb.js')
  const champData = await axios.get(
    "http://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/champion.json"
  );
  const res = await db.find()
  console.log(res);
  return {
    props: {},
    revalidate: 86400,
  };
}
