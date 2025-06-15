## Análise da Documentação Farcaster Mini Apps

### Visão Geral
- Mini Apps são aplicações web (HTML, CSS, JavaScript) que rodam dentro de clientes Farcaster.
- Utilizam um SDK para acessar funcionalidades nativas do Farcaster, como autenticação, notificações e interação com a carteira do usuário.

### Configuração do Projeto
- Para novos projetos, é recomendado usar o CLI `@farcaster/create-mini-app`.
- Para projetos existentes, o `@farcaster/frame-sdk` pode ser instalado via npm, pnpm ou yarn.

### Embeds de Mini Apps (Descoberta em Feeds Sociais)
- Utilizam metadados OpenGraph-inspired (`fc:frame` meta tag no `<head>` do HTML).
- O conteúdo do `fc:frame` é um JSON serializado contendo:
    - `version`: Versão do embed (ex: "next" ou "1").
    - `imageUrl`: URL da imagem para o embed (proporção 3:2, max 1024 caracteres).
    - `button`: Objeto com `title` (nome do Mini App, max 32 caracteres) e `action`.
    - `action`: Objeto com `type` (ex: `launch_frame`), `url` (URL do app), `name` (nome da aplicação), `splashImageUrl` (imagem da tela de carregamento, 200x200px), `splashBackgroundColor` (cor hexadecimal de fundo da tela de carregamento).

### Interface do Aplicativo
- Renderizado em um modal vertical. Tamanho para web: 424x695px.
- Cabeçalho: Exibe nome e autor do Mini App.
- Tela de Splash: Exibida ao iniciar o app, pode ser escondida pelo Mini App após o carregamento.

### SDK Farcaster
- Comunicação via canal `postMessage` (em iframes e WebViews móveis).
- **APIs Relevantes:**
    - `context`: Informações sobre o ambiente de execução do Mini App.
    - `actions`:
        - `addMiniApp`: Solicita ao usuário para adicionar o Mini App.
        - `close`: Fecha o Mini App.
        - `composeCast`: Solicita ao usuário para criar um cast (publicação).
        - `ready`: Esconde a tela de splash.
        - `signin`: Solicita ao usuário para fazer login com Farcaster.
        - `openUrl`: Abre uma URL externa.
        - `viewProfile`: Visualiza um perfil Farcaster.
        - `swapToken`: Solicita ao usuário para trocar tokens.
        - `sendToken`: Solicita ao usuário para enviar tokens.
        - `viewToken`: Visualiza um token.
    - `wallet`:
        - `getEthereumProvider`: Provedor Ethereum (EIP-1193).
        - `getSolanaProvider`: Provedor Solana (experimental).
- **Eventos:** O SDK permite que Mini Apps se inscrevam em eventos emitidos pelo Host.

### Manifest (/.well-known/farcaster.json)
- Metadados publicados para integração mais profunda com clientes Farcaster.
- Contém:
    - `accountAssociation`: Verifica a propriedade do domínio para uma conta Farcaster (assinatura JSON Farcaster).
    - `frame`: Metadados sobre o Mini App, incluindo `name`, `iconUrl`, `homeUrl`, `imageUrl`, `buttonTitle`, `splashImageUrl`, `splashBackgroundColor`, `webhookUrl`.

### Adicionando Mini Apps
- Usuários podem adicionar Mini Apps aos seus clientes Farcaster para acesso rápido e notificações.
- A ação `addMiniApp` pode ser usada para solicitar isso.

### Eventos do Servidor (Webhook)
- O servidor Host POSTa 4 tipos de eventos para o `webhookUrl` especificado no manifest:
    - `frame_added`
    - `frame_removed`
    - `notifications_enabled`
    - `notifications_disabled`
- Os eventos são assinados com a chave do aplicativo do usuário.

### Observações para o Projeto FarFlag
- **Tecnologia:** Vite + React.
- **Internacionalização (i18n):** Todo o texto deve ser parametrizado para os 3 idiomas (inglês padrão).
- **UI/UX:** Transições suaves, temporizador visível, feedback imediato.
- **Dados:** Base de dados JSON para bandeiras.
- **Mint e Blockchain:** Interação com contrato USDC na rede BASE, geração de transação de 0,10 USDC para endereço fixo (`0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a`). Usar `getEthereumProvider` para interação com a carteira.
- **Compartilhamento:** Usar `composeCast` do Farcaster SDK para compartilhar pontuação, hash da transação de mint, username e timestamp.
- **Domínio:** farflag.xyz.
- **Estrutura de Pastas:** Deve ser adequada para deploy no Farcaster.


