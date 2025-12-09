import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useStores, useStoreStates, useStoreCities } from '../../hooks/useStores';
import { findNearestStores } from '../../services/geocodingService';
import styles from './styles.module.scss';
import StoreCard from './StoreCard';
import StoreMap from './StoreMap';
import CEPSearch from './CEPSearch';

const StoreLocator = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapWrapperRef = useRef(null);

  // Busca todas as lojas (sem filtros) para usar no cálculo de proximidade
  const { stores: allStoresCache } = useStores({ ignoreFilters: true });
  
  // Busca lojas filtradas para exibição quando não há userLocation
  const storeFilters = useMemo(() => ({
    state: selectedState || undefined,
    city: selectedCity || undefined,
    ignoreFilters: false
  }), [selectedState, selectedCity]);

  const { stores: filteredStoresData, loading: storesLoading } = useStores(storeFilters);

  const filteredStores = useMemo(() => {
    if (userLocation && allStoresCache.length > 0) {
      // Quando há userLocation, usa todas as lojas do cache para calcular a mais próxima
      return findNearestStores(allStoresCache, userLocation.latitude, userLocation.longitude);
    }
    // Quando não há userLocation, usa as lojas filtradas
    return filteredStoresData;
  }, [allStoresCache, filteredStoresData, userLocation]);

  const { states, loading: statesLoading } = useStoreStates();
  const { cities, loading: citiesLoading } = useStoreCities(selectedState);

  const handleStateChange = useCallback((e) => {
    const scrollPosition = window.scrollY;
    setSelectedState(e.target.value);
    setSelectedCity('');
    setSelectedStore(null);
    setUserLocation(null);
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  }, []);

  const handleCityChange = useCallback((e) => {
    const scrollPosition = window.scrollY;
    setSelectedCity(e.target.value);
    setSelectedStore(null);
    setUserLocation(null);
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  }, []);

  const handleStoreClick = useCallback((store) => {
    const isDeselecting = store.id === selectedStore?.id;
    setSelectedStore(isDeselecting ? null : store);
    
    if (!isDeselecting && mapWrapperRef.current) {
      setTimeout(() => {
        mapWrapperRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [selectedStore]);

  const handleLocationFound = useCallback((location) => {
    // Limpa todos os filtros e define userLocation imediatamente
    setSelectedState('');
    setSelectedCity('');
    setSelectedStore(null);
    setUserLocation(location);
  }, []);

  useEffect(() => {
    if (userLocation && filteredStores.length > 0 && filteredStores[0]?.distance !== undefined) {
      if (!selectedStore) {
        setSelectedStore(filteredStores[0]);
      } else {
        const isSelectedStoreInFiltered = filteredStores.some(store => store.id === selectedStore.id);
        if (!isSelectedStoreInFiltered) {
          setSelectedStore(filteredStores[0]);
        }
      }
    } else if (!userLocation && filteredStores.length > 0 && (selectedState || selectedCity)) {
      const isSelectedStoreInFiltered = selectedStore && filteredStores.some(store => store.id === selectedStore.id);
      if (!isSelectedStoreInFiltered) {
        setSelectedStore(filteredStores[0]);
      }
    }
  }, [userLocation, selectedState, selectedCity, filteredStores, selectedStore]);

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
            disabled={statesLoading}
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
              disabled={citiesLoading}
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

      <div ref={mapWrapperRef} className={styles.mapWrapper}>
        {storesLoading && filteredStores.length === 0 ? (
          <div className={styles.mapPlaceholder}>Carregando mapa...</div>
        ) : filteredStores.length > 0 ? (
          <StoreMap
            stores={filteredStores}
            selectedStore={selectedStore}
            userLocation={userLocation}
            onMarkerClick={handleStoreClick}
          />
        ) : null}
      </div>

      {storesLoading && filteredStores.length === 0 ? (
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

