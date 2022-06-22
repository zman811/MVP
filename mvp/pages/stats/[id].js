import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Typewriter from "typewriter-effect";

export default function Stats({ summonerData, masteryData, rank, error }) {
  //TODO maybe try and get the ranked icons to show on the stats page
  if (error) {
    return (
      <div className={styles.center}>
        <Head>
          <link
            rel="stylesheet"
            href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h2>There was a Error finding that account, try again</h2>
        <Link href="/">
          <a href="#" role="button">
            Home
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.right}>
        <Link href="/">
          <a href="#" role="button">
            Home
          </a>
        </Link>
      </div>
      <div className={styles.center}>
        <h3>
          Rank: {rank.rank.toLowerCase()} {rank.div}
        </h3>
        <div>
          Most played champs,
          <div>
            {masteryData[0].name}
            <Image
              src={`http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${masteryData[0].imgId
                .split(" ")
                .join("")}.png`}
              alt={`${masteryData[0].name} Icon`}
              height={75}
              width={75}
            />
          </div>
          <div>
            {masteryData[1].name}
            <Image
              src={`http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${masteryData[1].imgId
                .split(" ")
                .join("")}.png`}
              alt={`${masteryData[1].name} Icon`}
              height={75}
              width={75}
            />
          </div>
          <div>
            {masteryData[2].name}
            <Image
              src={`http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${masteryData[2].imgId
                .split(" ")
                .join("")}.png`}
              alt={`${masteryData[2].name} Icon`}
              height={75}
              width={75}
            />
          </div>
        </div>
        {rank.winRate && <div>Comp win rate is {rank.winRate}%</div>}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const db = require("../../util/mongodb.js");
  try {
    const summonerName = context.query.id;
    const { data } = await axios.get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOTKEY}`
    );
    const mastery = await axios.get(
      `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${data.id}?api_key=${process.env.RIOTKEY}`
    );
    const rank = await axios.get(
      `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${process.env.RIOTKEY}`
    );
    let rankData;
    if (rank.data.length < 1) {
      rankData = { rank: "not ranked" };
    } else {
      rankData = {
        rank: rank.data[0].tier,
        div: rank.data[0].rank,
        winRate: Math.floor(
          (+rank.data[0].wins / (+rank.data[0].wins + rank.data[0].losses)) *
            100
        ),
      };
    }
    let masteries = [];
    for (let i = 0; i < 3; i++) {
      let [temp] = await db.find({
        key: Object.values(mastery.data)[i].championId,
      });
      const temp2 = {
        name: temp.name,
        title: temp.title,
        key: temp.key,
        imgId: temp.imgId,
        points: Object.values(mastery.data)[i].championPoints,
      };
      masteries.push(temp2);
    }
    // TODO make the request and pass it in as props, also i think i will query the database for champs here ? and pass that in as props or some form of it
    return {
      props: { summonerData: data, masteryData: masteries, rank: rankData },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { error: true },
    };
  }
}
