import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useStores, useStoreStates, useStoreCities } from '../../hooks/useStores';
import { findNearestStores } from '../../../services/geocodingService';
import styles from './styles.module.scss';
import StoreCard from './StoreCard';
import StoreMap from './StoreMap';
import CEPSearch from './CEPSearch';

const StoreLocator = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const { stores: allStores, loading: storesLoading } = useStores({
    state: selectedState || undefined,
    city: selectedCity || undefined
  });

  const filteredStores = useMemo(() => {
    if (userLocation && allStores.length > 0) {
      return findNearestStores(allStores, userLocation.latitude, userLocation.longitude);
    }
    return allStores;
  }, [allStores, userLocation]);

  const { states, loading: statesLoading } = useStoreStates();
  const { cities, loading: citiesLoading } = useStoreCities(selectedState);

  const handleStateChange = useCallback((e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setSelectedStore(null);
    setUserLocation(null);
  }, []);

  const handleCityChange = useCallback((e) => {
    setSelectedCity(e.target.value);
    setSelectedStore(null);
  }, []);

  const handleStoreClick = useCallback((store) => {
    setSelectedStore(store.id === selectedStore?.id ? null : store);
  }, [selectedStore]);

  const handleLocationFound = useCallback((location) => {
    setUserLocation(location);
    setSelectedState('');
    setSelectedCity('');
  }, []);

  useEffect(() => {
    if (userLocation && filteredStores.length > 0 && filteredStores[0]?.distance !== undefined) {
      setSelectedStore(filteredStores[0]);
    }
  }, [userLocation, filteredStores]);

  const handleLocationClear = useCallback(() => {
    setUserLocation(null);
    setSelectedStore(null);
  }, []);

  return (
    <section className={styles.storeLocatorContainer}>
      <h1 className={styles.title}>Nossas Lojas</h1>
      <p className={styles.subtitle}>Encontre a loja Automax mais próxima de você</p>

      <CEPSearch
        onLocationFound={handleLocationFound}
        onLocationClear={handleLocationClear}
      />

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="state-filter">Estado</label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={handleStateChange}
            className={styles.select}
            disabled={statesLoading || !!userLocation}
          >
            <option value="">Todos os estados</option>
            {states.map(state => (
              <option key={state.sigla} value={state.nome}>
                {state.nome}
              </option>
            ))}
          </select>
        </div>

        {selectedState && (
          <div className={styles.filterGroup}>
            <label htmlFor="city-filter">Cidade</label>
            <select
              id="city-filter"
              value={selectedCity}
              onChange={handleCityChange}
              className={styles.select}
              disabled={citiesLoading || !!userLocation}
            >
              <option value="">Todas as cidades</option>
              {cities.map(city => (
                <option key={city.cidade} value={city.cidade}>
                  {city.cidade}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!storesLoading && filteredStores.length > 0 && (
        <StoreMap
          stores={filteredStores}
          selectedStore={selectedStore}
          userLocation={userLocation}
          onMarkerClick={handleStoreClick}
        />
      )}

      {storesLoading ? (
        <div className={styles.loading}>Carregando lojas...</div>
      ) : filteredStores.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhuma loja encontrada para os filtros selecionados.</p>
          <p>Tente selecionar outro estado ou cidade.</p>
        </div>
      ) : (
        <ul className={styles.storesList}>
          {filteredStores.map(store => (
            <li key={store.id} className={styles.storesListItem}>
              <StoreCard
                store={store}
                isSelected={selectedStore?.id === store.id}
                onClick={() => handleStoreClick(store)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default StoreLocator;

