import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoAuto}>auto</span>
        <span className={styles.logoMax}>max</span>
      </Link>
    </header>
  );
};

export default Header;

