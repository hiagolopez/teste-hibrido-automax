import React, { useState, useCallback } from 'react';
import { geocodeCEP } from '../../../../services/geocodingService';
import { validateCEP, formatCEP } from '../../../../utils/validateCEP';
import styles from './styles.module.scss';

const CEPSearch = ({ onLocationFound, onLocationClear }) => {
  const [searchCEP, setSearchCEP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCEPChange = useCallback((e) => {
    const value = e.target.value;
    const formatted = formatCEP(value);
    setSearchCEP(formatted);
    setError(null);
  }, []);

  const handleCEPSearch = useCallback(async () => {
    const cleanCEP = searchCEP.replace(/\D/g, '');
    
    if (!validateCEP(cleanCEP)) {
      setError('CEP inválido. Digite um CEP com 8 dígitos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const location = await geocodeCEP(cleanCEP);
      onLocationFound(location);
    } catch (err) {
      setError(err.message || 'Erro ao buscar CEP. Verifique se a chave da API está configurada.');
      onLocationClear();
    } finally {
      setLoading(false);
    }
  }, [searchCEP, onLocationFound, onLocationClear]);

  const handleClear = useCallback(() => {
    setSearchCEP('');
    setError(null);
    onLocationClear();
  }, [onLocationClear]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleCEPSearch();
    }
  }, [handleCEPSearch]);

  return (
    <div className={styles.cepSearch}>
      <div className={styles.cepInputGroup}>
        <label htmlFor="cep-search">Buscar por CEP</label>
        <div className={styles.cepInputWrapper}>
          <input
            id="cep-search"
            type="text"
            value={searchCEP}
            onChange={handleCEPChange}
            onKeyPress={handleKeyPress}
            placeholder="00000-000"
            maxLength={9}
            pattern="[0-9]{5}-[0-9]{3}"
            className={styles.cepInput}
            disabled={loading}
          />
          {searchCEP && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Limpar CEP"
            >
              ×
            </button>
          )}
          <button
            type="button"
            onClick={handleCEPSearch}
            className={styles.searchButton}
            disabled={loading || !searchCEP}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    </div>
  );
};

export default CEPSearch;

