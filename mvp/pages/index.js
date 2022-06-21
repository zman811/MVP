import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import Typewriter from "typewriter-effect";

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
        <Typewriter
          options={{ cursor: "" }}
          onInit={(typewriter) => {
            typewriter
              .typeString("Hello!")
              .pauseFor(1000)
              .callFunction((t) => {
                t.elements.cursor.hidden = true;
              })
              .start();
          }}
        />
        <Typewriter
          options={{
            cursor: "",
          }}
          onInit={(typewriter) => {
            typewriter
              .pauseFor(1200)
              .typeString("Please enter a name below")
              .start();
          }}
        />
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
  // ? i can pull more data from the api to add the database later if i need it
  try {
    const db = require("../util/mongodb.js");
    const version = await axios.get(
      "http://ddragon.leagueoflegends.com/api/versions.json"
    );
    const champData = await axios.get(
      `http://ddragon.leagueoflegends.com/cdn/${version.data[0]}/data/en_US/champion.json`
    );
    Object.values(champData.data.data).forEach(async (ele, i) => {
      const update = await db.findOneAndUpdate(
        { key: ele.key },
        { name: ele.name, key: ele.key, title: ele.title },
        { upsert: true }
      );
    });
  } catch (err) {
    console.log(err);
  }
  return {
    props: {},
    revalidate: 86400,
  };
}
