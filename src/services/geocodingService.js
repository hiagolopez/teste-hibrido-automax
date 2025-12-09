const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const geocodeCEP = async (cep) => {
  const cleanCEP = cep.replace(/\D/g, '');
  
  try {
    const viaCEPResponse = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const viaCEPData = await viaCEPResponse.json();
    
    if (viaCEPData.erro) {
      throw new Error('CEP não encontrado. Verifique se o CEP está correto.');
    }

    const address = `${viaCEPData.localidade}, ${viaCEPData.uf}, Brasil`;
    
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'StoreLocator/1.0'
        }
      }
    );
    
    const nominatimData = await nominatimResponse.json();
    
    if (nominatimData && nominatimData.length > 0) {
      const location = nominatimData[0];
      return {
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
        address: `${viaCEPData.logradouro || ''}, ${viaCEPData.bairro || ''}, ${viaCEPData.localidade}, ${viaCEPData.uf}`.replace(/^,\s*|,\s*$/g, ''),
        cep: cleanCEP,
        city: viaCEPData.localidade,
        state: viaCEPData.uf
      };
    } else {
      throw new Error('Não foi possível obter as coordenadas do CEP.');
    }
  } catch (error) {
    if (error.message.includes('CEP não encontrado') || error.message.includes('Não foi possível')) {
      throw error;
    }
    throw new Error('Erro ao buscar coordenadas do CEP. Verifique sua conexão com a internet.');
  }
};

export const findNearestStores = (stores, userLat, userLng) => {
  return stores
    .map(store => ({
      ...store,
      distance: calculateDistance(
        userLat,
        userLng,
        store.latitude,
        store.longitude
      )
    }))
    .sort((a, b) => a.distance - b.distance);
};

