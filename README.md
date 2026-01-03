# Pomodoro Timer

Um aplicativo de timer Pomodoro simples e bonito, construído com tecnologias web modernas.

![Screenshot do Aplicativo](https://i.imgur.com/your-screenshot.png) 

## Funcionalidades

*   Timer Pomodoro personalizável (tempo de trabalho, pausa curta, pausa longa).
*   Notificações para o final de cada sessão.
*   Design minimalista e fácil de usar.
*   Multiplataforma (Windows, macOS e Linux).

## Tecnologias Utilizadas

*   **[Electron](https://www.electronjs.org/)**: Para criar aplicativos de desktop com JavaScript, HTML e CSS.
*   **[React](https://reactjs.org/)**: Uma biblioteca JavaScript para construir interfaces de usuário.
*   **[TypeScript](https://www.typescriptlang.org/)**: Um superconjunto de JavaScript que adiciona tipagem estática.
*   **[Tailwind CSS](https://tailwindcss.com/)**: Um framework CSS utilitário para criar designs personalizados rapidamente.
*   **[Vite](https://vitejs.dev/)**: Ferramenta de build que visa fornecer uma experiência de desenvolvimento mais rápida e enxuta para projetos web modernos.
*   **[Electron Builder](https://www.electron.build/)**: Uma solução completa para empacotar e construir um aplicativo Electron pronto para distribuição.

## Começando

Para rodar o projeto localmente, siga os passos abaixo.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior)
*   [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)

### Instalação e Execução

1.  Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/pomodoro-timer.git
    cd pomodoro-timer
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```
    ou
    ```bash
    pnpm install
    ```

3.  Rode o aplicativo em modo de desenvolvimento:
    ```bash
    npm run dev
    ```

## Build

Para criar os executáveis do aplicativo para sua plataforma, use um dos seguintes comandos:

*   **Windows**:
    ```bash
    npm run build:win
    ```

*   **macOS**:
    ```bash
    npm run build:mac
    ```

*   **Linux**:
    ```bash
    npm run build:linux
    ```

Os arquivos de build serão criados no diretório `dist`.

## Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.