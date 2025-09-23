# Sistema de Gerenciamento - Escola de Música da Igreja

Sistema completo para gerenciar alunos, instrumentos, presenças e pagamentos de uma escola de música.

## Funcionalidades

### 🎵 Gerenciamento de Instrumentos
- Cadastro de instrumentos com quantidade limitada
- Controle de disponibilidade em tempo real
- Validação para evitar conflitos de reserva

### 👥 Cadastro de Alunos
- Cadastro completo com nome, idade e instrumento
- Seleção automática apenas de instrumentos disponíveis
- Atualização automática de disponibilidade

### 📅 Sistema de Chamada
- Controle de presença por data
- Histórico completo de presenças
- Estatísticas de frequência por aluno
- Funcionalidades em lote (marcar todos, limpar chamada)

### 💰 Controle de Pagamentos
- Geração automática de mensalidades
- Controle de status de pagamento
- Relatórios com gráficos e estatísticas
- Exportação de dados

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Gráficos**: Recharts
- **Ícones**: Lucide React

## Configuração do Projeto

### 1. Instalação das Dependências
\`\`\`bash
npm install
\`\`\`

### 2. Configuração do Banco de Dados
\`\`\`bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure sua URL do PostgreSQL no arquivo .env
# DATABASE_URL="postgresql://username:password@localhost:5432/escola_musica?schema=public"
\`\`\`

### 3. Configuração do Prisma
\`\`\`bash
# Gerar o cliente Prisma
npx prisma generate

# Executar as migrações
npx prisma db push

# (Opcional) Popular o banco com dados iniciais
npx prisma db seed
\`\`\`

### 4. Executar o Projeto
\`\`\`bash
npm run dev
\`\`\`

O sistema estará disponível em `http://localhost:3000`

## Estrutura do Banco de Dados

### Tabelas Principais

- **instrumentos**: Armazena os instrumentos disponíveis e suas quantidades
- **alunos**: Dados dos alunos cadastrados
- **presencas**: Registro de presenças nas aulas
- **pagamentos**: Controle de mensalidades e pagamentos

### Relacionamentos

- Aluno → Instrumento (muitos para um)
- Aluno → Presenças (um para muitos)
- Aluno → Pagamentos (um para muitos)

## Funcionalidades Detalhadas

### Regras de Negócio

1. **Instrumentos**:
   - Cada instrumento tem quantidade limitada
   - Não é possível excluir instrumento em uso
   - Não é possível reduzir quantidade abaixo do número de alunos

2. **Alunos**:
   - Só podem escolher instrumentos disponíveis
   - Ao remover aluno, instrumento fica disponível
   - Pagamento inicial é criado automaticamente

3. **Presenças**:
   - Uma presença por aluno por data
   - Histórico completo mantido
   - Estatísticas calculadas automaticamente

4. **Pagamentos**:
   - Status do aluno atualizado automaticamente
   - Relatórios mensais e anuais
   - Controle de inadimplência

## Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executar build de produção
- `npm run lint` - Verificar código
- `npx prisma studio` - Interface visual do banco
- `npx prisma db seed` - Popular banco com dados iniciais

## Estrutura de Pastas

\`\`\`
├── app/                    # Páginas e rotas da aplicação
│   ├── api/               # API Routes do Next.js
│   ├── alunos/            # Página de gerenciamento de alunos
│   ├── chamada/           # Sistema de chamada
│   ├── instrumentos/      # Gerenciamento de instrumentos
│   └── pagamentos/        # Controle de pagamentos
├── components/            # Componentes React reutilizáveis
│   ├── alunos/           # Componentes específicos de alunos
│   ├── chamada/          # Componentes de presença
│   ├── instrumentos/     # Componentes de instrumentos
│   ├── layout/           # Componentes de layout
│   ├── pagamentos/       # Componentes de pagamentos
│   └── ui/               # Componentes base do shadcn/ui
├── lib/                  # Utilitários e configurações
├── prisma/               # Schema e migrações do banco
└── scripts/              # Scripts SQL para popular o banco
\`\`\`

## Contribuição

Este sistema foi desenvolvido especificamente para escolas de música de igrejas, mas pode ser adaptado para outras instituições de ensino musical.

## Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
