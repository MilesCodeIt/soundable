import { Fragment } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

// import useUser from "utils/web/useUser";


export default function AppLayout ({ children }) {
  // const { data } = useUser();

  return (
    <Fragment>
      <header className={styles.navbar_container}>
        <a>Soundable</a>
        <div>
          <Link href="/utilities" passHref>
            <a>Tools</a>
          </Link>
          <a>Sign-in</a>
        </div>
      </header>

      <main className={styles.content_container}>
        {children}
      </main>
    </Fragment>
  );
}
