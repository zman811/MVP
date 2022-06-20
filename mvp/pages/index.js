import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
    if(username.length < 1) {
      //TODO add in error handleing
    }
    router.push(`/player/${username}`)
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
      </form>
    </div>
  );
}
