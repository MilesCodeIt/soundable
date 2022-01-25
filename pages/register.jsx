import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import ky, { HTTPError } from "ky";

import styles from "styles/Login.module.scss";

export default function LoginPage () {
  const router = useRouter();
  const [state, setState] = useState({
    username: "",
    password: "",
    verifyPassword: "",
    email: ""
  })

  const setStateInput = (key) => ({
    target: { value }
  }) => setState({
    ...state,
    [key]: value
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (state.password !== state.verifyPassword)
      return console.error("Not same password.");

    try {
      const data = await ky.post("/api/register", {
        json: {
          username: state.username,
          password: state.password,
          email: state.email,
        }
      }).json();

      if (data.user) {
        router.push("/login");
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
      <NextSeo title="Register" />
      <section className={styles.container}>
        <h1>Register</h1>

        <form
          className={styles.formContainer}
          onSubmit={handleLogin}
        >
          <input
            onChange={setStateInput("username")}
            value={state.username}
            placeholder="Username"
            type="text"
          />

          <input
            onChange={setStateInput("email")}
            value={state.email}
            placeholder="E-mail"
            type="email"
          />

          <input
            onChange={setStateInput("password")}
            value={state.password}
            placeholder="Password"
            type="password"
          />

          <input
            onChange={setStateInput("verifyPassword")}
            value={state.verifyPassword}
            placeholder="Verify Password"
            type="password"
          />

          <button type="submit">
            Register
          </button>
        </form>
      </section>
    </Fragment>
  );
}