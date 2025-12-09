# Store Locator - Automax

Projeto desenvolvido para o desafio técnico VTEX. Implementa uma página de localização de lojas físicas.

## Como executar

```bash
yarn install
yarn start
```

Acesse `/nossas-lojas` para visualizar a página de lojas.

## Funcionalidades

- Listagem de lojas
- Filtros por estado e cidade
- Busca por CEP (encontra a loja mais próxima)
- Mapa interativo com pins das lojas
- Visualização de detalhes da loja (telefone, horário, endereço, distância)
- Dados mockados em JSON (simula dados do Master Data ou dados cadastrados no Site Editor)

## Tecnologias

- React, React Router
- SASS (CSS Modules)
- Google Maps JavaScript API
- ViaCEP API (geocodificação)
- Nominatim/OpenStreetMap API (geocodificação)

## Documentação

Para mais detalhes sobre a arquitetura, decisões técnicas e estimativas, consulte o arquivo [ARQUITETURA_E_ESTIMATIVA.md](./ARQUITETURA_E_ESTIMATIVA.md).

## Google Maps

O projeto utiliza a API do Google Maps para exibir o mapa interativo com as localizações das lojas. A API oferece um plano gratuito com créditos mensais que atende a maioria dos casos de uso. Após o limite de requisições gratuitas, é necessário realizar pagamento para continuar utilizando.

Para utilizar o mapa, é necessário obter uma chave da API no [Google Cloud Console](https://console.
cloud.google.com/) e configurá-la no projeto através da variável de ambiente.
Exemplo de variável utilizada nesse teste: `REACT_APP_GOOGLE_MAPS_API_KEY`
Sem a chave configurada, o mapa não será exibido.