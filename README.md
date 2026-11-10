# Minha Lista de Compras

Aplicação web responsiva para organizar compras do mercado. Adicione produtos e quantidades, acompanhe o progresso e mantenha a lista salva no navegador.

## Funcionalidades

- Adicionar produtos com quantidade opcional.
- Marcar produtos como comprados e acompanhar o progresso da lista.
- Filtrar produtos pendentes e comprados.
- Remover produtos individualmente ou limpar os já comprados.
- Salvar a lista automaticamente no navegador.
- Exportar e importar cópias da lista em JSON.
- Interface adaptada para celular, tablet e desktop.
- Instalação como aplicativo (PWA) em navegadores compatíveis.

## Tecnologias Usadas

- React 18
- Vite 5
- JavaScript (ES Modules)
- CSS responsivo
- vite-plugin-pwa

## Requisitos

- Node.js 18 ou superior.
- npm.

## Executar localmente

```bash
npm ci
npm run dev
```

Abra o endereço informado pelo Vite, normalmente `http://localhost:5173`.

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Cria a versão de produção na pasta `dist/`. |
| `npm run preview` | Abre localmente a versão de produção. |

## Publicar no GitHub

1. Crie um repositório vazio no GitHub.
2. Se esta pasta ainda não estiver inicializada com Git, execute `git init -b main`.
3. Adicione e crie o primeiro commit:

   ```bash
   git add .
   git commit -m "feat: primeira versão da Minha Lista de Compras"
   ```

4. Conecte o repositório remoto e envie os arquivos. Substitua os valores de exemplo pelo seu usuário e pelo nome do repositório:

   ```bash
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

`node_modules/`, `dist/`, arquivos de ambiente e cache local estão excluídos pelo `.gitignore`. O arquivo `package-lock.json` deve ser mantido no repositório para instalações reproduzíveis.

## GitHub Pages

O Vite aceita o caminho base pela variável `VITE_BASE_PATH`. Para uma publicação em `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`, use o nome do repositório com barras inicial e final ao gerar a versão:

```bash
VITE_BASE_PATH=/SEU-REPOSITORIO/ npm run build
```

No PowerShell:

```powershell
$env:VITE_BASE_PATH = "/SEU-REPOSITORIO/"
npm run build
```

Para desenvolvimento local ou publicação na raiz de um domínio, o caminho padrão `/` pode ser usado. A pasta `dist/` é o resultado gerado e não deve ser enviada como código-fonte.

## Armazenamento e privacidade

A lista fica no `localStorage` do navegador e do aparelho em que foi criada. Ela não é enviada a um servidor nem sincroniza entre dispositivos. Use **Salvar cópia** e **Abrir cópia** para transferi-la manualmente em um arquivo JSON. Importar uma cópia substitui a lista atual após confirmação.

## Estrutura

```text
public/
├── icon.svg
└── logo-minha-lista.svg
src/
├── components/
├── App.jsx
├── index.css
├── main.jsx
└── storage.js
index.html
package.json
package-lock.json
vite.config.js
```

## Licença

Este projeto ainda não define uma licença. Escolha e adicione uma licença antes de permitir que outras pessoas reutilizem, modifiquem ou redistribuam o código.

