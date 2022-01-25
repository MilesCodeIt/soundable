import { Fragment, useState } from "react";
import { NextSeo } from "next-seo";

import styles from "styles/Login.module.scss";

export default function LoginPage () {
  const [state, setState] = useState({
    username: "",
    password: ""
  })

  const setStateInput = (key) => ({
    target: { value }
  }) => setState({
    ...state,
    [key]: value
  });

  const handleLogin = (e) => {
    e.preventDefault();

    console.log(state);
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
            onChange={setStateInput("username")}
            value={state.username}
            placeholder="Username"
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