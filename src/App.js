import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Header from './react/components/Header';
import Footer from './react/components/Footer';
import Home from './pages/Home';
import StoreLocator from './react/StoreLocator';
import styles from './App.module.scss';

function App() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <Header />
        <main className={styles.mainContent}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/nossas-lojas" component={StoreLocator} />
            <Redirect to="/" />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
