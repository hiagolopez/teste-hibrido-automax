import React, { useMemo, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import styles from './styles.module.scss';

const libraries = ['places'];

const defaultCenter = {
  lat: -23.5614,
  lng: -46.6558
};

const defaultOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

const StoreMap = ({ stores, selectedStore, onMarkerClick }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
  const mapRef = useRef(null);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries
  });

  const mapCenter = useMemo(() => {
    if (selectedStore) {
      return {
        lat: selectedStore.latitude,
        lng: selectedStore.longitude
      };
    }
    if (stores.length === 0) return defaultCenter;
    if (stores.length === 1) {
      return {
        lat: stores[0].latitude,
        lng: stores[0].longitude
      };
    }
    const avgLat = stores.reduce((sum, store) => sum + store.latitude, 0) / stores.length;
    const avgLng = stores.reduce((sum, store) => sum + store.longitude, 0) / stores.length;
    return { lat: avgLat, lng: avgLng };
  }, [stores, selectedStore]);

  useEffect(() => {
    if (selectedStore && mapRef.current && isLoaded && window.google) {
      mapRef.current.panTo({
        lat: selectedStore.latitude,
        lng: selectedStore.longitude
      });
      mapRef.current.setZoom(15);
    }
  }, [selectedStore, isLoaded]);

  if (loadError) {
    return (
      <div className={styles.errorContainer}>
        Erro ao carregar o mapa. Verifique a chave da API do Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        Carregando mapa...
      </div>
    );
  }

  const zoom = selectedStore ? 15 : stores.length === 1 ? 15 : stores.length > 1 ? 10 : 5;

  return (
    <div className={styles.mapContainer}>
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%',
          borderRadius: '8px'
        }}
        center={mapCenter}
        zoom={zoom}
        options={defaultOptions}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={{
            lat: store.latitude,
            lng: store.longitude
          }}
          title={store.nome}
          onClick={() => onMarkerClick && onMarkerClick(store)}
          icon={isLoaded && window.google ? {
            url: selectedStore?.id === store.id 
              ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
              : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          } : undefined}
        />
      ))}
      </GoogleMap>
    </div>
  );
};

export default StoreMap;

