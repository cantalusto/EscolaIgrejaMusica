# 🎵 Sistema de Gerenciamento - Escola de Música da Igreja

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Sistema completo e moderno para gerenciar alunos, instrumentos, presenças e pagamentos de escolas de música.

[Demo](#-demonstração) • [Instalação](#-instalação) • [Funcionalidades](#-funcionalidades) • [Documentação](#-documentação)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Banco de Dados](#-banco-de-dados)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 Sobre o Projeto

O **Sistema de Gerenciamento para Escola de Música** é uma aplicação web completa desenvolvida especificamente para igrejas e instituições de ensino musical. O sistema oferece controle total sobre instrumentos, alunos, presenças e pagamentos, com interface moderna e intuitiva.

### ✨ Principais Diferenciais

- 🔄 **Atualizações em tempo real** - Sincronização automática entre módulos
- 🎯 **Controle de disponibilidade** - Gestão inteligente de instrumentos limitados
- 📊 **Relatórios visuais** - Gráficos e estatísticas detalhadas
- 🎨 **Interface moderna** - Design responsivo e acessível
- 🔒 **Validações robustas** - Integridade de dados garantida

## 🚀 Funcionalidades

### 🎵 Gerenciamento de Instrumentos
- ✅ Cadastro de instrumentos com quantidade limitada
- ✅ Controle de disponibilidade em tempo real
- ✅ Validação para evitar conflitos de reserva
- ✅ Histórico de uso por instrumento
- ✅ Relatórios de utilização

### 👥 Cadastro de Alunos
- ✅ Cadastro completo (nome, idade, contato, instrumento)
- ✅ Seleção automática apenas de instrumentos disponíveis
- ✅ Atualização automática de disponibilidade
- ✅ Status de pagamento integrado
- ✅ Histórico completo do aluno

### 📅 Sistema de Chamada
- ✅ Controle de presença por data
- ✅ Histórico completo de presenças
- ✅ Estatísticas de frequência por aluno
- ✅ Funcionalidades em lote (marcar todos, limpar chamada)
- ✅ Relatórios de frequência
- ✅ Filtros por período e aluno

### 💰 Controle de Pagamentos
- ✅ Geração automática de mensalidades
- ✅ Controle de status de pagamento
- ✅ Relatórios com gráficos e estatísticas
- ✅ Dashboard financeiro
- ✅ Controle de inadimplência
- ✅ Histórico de pagamentos

## 🛠 Tecnologias

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[React 19](https://react.dev/)** - Biblioteca para interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI modernos
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos
- **[Lucide React](https://lucide.dev/)** - Ícones modernos

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - API serverless
- **[Prisma ORM](https://www.prisma.io/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional

### Ferramentas de Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código
- **[Husky](https://typicode.github.io/husky/)** - Git hooks

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/seu-usuario/escola-musica-sistema.git
cd escola-musica-sistema
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
# ou
yarn install
\`\`\`

### 3. Configure as variáveis de ambiente

\`\`\`bash
cp .env.example .env
\`\`\`

Edite o arquivo `.env` com suas configurações:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/escola_musica?schema=public"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui"
\`\`\`

### 4. Configure o banco de dados

\`\`\`bash
# Gerar o cliente Prisma
npx prisma generate

# Executar as migrações
npx prisma db push

# Popular com dados iniciais (opcional)
npm run db:seed
\`\`\`

### 5. Execute o projeto

\`\`\`bash
npm run dev
\`\`\`

O sistema estará disponível em `http://localhost:3000`

## ⚙️ Configuração

### Scripts Disponíveis

\`\`\`bash
# Desenvolvimento
npm run dev          # Executar em modo desenvolvimento
npm run build        # Build para produção
npm run start        # Executar build de produção
npm run lint         # Verificar código

# Banco de dados
npm run db:seed      # Popular banco com dados iniciais
npm run db:reset     # Resetar banco de dados
npm run db:studio    # Abrir Prisma Studio
\`\`\`

### Configuração do Banco

O sistema utiliza PostgreSQL com Prisma ORM. Para configurar:

1. Crie um banco PostgreSQL
2. Configure a `DATABASE_URL` no arquivo `.env`
3. Execute as migrações com `npx prisma db push`

## 📖 Uso

### Dashboard Principal

O dashboard oferece uma visão geral do sistema com:
- Estatísticas gerais (alunos, instrumentos, presenças)
- Gráficos de frequência
- Status de pagamentos
- Ações rápidas

### Gerenciamento de Instrumentos

1. Acesse **Instrumentos** no menu
2. Clique em **Novo Instrumento**
3. Preencha nome e quantidade disponível
4. O sistema controlará automaticamente a disponibilidade

### Cadastro de Alunos

1. Acesse **Alunos** no menu
2. Clique em **Novo Aluno**
3. Preencha os dados pessoais
4. Selecione um instrumento disponível
5. O sistema criará automaticamente o primeiro pagamento

### Sistema de Chamada

1. Acesse **Chamada** no menu
2. Selecione a data da aula
3. Marque presença/falta para cada aluno
4. Use "Marcar Todos" para agilizar o processo

### Controle de Pagamentos

1. Acesse **Pagamentos** no menu
2. Visualize status de todos os pagamentos
3. Marque como pago quando necessário
4. Acesse relatórios detalhados

## 📁 Estrutura do Projeto

\`\`\`
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   │   ├── alunos/        # Endpoints de alunos
│   │   ├── instrumentos/  # Endpoints de instrumentos
│   │   ├── presencas/     # Endpoints de presenças
│   │   └── pagamentos/    # Endpoints de pagamentos
│   ├── alunos/            # Página de alunos
│   ├── chamada/           # Página de chamada
│   ├── instrumentos/      # Página de instrumentos
│   ├── pagamentos/        # Página de pagamentos
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Dashboard
├── components/            # Componentes React
│   ├── alunos/           # Componentes de alunos
│   ├── chamada/          # Componentes de chamada
│   ├── instrumentos/     # Componentes de instrumentos
│   ├── layout/           # Componentes de layout
│   ├── pagamentos/       # Componentes de pagamentos
│   └── ui/               # Componentes base (shadcn/ui)
├── lib/                  # Utilitários
│   ├── prisma.ts         # Cliente Prisma
│   ├── types.ts          # Tipos TypeScript
│   └── utils.ts          # Funções utilitárias
├── prisma/               # Configuração do banco
│   └── schema.prisma     # Schema do banco
└── scripts/              # Scripts SQL
    ├── seed-database.sql # Estrutura inicial
    └── create-sample-data.sql # Dados de exemplo
\`\`\`

## 🔌 API

### Endpoints Principais

#### Instrumentos
- `GET /api/instrumentos` - Listar instrumentos
- `POST /api/instrumentos` - Criar instrumento
- `PUT /api/instrumentos/[id]` - Atualizar instrumento
- `DELETE /api/instrumentos/[id]` - Excluir instrumento

#### Alunos
- `GET /api/alunos` - Listar alunos
- `POST /api/alunos` - Criar aluno
- `PUT /api/alunos/[id]` - Atualizar aluno
- `DELETE /api/alunos/[id]` - Excluir aluno

#### Presenças
- `GET /api/presencas` - Listar presenças
- `POST /api/presencas` - Registrar presença

#### Pagamentos
- `GET /api/pagamentos` - Listar pagamentos
- `POST /api/pagamentos` - Criar pagamento
- `PUT /api/pagamentos/[id]` - Atualizar pagamento

### Exemplo de Uso da API

\`\`\`typescript
// Buscar alunos
const response = await fetch('/api/alunos');
const alunos = await response.json();

// Criar novo aluno
const novoAluno = await fetch('/api/alunos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    idade: 25,
    instrumentoId: 1
  })
});
\`\`\`

## 🗄️ Banco de Dados

### Schema Principal

\`\`\`sql
-- Instrumentos disponíveis
CREATE TABLE instrumentos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  quantidade INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alunos cadastrados
CREATE TABLE alunos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  idade INTEGER NOT NULL,
  instrumento_id INTEGER REFERENCES instrumentos(id),
  status_pagamento VARCHAR(20) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Registro de presenças
CREATE TABLE presencas (
  id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES alunos(id),
  data DATE NOT NULL,
  presente BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Controle de pagamentos
CREATE TABLE pagamentos (
  id SERIAL PRIMARY KEY,
  aluno_id INTEGER REFERENCES alunos(id),
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  data_pagamento DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Relacionamentos

- **Aluno** → **Instrumento** (N:1)
- **Aluno** → **Presenças** (1:N)
- **Aluno** → **Pagamentos** (1:N)

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos

## 📝 Roadmap

- [ ] Sistema de autenticação e autorização
- [ ] Notificações por email/SMS
- [ ] Relatórios em PDF
- [ ] API para integração com outros sistemas
- [ ] App mobile
- [ ] Sistema de backup automático
- [ ] Multi-tenancy (múltiplas escolas)

## 🐛 Problemas Conhecidos

- Nenhum problema conhecido no momento

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Desenvolvido com ❤️ para comunidades musicais**

[⬆ Voltar ao topo](#-sistema-de-gerenciamento---escola-de-música-da-igreja)

</div>
