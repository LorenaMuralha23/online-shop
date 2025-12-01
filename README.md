# 🛍️ Online-Shop

A Online Shop é uma aplicação web desenvolvida em React + TypeScript utilizando Ant Design como biblioteca de UI pelos alunos **Maria Lorena Muralha Lima** e **Luis Fernando Vicarri**.
O projeto integra todas as funcionalidades desenvolvidas ao longo das atividades da disciplina Tópicos Especiais em Programação, reunindo:

- Página inicial com destaque para os Top 5 produtos da Fake Store API.

- Página de produtos com listagem, cadastro, edição, exclusão e busca.

- Página de clientes com CRUD completo, edição via Drawer e exclusão via modal.

- Sistema de login, logout, registro e perfil do usuário.

- Controle de acesso baseado em autenticação e permissões (user/admin).

- Carrinho de compras persistente, com visualização, remoção e finalização.

- Aplicação totalmente responsiva, com tema claro/escuro e uso dos tokens do Ant Design.

Todos os dados são persistidos localmente utilizando LocalStorage.

---

## 🧱 Funcionalidades Implementadas

### 🏠 HomePage

- Exibe o título "Welcome to the Shop"

- Lista dos Top 5 Products da Fake Store API

- Cards com imagem, título e preço

- Preview de imagem com Image do Ant Design

- Spin durante o carregamento

### 🛒 Products

- Busca de produtos da Fake Store API

- Cadastro de produtos via Modal


- Busca por nome de produto

- Fallback para imagem inválida

- Integração com Redux + LocalStorage

### ✏️ Edição e Exclusão de Produtos

- Edição via Drawer

- Exclusão com confirmação via Popconfirm

- Persistência no LocalStorage

- Atualização automática usando Redux

### 👥 Clients

- Tabela com: Nome, Email, Criado em, Endereço, Telefone, Status e Ações

- Data aleatória em até 5 anos para o campo “Criado em”

- Status com Tag (activated/deactivated)

- Edição via Drawer

- Exclusão via Modal

- Cadastro de novos clientes

- Ordenação por Nome, Criado em e Status

- Armazenamento via Redux + LocalStorage

- Tema claro/escuro

### 🔐 Autenticação e Controle de Acesso

- Login com validação de credenciais

- Exibição de erro para credenciais inválidas

- Logout apagando dados do LocalStorage

- Cadastro completo de usuários

- Edição e remoção de usuários (CRUD)

- Página de Perfil com:

  - nome

  - e-mail

  - imagem

  - histórico de compras

  ### 🛍️ Carrinho de Compras

- Adicionar produtos ao carrinho

- Drawer/Modal exibindo o carrinho

- Quantidade, valores e total

- Remover produtos individualmente

- Limpar carrinho

- Finalizar compra com mensagem de sucesso

- Persistência total no LocalStorage

### 🛠️ Tecnologias Utilizadas

- React + Vite + TypeScript

- Ant Design (AntD)

- Redux Toolkit

- React Router DOM

- Fake Store API

- LocalStorage

- Hooks: useState, useEffect, useMemo

## ▶️ Como Executar o Projeto
1. Clonar o repositório
```bash
git clone https://github.com/LorenaMuralha23/online-shop.git
```

2. Acessar o diretório
```bash
cd online-shop
```

3. Instalar dependências
```bash
npm install
```

4. Rodar o servidor de desenvolvimento
```bash
npm run dev
```

5. Acessar no navegador:
```bash
http://localhost:5173
```
### 🔐 Atenção: É necessário criar uma conta para usar a aplicação

Para acessar as funcionalidades internas da loja — como cadastrar produtos, visualizar clientes, acessar o carrinho, editar perfil e outras ações — é obrigatório criar uma conta.

✔️ Como funciona o acesso:

1. Ao abrir a aplicação, o usuário deve clicar no botão "Criar Cadastro", abaixo do botão de LogIn, para criar uma conta.

![Botão de Cadastro](image-1.png)

2. Após o cadastro, o usuário pode fazer login normalmente.

Sem estar autenticado, páginas restritas exibirão mensagens informando a necessidade de login.

## 🎯 Objetivo Acadêmico

- O projeto consolida conhecimentos sobre:

- Componentização

- Hooks avançados

- Gerenciamento de estado com Redux

- Integração com API externa

- Ant Design e tokens de estilo

- Design responsivo

- Autenticação e autorização

## 🙏 Agradecimento

Obrigado por acompanhar o desenvolvimento desta aplicação!
Críticas e sugestões são muito bem-vindas.

📧 Contatos: 

maria.ml2004@aluno.ifsc.edu.br
ou
luis.v01@aluno.ifsc.edu.br