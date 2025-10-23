# 🚀 Quick Start - Setup do Banco de Dados

Guia rápido para configurar o banco de dados com Supabase.

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Criar Projeto no Supabase
1. Acesse: https://supabase.com/dashboard
2. Clique em "New Project"
3. Preencha:
   - **Name**: `condominium-db`
   - **Password**: Escolha uma senha forte (SALVE ESSA SENHA!)
   - **Region**: `South America (São Paulo)`
4. Aguarde ~2 minutos para o projeto ser criado

### 2️⃣ Copiar Connection Strings
1. No Supabase, vá em: **Settings** → **Database**
2. Role até **Connection string**
3. Copie as duas strings (você vai precisar delas):

**Transaction mode (com pooling):**
```
postgres://postgres.xxxxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

**Session mode (direto):**
```
postgres://postgres.xxxxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

### 3️⃣ Configurar .env
```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite `.env` e cole suas strings (substitua `[SUA-SENHA]`):
```env
DATABASE_URL="postgres://postgres.xxxxx:[SUA-SENHA]@...6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.xxxxx:[SUA-SENHA]@...5432/postgres"
```

### 4️⃣ Rodar os Comandos
```bash
# 1. Gerar Prisma Client (tipos TypeScript)
npm run db:generate

# 2. Aplicar schema ao banco
npm run db:push

# 3. Popular com dados de exemplo
npm run db:seed

# 4. (Opcional) Abrir Prisma Studio para ver os dados
npm run db:studio
```

## ✅ Pronto!

Seu banco está configurado com:
- ✅ 1 Condomínio
- ✅ 4 Apartamentos
- ✅ 3 Moradores
- ✅ 3 Veículos
- ✅ 3 Áreas Comuns
- ✅ 2 Reservas
- ✅ 2 Chamados
- ✅ 4 Registros Financeiros

## 🎯 Próximos Passos

1. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:3000

3. Navegue pelas páginas (já populadas com dados!)

## 📊 Visualizar Dados

Execute:
```bash
npm run db:studio
```

Abrirá em: http://localhost:5555

## 🔧 Comandos Úteis

```bash
# Ver estrutura do banco
npm run db:studio

# Re-popular banco (apaga tudo e cria de novo)
npm run db:seed

# Resetar banco completamente
npm run db:push -- --force-reset
npm run db:seed
```

## ❓ Problemas?

### "Can't reach database server"
- Verifique se substituiu `[SUA-SENHA]` pela senha real
- Confirme que as URLs estão corretas
- Verifique conexão com internet

### "Unique constraint failed"
- O seed já foi rodado antes
- Opção 1: Delete os dados no Prisma Studio
- Opção 2: Force reset: `npm run db:push -- --force-reset`

### Esqueci a senha do Supabase
- Vá em Settings → Database → Reset database password

## 📚 Documentação Completa

- [PRISMA_SETUP.md](./PRISMA_SETUP.md) - Guia completo
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Estrutura do banco
- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
