# 🔧 Verificação de Credenciais do Supabase

## ⚠️ Erro de Autenticação Detectado

A conexão com o banco de dados Supabase está falhando devido a credenciais inválidas.

## 📋 Como Obter as Credenciais Corretas

1. **Acesse o Supabase Dashboard:**
   - Vá para https://supabase.com/dashboard
   - Selecione seu projeto: `ifpnuttejeliceaeabuc`

2. **Obtenha a String de Conexão:**
   - No menu lateral, clique em **"Project Settings"** (ícone de engrenagem)
   - Clique em **"Database"**
   - Role até a seção **"Connection String"**
   - Selecione a aba **"URI"**
   - Escolha o modo **"Transaction"** ou **"Session"** (recomendado para Prisma)
   - Copie a URL e substitua `[YOUR-PASSWORD]` pela senha: `32280882`

3. **Formato Esperado:**

   Para **Transaction Mode (Pooler)**:
   ```
   postgresql://postgres.ifpnuttejeliceaeabuc:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres
   ```

   Para **Session Mode (Direct)**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.ifpnuttejeliceaeabuc.supabase.co:5432/postgres
   ```

   Para **Connection Pooling (recomendado para Prisma)**:
   ```
   postgresql://postgres.ifpnuttejeliceaeabuc:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

## 🔐 Possíveis Problemas

### 1. Senha Incorreta
- Verifique se a senha `32280882` está correta no Supabase Dashboard
- Em "Project Settings" > "Database" > "Database Settings" > "Reset Database Password"

### 2. Senha com Caracteres Especiais
Se a senha contiver caracteres especiais, eles devem ser codificados:
- Use um codificador de URL: https://www.urlencoder.org/
- Exemplo: `my@pass` vira `my%40pass`

### 3. IP Bloqueado
- Verifique se o IP está na whitelist
- Em "Project Settings" > "Database" > "Connection Pooling"
- Adicione `0.0.0.0/0` para permitir todas as conexões (não recomendado para produção)

## 🧪 Teste de Conexão

Depois de atualizar o `.env`, teste com:

```bash
npx prisma db pull
```

Ou:

```bash
npx prisma migrate deploy
```

## 📝 Configuração Recomendada para Prisma + Supabase

No arquivo `.env`:

```env
# Para desenvolvimento (Transaction Mode com Pooling)
DATABASE_URL="postgresql://postgres.ifpnuttejeliceaeabuc:[YOUR-PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Para migrations (Direct Connection)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ifpnuttejeliceaeabuc.supabase.co:5432/postgres"
```

E no `schema.prisma`, se necessário:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Usado para migrations
}
```

## 🆘 Ainda com Problemas?

1. Verifique os logs do Supabase em "Project Settings" > "API" > "Logs"
2. Teste a conexão com um cliente PostgreSQL (DBeaver, pgAdmin)
3. Confirme que o projeto Supabase está ativo e não pausado

## 📞 Links Úteis

- [Supabase Database Settings](https://supabase.com/dashboard/project/ifpnuttejeliceaeabuc/settings/database)
- [Prisma + Supabase Guide](https://supabase.com/partners/integrations/prisma)
- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
