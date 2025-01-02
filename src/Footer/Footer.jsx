import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Inspired by{" "}
        <a
          href="https://www.linkedin.com/in/ciaracade/"
          className={styles.links}
        >
          Ciara Cade’s 300 goals setting technique
        </a>{" "}
        . Designed and Coded by{" "}
        <a href="https://github.com/code-techhb">Houlaymatou B.</a>
      </p>
    </footer>
  );
}

export default Footer;
