import Head from "next/head";
import { useState } from "react";
import React from "react";
import styles from "./index.module.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton.js";

export default function Home() {
  const [personInput, setPersonInput] = useState("");
  const [giftOneInput, setGiftOneInput] = useState("");
  const [giftTwoInput, setGiftTwoInput] = useState("");
  const [giftThreeInput, setGiftThreeInput] = useState("");
  const [result, setResult] = useState("");
  const { loginWithRedirect, isAuthenticated} = useAuth0();
  var elements = [];

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ person: personInput, giftOne: giftOneInput, giftTwo: giftTwoInput, giftThree: giftThreeInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setPersonInput("");
      setGiftOneInput("");
      setGiftTwoInput("");
      setGiftThreeInput("");


    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const results = result.split('\n');
  elements = results.map(res => <p className={styles.result} key={res}>{res}</p>);


  return (
    <Auth0Provider
      domain="dev-4jh667bwhymi30x0.us.auth0.com"
      clientId="K3jMDhiuMrl3zPoaiVfNuxM1cFzzGiIO"
      redirectUri={"http://localhost:3000/"}
    >
      <div>
        <Head>
          <title>OpenAI Quickstart</title>
          <link rel="icon" href="/dog.png" />
        </Head>
        {isAuthenticated ? <div>Log Out</div> :
        <LoginButton /> 
        }
        <main className={styles.main}>
          <h3>Gift Idea Generator</h3>
          <form onSubmit={onSubmit}>
            <div>Enter the person that you would like to find a gift for. <br /><br /> </div>
            <input
              type="text"
              name="person"
              placeholder="Gift recipient"
              value={personInput}
              onChange={(e) => setPersonInput(e.target.value)}
            />
            <div>Enter three of the best previous gifts that you have gotten for this person. <br /><br /> </div>
            <input
              type="text"
              name="giftOne"
              placeholder="Gift 1"
              value={giftOneInput}
              onChange={(e) => setGiftOneInput(e.target.value)}
            />
            <input
              type="text"
              name="giftTwo"
              placeholder="Gift 2"
              value={giftTwoInput}
              onChange={(e) => setGiftTwoInput(e.target.value)}
            />
            <input
              type="text"
              name="giftThree"
              placeholder="Gift 3"
              value={giftThreeInput}
              onChange={(e) => setGiftThreeInput(e.target.value)}
            />
            <input type="submit" value="Generate gifts" />
          </form>
          <div className={styles.resultDiv}>
          {elements}
          </div>
        </main>
      </div>
    </Auth0Provider>
  );
}
