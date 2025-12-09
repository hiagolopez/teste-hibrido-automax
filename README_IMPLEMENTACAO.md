# Implementação

## Funcionamento

O projeto simula a estrutura do VTEX IO. A rota `/nossas-lojas` está configurada em `store/routes.json` e o componente registrado em `store/interfaces.json`.

O componente StoreLocator utiliza o hook `useStores` para realizar a busca de dados. O serviço `storeService.js` simula uma chamada aos dados do Master Data ou dados cadastrados no Site Editor, retornando os dados do arquivo JSON.

Os filtros de estado e cidade são gerados dinamicamente a partir das lojas cadastradas.

## Simulação vs Produção

### Implementação Atual (Simulação)

Atualmente o projeto utiliza dados mockados:
- Dados armazenados em `src/data/stores.json` (simula dados do Master Data ou dados cadastrados no Site Editor)
- Serviço `storeService.js` simula chamadas assíncronas aos dados do Master Data ou dados cadastrados no Site Editor
- Hooks `useStores.js` encapsulam a lógica de busca (simulam o comportamento que os resolvers GraphQL teriam)
- Estrutura de pastas segue o padrão VTEX IO para facilitar a comparação com a implementação real

### Em Produção (VTEX IO)

Na implementação real em VTEX IO:
- Dados viriam do Master Data através de GraphQL resolvers
- Resolvers GraphQL em `node/resolvers/stores.ts` fariam queries reais ao Master Data
- Schema GraphQL em `graphql/schema.graphql` definiria os tipos e queries disponíveis
- Componente React permaneceria o mesmo, apenas mudando a origem dos dados (de hooks mockados para queries GraphQL)
- Rota `/nossas-lojas` seria configurada via `store/routes.json` no ambiente VTEX

## Dados

As lojas estão armazenadas em `src/data/stores.json`. Em produção, os dados seriam obtidos do Master Data através de GraphQL resolvers. Alternativamente, também seria possível cadastrar as lojas via schema utilizando o Site Editor, permitindo gerenciamento através da interface visual do editor.

## Execução

```bash
yarn install
yarn start
```

Acesse `http://localhost:3000/nossas-lojas`
