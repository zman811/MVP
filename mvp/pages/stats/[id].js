import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Typewriter from "typewriter-effect";

export default function Stats({
  summonerData,
  masteryData,
  rank,
  error,
  game,
}) {
  //TODO maybe try and get the ranked icons to show on the stats page
  const router = useRouter();
  const [count, setCount] = useState(0);
  if (error) {
    return (
      <div className={styles.center}>
        <Head>
          <title>Error</title>
        </Head>
        <h2>There was a Error finding that account, try again</h2>
        <Link href="/">
          <a href="#" className="outline" role="button">
            Home
          </a>
        </Link>
      </div>
    );
  }
  let gameWin = "won";
  if (game.win === false) {
    gameWin = "lost";
  }

  return (
    <div>
      <Head>
        <title>Stats Page</title>
      </Head>
      <div className={styles.right}>
        <Link href="/">
          <a href="#" className="outline" role="button">
            Home
          </a>
        </Link>
      </div>
      <div className="container" style={{ textAlign: "center" }}>
        <h2>
          <Typewriter
            options={{ delay: 100 }}
            onInit={(typewriter) => {
              typewriter
                .typeString(`Here are some stats on, ${router.query.id}`)
                .pauseFor(1000)
                .callFunction((t) => {
                  setCount(1);
                  t.elements.cursor.hidden = true;
                })
                .start();
            }}
          />
        </h2>
        {count > 0 && (
          <>
            <h3>
              Rank: {rank.rank.toLowerCase()} {rank.div}
              {rank.winRate && <h4>Comp win rate is {rank.winRate}%</h4>}
            </h3>
            <h4>
              Top 5 Most Played Champs,
              <div>
                {[...Array(5)].map((_, i) => (
                  <a
                    href="#"
                    key={masteryData[i].name}
                    style={{ margin: "0.4em" }}
                    data-tooltip={masteryData[i].name}
                  >
                    <Image
                      src={`http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${masteryData[
                        i
                      ].imgId
                        .split(" ")
                        .join("")}.png`}
                      alt={`${masteryData[i].name} Icon`}
                      height={75}
                      width={75}
                    />
                  </a>
                ))}
              </div>
            </h4>
            <hgroup>
              <h3>In the last game,</h3>
              <h4>
                {router.query.id} played as {game.champ},{" "}
                {game.lane.toLowerCase()} and {gameWin}
              </h4>
              <h4>They died {game.deaths} times</h4>
              <h4>And Purchased {game.itemsPurchased} items</h4>
              <h4>They used {game.ability} abilities</h4>
              {game.lane !== 'JUNGLE' && <h4> Took {game.turretPlates} Turret Plates</h4>}
              {game.skillShots > 7 && (
                <h4>And hit {game.skillShots} skill shots</h4>
              )}
              <h4></h4>
            </hgroup>
          </>
        )}
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
    const matches = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${data.puuid}/ids?start=0&count=1&api_key=${process.env.RIOTKEY}`
    );
    const lastMatch = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${matches.data[0]}?api_key=${process.env.RIOTKEY}`
    );
    let userData;
    console.log(lastMatch.data.info.participants[0]);
    for (let i = 0; i < lastMatch.data.info.participants.length; i++) {
      if (lastMatch.data.info.participants[i].puuid === data.puuid) {
        userData = {
          lane: lastMatch.data.info.participants[i].individualPosition,
          deaths: lastMatch.data.info.participants[i].deaths,
          champ: lastMatch.data.info.participants[i].championName,
          itemsPurchased: lastMatch.data.info.participants[i].itemsPurchased,
          win: lastMatch.data.info.participants[i].win,
          ability: lastMatch.data.info.participants[i].challenges.abilityUses,
          turretPlates: lastMatch.data.info.participants[i].challenges.turretPlatesTaken,
          skillShots:
            lastMatch.data.info.participants[i].challenges.skillshotsHit,
        };
      }
    }
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
    for (let i = 0; i < 5; i++) {
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
    return {
      props: {
        summonerData: data,
        masteryData: masteries,
        rank: rankData,
        game: userData,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { error: true },
    };
  }
}
