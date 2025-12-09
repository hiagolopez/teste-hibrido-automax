import React from 'react';
import styles from './styles.module.scss';

const StoreCard = ({ store, isSelected, onClick }) => {
  return (
    <div
      className={`${styles.storeCard} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.storeHeader}>
        <div className={styles.storeIcon}>📍</div>
        <h3 className={styles.storeName}>{store.nome}</h3>
      </div>
      <p className={styles.storeAddress}>
        {store.rua}, {store.numero}
      </p>
      <div className={styles.storeLocation}>
        <span>{store.bairro},</span>
        <span>{store.cidade}</span>
        <span>-</span>
        <span>{store.estado}</span>
      </div>
      {store.distance !== undefined && (
        <div className={styles.storeDistance}>
          📍 {store.distance.toFixed(1)} km de distância
        </div>
      )}
      <div className={styles.storeDetails}>
        <p className={styles.detailItem}>
          <strong>Telefone:</strong> {store.telefone}
        </p>
        <p className={styles.detailItem}>
          <strong>Horário:</strong> {store.horarioFuncionamento}
        </p>
        <p className={styles.detailItem}>
          <strong>CEP:</strong> {store.cep}
        </p>
      </div>
    </div>
  );
};

export default StoreCard;

