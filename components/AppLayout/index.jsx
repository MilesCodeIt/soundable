import { Fragment } from "react";
import styles from "./styles.module.scss";

// import useUser from "utils/web/useUser";


export default function AppLayout ({ children }) {
  // const { data } = useUser();

  return (
    <Fragment>
      <header className={styles.navbar_container}>
        <a>Soundable</a>
        <a>Sign-in</a>
      </header>

      <main className={styles.content_container}>
        {children}
      </main>
    </Fragment>
  );
}
