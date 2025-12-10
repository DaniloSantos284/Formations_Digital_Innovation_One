<img align="right" src="[https://user-images.githubusercontent.com/91434644/217682666-35255eaa-a554-4fd5-bd5b-045b1301fbe5.png](https://hermes.dio.me/tracks/48e9f018-f7c9-4f0f-b524-cd9223579626.png)" width="48%" heigth="400px" />
<img align="right" src="[https://user-images.githubusercontent.com/91434644/217682666-35255eaa-a554-4fd5-bd5b-045b1301fbe5.png](https://hermes.dio.me/tracks/a2d3983e-01db-4cfb-9402-fdedae795af0.png)" width="48%" heigth="400px" />

# [Formação React Native + Docker + API] 
## Formações Oferecidas pela Dio Global

# Aplicativo Mobile em React Native (Expo)

## Funcionalidades

- Cadastrar produtos usando câmera + código de barras
- Registrar entradas e saídas de estoque
- Visualizar histórico e dashboard
- Salvar tudo online usando API em Docker (Node + PostgreSQL)

## Descrição

Um projeto muito utilizado em lojas pequenas, mercados, bares, depósitos ou até inventários pessoais.

Ele mostra domínio de competências-chave em mobile:

- ✔ **Uso da câmera**  
  Para tirar fotos dos produtos — mostra experiência com permissões e recursos nativos.

- ✔ **Leitura de código de barras / QR Code**  
  Interage com sensores do celular.

- ✔ **CRUD com API real**  
  Demonstra habilidade full-stack.

- ✔ **Integração com banco de dados real**  
  Mostra que você entendo persistência e modelagem.

- ✔ **Design de navegação com bottom tabs + stack**  
  Estrutura muito usada em apps reais.

- ✔ **Uso de Context API ou Zustand**  
  Demonstra organização e gestão de estado.

- ✔ **Docker**  
  Mostra maturidade e noção de deploy.

É um projeto pouco comum em juniores.

# Arquitetura Geral do Projeto

## 📱 App Mobile (React Native Expo)
- **Câmera** (foto)
- **Scanner** (barcode)
- **Dashboard**
- **Lista de produtos**
- **Histórico de movimentações**
- **Login** (opcional)
- **Consumo da API**

## 🌐 API (Node.js + Express)
- **Rotas de produtos**
- **Rotas de estoque** (entrada/saída)
- **Upload de imagens** (multer)
- **Autenticação** (opcional)
- **Dockerfile**

## 🗄 Banco (PostgreSQL) – dockerizado

## 🐳 docker-compose.yml
- **api**
- **postgres**
- **pgAdmin** (opcional)

---

## 📱 FUNCIONALIDADES DO APP (Explicado no detalhe)

### 1. Cadastro de Produto
O usuário abre o app e toca em "Adicionar Produto".

**O fluxo:**
1️⃣ Aperta o botão “Ler Código de Barras”
   - Abre a câmera com `expo-barcode-scanner`
   - Lê automaticamente o código e preenche o campo “Código”.
  
2️⃣ Aperta “Adicionar Foto do Produto”
   - Tira foto usando `expo-camera`
   - Salva localmente e envia para a API no cadastro.
  
3️⃣ Preenche:
- Nome
- Categoria
- Quantidade inicial
- Preço (opcional)

🔄 Envia para a API → grava no banco → retorna ID e imagem hospedada.

### 2. Lista de Produtos
Tela com **FlatList**:
- Foto do produto
- Nome
- Quantidade em estoque
- Status visual:
  - vermelho: baixo estoque
  - amarelo: quantidade média
  - verde: ok

Clicando, abre a tela de detalhes.

### 3. Entrada e Saída de Estoque
Na tela do produto:
- [ Entrada ]
- [ Saída ]

**O fluxo é simples:**
1️⃣ Usuário aperta "Entrada"
2️⃣ Digita quantidade
3️⃣ API salva como "movimentação"
4️⃣ Estoque é automaticamente incrementado

A mesma lógica para “Saída”. Cada movimentação vira um registro no histórico.

### 4. Histórico
Exibe:
- Data
- Tipo (entrada/saída)
- Quantidade
- Foto do produto
- Usuário (opcional)

### 5. Dashboard
Simples, mas bonito:
- Total de produtos
- Quantidade total em estoque
- 5 produtos com menor estoque
- Gráfico (só se quiser usar Victory ou ReCharts)

Usuários adoram ver gráficos.

---

## 🔧 FUNCIONALIDADES TÉCNICAS (dentro do app)
- **Expo Camera** (foto)
- **Expo Barcode Scanner**
- **React Navigation** (Stack + Tab)
- **Context API** (auth + theme + products)
- **Axios** para consumo da API
- **Hooks personalizados** (ex: useProducts)
- **AsyncStorage** (para token ou cache simples)

---

## 🐳 Stack do Backend
**API em Node.js**
- **Rotas:**
  - POST `/products`
  - GET `/products`
  - GET `/products/:id`
  - PUT `/products/:id`
  - POST `/products/:id/in`
  - POST `/products/:id/out`
  - GET `/products/:id/history`

**Upload de imagens**
- Usando multer:
  - Salvando em `/uploads`
  - Servindo via `express static`

---

## 🗃 Banco de Dados (PostgreSQL)
### Tabela: products
- id
- name
- barcode
- img_url
- quantity
- category
- created_at

### Tabela: movements
- id
- product_id (FK)
- type (in/out)
- amount
- created_at

---

## 🐳 docker-compose.yml (arquitetura final)
- API Node
- PostgreSQL
- pgAdmin (opcional, ajuda visual)

> 🐳 *O app mobile não roda dentro do Docker — ele precisa acessar a API via IP da máquina.*

---

## 🎨 UX que impressiona:
Um júnior normalmente faz apps simples. Com esse, você entrega:
- Scanner + Foto
- CRUD bem feito
- Dashboard
- História de movimentações

Isso mostra nível intermediário mesmo sendo júnior.
