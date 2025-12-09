import storesData from '../data/stores.json';

// Simulação de query dos dados do Master Data ou dados cadastrados no Site Editor
const simulateMasterDataQuery = (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = storesData.filter(store => store.active);

      if (filters.state) {
        filtered = filtered.filter(store => store.estado === filters.state);
      }

      if (filters.city) {
        filtered = filtered.filter(store => store.cidade === filters.city);
      }

      resolve({
        status: 200,
        message: 'Success',
        stores: filtered
      });
    }, 300);
  });
};

// Simulação de getStoreStates
const simulateGetStates = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const uniqueStates = Array.from(
        new Set(storesData.filter(s => s.active).map(store => store.estado))
      ).map(estado => ({
        sigla: estado,
        nome: estado
      }));

      resolve({
        status: 200,
        message: 'Success',
        states: uniqueStates.sort((a, b) => a.nome.localeCompare(b.nome))
      });
    }, 200);
  });
};

// Simulação de getStoreCities
const simulateGetCities = (state) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const uniqueCities = Array.from(
        new Set(
          storesData
            .filter(store => store.active && store.estado === state)
            .map(store => store.cidade)
        )
      );

      resolve({
        status: 200,
        message: 'Success',
        cities: uniqueCities.sort().map(cidade => ({
          cidade,
          estado: state,
          sigla: state
        }))
      });
    }, 200);
  });
};

export const storeService = {
  getStores: simulateMasterDataQuery,
  getStoreStates: simulateGetStates,
  getStoreCities: simulateGetCities
};

