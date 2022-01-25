import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import ky, { HTTPError } from "ky";

import styles from "styles/Login.module.scss";

export default function LoginPage () {
  const router = useRouter();
  const [state, setState] = useState({
    uid: "",
    password: ""
  })

  const setStateInput = (key) => ({
    target: { value }
  }) => setState({
    ...state,
    [key]: value
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await ky.post("/api/login", {
        json: {
          uid: state.uid,
          password: state.password
        }
      }).json();

      if (response.payload) {
        router.push("/");
      }
    }
    catch (e) {
      if (e instanceof HTTPError) {
        const body = await e.response.json();
        console.error(body.message);
      } 
    }
  }

  return (
    <Fragment>
      <NextSeo title="Login" />
      <section className={styles.container}>
        <h1>Login</h1>

        <form
          className={styles.formContainer}
          onSubmit={handleLogin}
        >
          <input
            onChange={setStateInput("uid")}
            value={state.uid}
            placeholder="Username or E-Mail"
            type="text"
          />

          <input
            onChange={setStateInput("password")}
            value={state.password}
            placeholder="Password"
            type="password"
          />

          <button type="submit">
            Login
          </button>
        </form>

        <button>Forgot your password ?</button>
      </section>
    </Fragment>
  );
}