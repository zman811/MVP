import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Id({ summonerData, masteryData }) {
  console.log(summonerData);
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
        <a href="#" role="button">
          Go Back
        </a>
      </Link>
      hello!
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const summonerName = context.query.id;
    const { data } = await axios.get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOTKEY}`
    );
    const mastery = await axios.get(
      `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${data.id}?api_key=${process.env.RIOTKEY}`
    );
    console.log(mastery.data.slice(0, 3));
    // TODO make the request and pass it in as props, also i think i will query the database for champs here ? and pass that in as props or some form of it
    return {
      props: { summonerData: data, masteryData: mastery.data.slice(0, 10) },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { test: "err" },
    };
  }
}
