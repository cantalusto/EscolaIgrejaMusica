# 🚀 Guia de Deploy - Escola de Música

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [GitHub](https://github.com)
- Conta no [Supabase](https://supabase.com)

## 🗄️ Configuração do Banco de Dados (Supabase)

O projeto está configurado para usar Supabase PostgreSQL.

### Variáveis de Ambiente Necessárias:

```env
DATABASE_URL="postgresql://postgres.ifpnuttejeliceaeabuc:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://ifpnuttejeliceaeabuc.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## 📦 Deploy no Vercel

### Opção 1: Via GitHub (Recomendado)

1. **Faça push do código para o GitHub:**
   ```bash
   git add .
   git commit -m "Migração para Supabase"
   git push origin main
   ```

2. **No Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Importe seu repositório do GitHub
   - Configure as variáveis de ambiente (veja abaixo)
   - Clique em "Deploy"

3. **Configure as Variáveis de Ambiente no Vercel:**
   - No dashboard do projeto, vá em "Settings" > "Environment Variables"
   - Adicione cada variável:
     - `DATABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

## 🔧 Configuração Inicial do Banco de Dados

Após o primeiro deploy, você precisa executar as migrations do Prisma:

### Opção 1: Via Vercel (Terminal local)

```bash
# Conectar ao projeto Vercel
vercel env pull .env.local

# Executar migrations
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate
```

### Opção 2: Via Supabase SQL Editor

Você pode executar as migrations diretamente no Supabase:

1. Acesse o Supabase Dashboard
2. Vá em "SQL Editor"
3. Execute o conteúdo do arquivo de migration em `prisma/migrations/*/migration.sql`

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Iniciar produção
pnpm start

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Abrir Prisma Studio (visualizar dados)
npx prisma studio
```

## 🔐 Segurança

⚠️ **IMPORTANTE:**
- Nunca faça commit do arquivo `.env` com credenciais reais
- Use variáveis de ambiente no Vercel para produção
- O arquivo `.env.example` é seguro para commit (não contém credenciais)
- Mantenha o `SUPABASE_SERVICE_ROLE_KEY` em segredo

## 📊 Estrutura do Projeto

```
escola-musica/
├── app/                 # Páginas e rotas Next.js
│   ├── api/            # API Routes
│   ├── alunos/         # Gestão de alunos
│   ├── chamada/        # Sistema de presença
│   ├── instrumentos/   # Gestão de instrumentos
│   └── pagamentos/     # Gestão de pagamentos
├── components/         # Componentes React
├── lib/               # Utilitários e configurações
├── prisma/            # Schema e migrations do banco
└── public/            # Arquivos estáticos
```

## 🌐 URLs Importantes

- **Projeto Local:** http://localhost:3000
- **Vercel (após deploy):** https://seu-projeto.vercel.app
- **Supabase Dashboard:** https://supabase.com/dashboard
- **GitHub Repository:** https://github.com/cantalusto/EscolaIgrejaMusica

## 🐛 Troubleshooting

### Erro de Conexão com Banco de Dados

Verifique se:
1. A `DATABASE_URL` está correta no Vercel
2. O Supabase está ativo e acessível
3. As migrations foram executadas

### Build Falha no Vercel

1. Verifique os logs no Vercel Dashboard
2. Certifique-se de que todas as variáveis de ambiente estão configuradas
3. Execute `pnpm build` localmente para verificar erros

### Prisma Client Desatualizado

```bash
npx prisma generate
```

## 📞 Suporte

Para problemas ou dúvidas, consulte:
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Vercel](https://vercel.com/docs)
