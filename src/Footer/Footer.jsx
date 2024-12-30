import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Inspired from{" "}
        <a href="#" className={styles.links}>
          Ciara Cade’s 300 goals setting technique
        </a>
        . Designed and Coded by <a href="#">Houlaymatou B.</a>
      </p>
    </footer>
  );
}

export default Footer;
