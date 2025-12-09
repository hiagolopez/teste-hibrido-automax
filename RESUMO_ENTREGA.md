# Resumo da Entrega

## O que foi desenvolvido

### Arquitetura
Documento contendo as decisões técnicas e estimativa de horas.

### Implementação
- Componente StoreLocator com filtros de estado e cidade
- Página `/nossas-lojas` funcional
- Lojas mockadas no arquivo JSON com dados de exemplo
- Estrutura seguindo o padrão VTEX IO

### Funcionalidades
- Listagem de todas as lojas
- Filtros por estado e cidade
- Exibição de detalhes ao selecionar uma loja
- Estados de carregamento

## Simulação vs Produção

### Implementação Atual

O projeto atual utiliza dados mockados para simular o ambiente VTEX IO:
- Dados em `src/data/stores.json` (simula dados do Master Data ou dados cadastrados no Site Editor)
- `storeService.js` simula chamadas assíncronas aos dados do Master Data ou dados cadastrados no Site Editor
- Hooks `useStores.js` encapsulam a lógica de busca (simulam o comportamento que os resolvers GraphQL teriam)
- Estrutura de pastas semelhante ao padrão VTEX IO

### Em Produção

Na implementação real em VTEX IO:
- Dados viriam do Master Data através de GraphQL resolvers, ou alternativamente via schema utilizando o Site Editor
- Schema GraphQL definiria os tipos e queries
- Componente React utilizaria queries GraphQL ao invés dos hooks mockados
- Apenas a forma de importação dos dados mudaria (de hooks + JSON para GraphQL + Master Data ou Site Editor)

A estrutura foi pensada para facilitar a comparação entre a simulação atual e a implementação real do VTEX IO.

## Como testar

```bash
yarn install
yarn start
```

Acesse `/nossas-lojas`
