# Arquitetura e Estimativa

## Decisões Técnicas

### Armazenamento de Dados

Será utilizado Master Data para armazenar as lojas. Trata-se de uma solução nativa da VTEX, possui interface no Admin e permite que a equipe de marketing gerencie os dados sem necessidade de intervenção de desenvolvimento.

Alternativamente, também é possível cadastrar as lojas via schema utilizando o Site Editor, permitindo que a equipe de conteúdo gerencie diretamente através da interface visual do editor.

Campos necessários:
- nome, rua, numero, bairro, cidade, estado, cep
- telefone, horarioFuncionamento
- latitude, longitude
- active

### Interface Administrativa

A interface nativa do Master Data atende aos requisitos. A configuração das tabelas e campos no Master Data é simples e rápida, estimada em aproximadamente 2 horas. Como alternativa, o cadastro via Site Editor também pode ser utilizado, oferecendo uma interface visual para gerenciamento das lojas.

### APIs

**APIs VTEX:**
- **Master Data API V2**: Para buscar, criar, atualizar e deletar registros de lojas. Utilizada através dos resolvers GraphQL no backend.
- **GraphQL API**: Para expor queries customizadas ao frontend, permitindo filtros por estado, cidade e listagem de estados/cidades disponíveis.

**APIs de Terceiros:**
- **Google Maps JavaScript API**: Para renderização do mapa interativo com pins das lojas. Requer chave de API configurada no ambiente.
- **ViaCEP API** (funcionalidade opcional): API gratuita para busca de endereços a partir de CEP, utilizada na funcionalidade de busca por CEP.
- **Nominatim/OpenStreetMap API** (funcionalidade opcional): API gratuita para geocodificação reversa (conversão de endereço em coordenadas latitude/longitude), utilizada na funcionalidade de busca por CEP.

### Frontend

Será criada uma página customizada utilizando `store.custom` na rota `/nossas-lojas`. O componente React realizará a busca dos dados através de GraphQL.

### Integração com Google Maps

É totalmente viável exibir o mapa do Google com pins nas coordenadas das lojas. As coordenadas (latitude e longitude) já estão armazenadas no Master Data. A implementação pode ser feita utilizando:

- **Google Maps JavaScript API**: Integração direta com a API do Google
- **Bibliotecas React**: `@react-google-maps/api` ou `react-google-maps` para facilitar a integração

O mapa exibiria pins para cada loja filtrada, permitindo visualização geográfica e interação (clique no pin para ver detalhes da loja). A estimativa de 8h considera a integração completa com filtros dinâmicos e responsividade.

## Implementação Atual vs Produção

### Simulação Atual

A implementação atual utiliza dados mockados para desenvolvimento:
- Arquivo `src/data/stores.json` contém as lojas de teste (simula dados do Master Data ou dados cadastrados no Site Editor)
- `storeService.js` simula as chamadas aos dados do Master Data ou dados cadastrados no Site Editor com delay assíncrono
- Hooks `useStores.js` encapsulam a lógica de busca (simulam o comportamento que os resolvers GraphQL teriam em produção)
- Estrutura de pastas mantém o padrão VTEX IO para facilitar a comparação com a implementação real

### Em Produção (VTEX IO)

Na implementação real:
- Dados viriam do Master Data via GraphQL resolvers em `node/resolvers/stores.ts`
- Schema GraphQL em `graphql/schema.graphql` definiria os tipos e queries disponíveis
- Resolvers fariam queries reais utilizando o cliente Master Data
- Componente React utilizaria queries GraphQL ao invés dos hooks mockados
- Rota configurada via `store/routes.json` no ambiente VTEX

A estrutura atual foi pensada para facilitar a comparação com a implementação real do VTEX IO, mantendo a mesma organização de pastas e nomenclatura.

## Estimativa

MVP: 32 horas
- Configurações do repositório: 4h
  - Configuração do manifest.json e importações de dependências
  - Estrutura de pastas (node, react, graphql, store)
  - Configuração de dependências e build
  - Configuração inicial do schema GraphQL
- Configuração Master Data: 2h
- Desenvolvimento das queries GraphQL: 8h
  - Criação do schema GraphQL com types e queries
  - Implementação dos resolvers para buscar lojas do Master Data
  - Queries para filtrar por estado, cidade, listagem de estados, cidades disponíveis
- Componente React: 12h
- Página: 4h
- Dados de teste: 2h

Funcionalidades opcionais:
- Busca por CEP: 6h
- Google Maps: 8h
