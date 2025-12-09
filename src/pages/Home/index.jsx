import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <h1>Automax</h1>
      <p>Bem-vindo à Automax</p>
      <Link to="/nossas-lojas" className={styles.link}>
        Ver Nossas Lojas
      </Link>
    </div>
  );
};

export default Home;

