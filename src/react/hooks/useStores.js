import { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';

export const useStores = (filters = {}) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state, city } = filters;

  useEffect(() => {
    setLoading(true);
    storeService.getStores({ state, city })
      .then(response => {
        setStores(response.stores);
        setError(null);
      })
      .catch(err => {
        setError(err);
        setStores([]);
      })
      .finally(() => setLoading(false));
  }, [state, city]);

  return { stores, loading, error };
};

export const useStoreStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storeService.getStoreStates()
      .then(response => {
        setStates(response.states);
      })
      .finally(() => setLoading(false));
  }, []);

  return { states, loading };
};

export const useStoreCities = (state) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state) {
      setCities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    storeService.getStoreCities(state)
      .then(response => {
        setCities(response.cities);
      })
      .finally(() => setLoading(false));
  }, [state]);

  return { cities, loading };
};

