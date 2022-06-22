import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useState } from "react";
import Typewriter from "typewriter-effect";

export default function Home({ freeChamps }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [count, setCount] = useState(0);

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
    <div className="container" style={{textAlign: 'center'}}>
      <Head>
        <title>Home Page</title>
      </Head>
      <h2>
        <br />
        <details>
          <summary style={{textAlign: 'center'}} role="button">Current Free Champs</summary>
          <div>
            {freeChamps.map((champ, i) => (
              <a
                href="#"
                key={champ}
                style={{ margin: "1px" }}
                data-tooltip={champ}
              >
                <Image
                  src={`http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${champ
                    .split(" ")
                    .join("")}.png`}
                  alt={`${champ} Icon`}
                  height={65}
                  width={65}
                />
              </a>
            ))}
          </div>
        </details>
      </h2>
      <h3>
        <Typewriter
          options={{ delay: 80 }}
          onInit={(typewriter) => {
            typewriter
              .typeString("Welcome to *need name*!")
              .callFunction((t) => {
                t.elements.cursor.hidden = true;
              })
              .pauseFor(750)
              .callFunction(() => setCount(1))
              .start();
          }}
        />

        {count > 0 && (
          <Typewriter
            options={{ delay: 80 }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Please enter a username below:")
                .callFunction((t) => {
                  t.elements.cursor.hidden = true;
                })
                .start();
            }}
          />
        )}
      </h3>
      <form onSubmit={handleSubmit}>
        {/* //TODO Could add in a typewriter placeholder? */}
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
        { name: ele.name, key: ele.key, title: ele.title, imgId: ele.id },
        { upsert: true }
      );
    });
    const freeChamps = await axios.get(
      `https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${process.env.RIOTKEY}`
    );
    let resChamps = [];
    for (let i = 0; i < freeChamps.data.freeChampionIds.length; i++) {
      let temp = await db.find({ key: freeChamps.data.freeChampionIds[i] });
      resChamps.push(temp[0].imgId);
    }
    return {
      props: { freeChamps: resChamps },
      revalidate: 86400,
    };
  } catch (err) {
    console.log(err);
  }
  return {
    props: {},
    revalidate: 86400,
  };
}
