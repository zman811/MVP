import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Typewriter from "typewriter-effect";

export default function Id({ summonerData, masteryData, rank, error }) {
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [button1, setButton1] = useState("");
  const [button2, setButton2] = useState("");
  const [userAccount, setUserAccount] = useState(null);
  const router = useRouter();
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
            Go Back
          </a>
        </Link>
      </div>
    );
  }
  let isUserAccount;
  if (userAccount === null) {
    isUserAccount = "";
  } else if (!userAccount) {
    isUserAccount = (
      <Typewriter
        options={{ cursor: "", delay: 80 }}
        onInit={(typewriter) => {
          typewriter
            .typeString(
              `Whoever it is, they like to play ${masteryData[2].name}`
            )
            .callFunction(() => setCount(5))
            .start();
        }}
      />
    );
  } else {
    isUserAccount = (
      <Typewriter
        options={{ cursor: "", delay: 80 }}
        onInit={(typewriter) => {
          typewriter
            .typeString(`So you like to play ${masteryData[2].name} I see`)
            .callFunction(() => setCount(5))
            .start();
        }}
      />
    );
  }
  let rankedInfo = "";
  if (rank.rank) {
    if (rank.rank.includes("IRON")) {
      rankedInfo = (
        <Typewriter
          options={{ cursor: "", delay: 80 }}
          onInit={(typewriter) => {
            typewriter
              .typeString(`Wow iron? must be a smurf.. right?`)
              .callFunction(() => setCount(6))
              .start();
          }}
        />
      );
    } else if (
      rank.rank.includes("BRONZE") ||
      rank.rank.includes("SILVER") ||
      rank.rank.includes("GOLD")
    ) {
      rankedInfo = (
        <Typewriter
          options={{ cursor: "", delay: 80 }}
          onInit={(typewriter) => {
            typewriter
              .typeString(
                `I mean, ${rank.rank.toLowerCase()} is in the average right?`
              )
              .callFunction(() => setCount(6))
              .start();
          }}
        />
      );
    } else if (
      rank.rank === "PLATINUM" ||
      rank.rank === "DIAMOND" ||
      rank.rank === "MASTER"
    ) {
      rankedInfo = (
        <Typewriter
          options={{ cursor: "", delay: 80 }}
          onInit={(typewriter) => {
            typewriter
              .typeString(`your ${rank.rank.toLowerCase()}? that's not bad`)
              .callFunction(() => setCount(6))
              .start();
          }}
        />
      );
    } else if (rank.rank === "GRANDMASTER" || rank.rank === "CHALLENGER") {
      rankedInfo = (
        <Typewriter
          options={{ cursor: "", delay: 80 }}
          onInit={(typewriter) => {
            typewriter
              .typeString(`A ${rank.rank.toLowerCase()}?? must be pretty good`)
              .callFunction(() => setCount(6))
              .start();
          }}
        />
      );
    }
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
            Go Back
          </a>
        </Link>
      </div>
      <div className={styles.center}>
        <h3>
          {router.query.id}, {masteryData[0].title}
        </h3>
      </div>
      <div className={styles.center}>
        <Typewriter
          options={{ cursor: "", delay: 80 }}
          onInit={(typewriter) => {
            typewriter
              .pauseFor(1000)
              .typeString(`Who do you like to play?`)
              .pauseFor(500)
              .typeString(` a lot of ${masteryData[0].name} it looks like`)
              .callFunction(() => setCount(count + 1))
              .start();
          }}
        />
        {count > 0 && (
          <Typewriter
            options={{ cursor: "", delay: 80 }}
            onInit={(typewriter) => {
              typewriter
                .typeString(`And a lot of ${masteryData[1].name}`)
                .callFunction(() => setCount(2))
                .start();
            }}
          />
        )}
        {count > 1 && (
          <Typewriter
            options={{ cursor: "", delay: 80 }}
            onInit={(typewriter) => {
              typewriter
                .typeString(`Is this your account?`)
                .callFunction(() => setCount(3))
                .start();
            }}
          />
        )}
        {count > 2 && (
          <>
            <a
              href="#"
              role="button"
              className={button1}
              disabled={disabled}
              onClick={() => {
                setButton1("contrast");
                setButton2("secondary");
                setUserAccount(true);
                setDisabled(true);
                setCount(4);
              }}
            >
              Yes
            </a>
            <a
              href="#"
              role="button"
              className={button2}
              disabled={disabled}
              onClick={() => {
                setButton1("secondary");
                setButton2("contrast");
                setUserAccount(false);
                setDisabled(true);
                setCount(4);
              }}
            >
              No
            </a>
          </>
        )}
        {count > 3 && isUserAccount}
        {count > 4 && rankedInfo}
        {count > 5 && (
          <Link href={`/stats/${router.query.id}`}>
            <button>Go to stats</button>
          </Link>
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
    let rankData;
    if (rank.data.length < 1) {
      rankData = {};
    } else {
      console.log("HERE");
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
