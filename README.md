# Legends-ZA-DLC-DEX

O Legends-ZA-DLC-DEX é um projeto de um Pokédex tracker focado no jogo Pokémon Legends: Z-A, incluindo o conteúdo do DLC. A aplicação permite aos utilizadores registarem-se, fazerem login e acompanharem os Pokémon que já capturaram.

## Funcionalidades

- **Registo e Login de Utilizadores:** Sistema de autenticação seguro para que cada utilizador tenha a sua própria lista de Pokémon.
- **Pokédex Completa:** Lista de todos os Pokémon disponíveis no jogo base e no DLC.
- **Controlo de Captura:** Marque os Pokémon que já capturou e acompanhe o seu progresso.
- **Interface Intuitiva:** Design simples e fácil de usar para uma navegação fluida.

## Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

| Tecnologia | Descrição |
|---|---|
| **React** | Biblioteca JavaScript para a construção da interface de utilizador. |
| **Vite** | Ferramenta de build para um desenvolvimento front-end mais rápido. |
| **Tailwind CSS** | Framework de CSS para a estilização da aplicação. |
| **Node.js** | Ambiente de execução para o servidor back-end. |
| **React Router** | Para a gestão de rotas na aplicação. |

## Como Começar

Para executar o projeto localmente, siga os passos abaixo.

### Pré-requisitos

Certifique-se que tem o [Node.js](https://nodejs.org/) instalado na sua máquina.

### Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/Cordeiro-99/Legends-ZA-DLC-DEX.git
   ```
2. Navegue para o diretório do projeto:
   ```sh
   cd Legends-ZA-DLC-DEX
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```

### Execução

1. Inicie o servidor de desenvolvimento do Vite (front-end):
   ```sh
   npm run dev
   ```
2. Em outro terminal, inicie o servidor Node.js (back-end):
   ```sh
   cd server
   node server.js
   ```
3. Abra o seu navegador e aceda a `http://localhost:5173`.

## Estrutura do Projeto

A estrutura de ficheiros do projeto está organizada da seguinte forma:

```
/Legends-ZA-DLC-DEX
|-- /node_modules
|-- /server
|   |-- server.js
|-- /src
|   |-- /api
|   |-- /components
|   |-- /context
|   |-- /data
|   |-- /pages
|   |-- App.jsx
|   |-- main.jsx
|-- .gitignore
|-- index.html
|-- package.json
|-- README.md
```

## Contribuições

As contribuições são bem-vindas! Se tiver alguma sugestão ou encontrar algum problema, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.

## Licença

Este projeto não possui uma licença definida.
