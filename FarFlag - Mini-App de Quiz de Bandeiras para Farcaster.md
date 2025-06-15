# FarFlag - Mini-App de Quiz de Bandeiras para Farcaster

## Descrição
FarFlag é um Mini-App de quiz de bandeiras desenvolvido para o ecossistema Farcaster. Os usuários devem identificar o país da bandeira exibida, com integração de mint de pontuação em USDC na rede BASE.

## Funcionalidades
- Quiz de bandeiras com 4 alternativas
- Sistema de pontuação (+10 pontos por acerto)
- Temporizador dinâmico (10s iniciais, diminui com a pontuação)
- Mint de NFT/token da pontuação (0,10 USDC na rede BASE)
- Compartilhamento no Farcaster
- Suporte a internacionalização (inglês padrão)

## Tecnologias
- Vite + React + TypeScript
- Farcaster Frame SDK
- React i18next para internacionalização
- Integração com carteira Ethereum (BASE network)

## Estrutura do Projeto
```
farflag/
├── public/
│   ├── flags/              # Imagens das bandeiras
│   └── .well-known/
│       └── farcaster.json  # Manifest do Mini-App
├── src/
│   ├── components/         # Componentes React
│   ├── data/              # Dados das bandeiras
│   ├── hooks/             # Custom hooks
│   ├── i18n/              # Configuração de internacionalização
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilitários
└── package.json
```

## Instalação
```bash
npm install
npm run dev
```

## Deploy
O aplicativo será hospedado em farflag.xyz

