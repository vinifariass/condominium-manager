# Configuração do Prisma com Supabase

Este guia irá ajudá-lo a configurar o Prisma com o Supabase para o sistema de gestão condominial.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js instalado
- Projeto Next.js configurado

## 🚀 Passos para Configuração

### 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Preencha os dados:
   - **Name**: Condominium Management
   - **Database Password**: Escolha uma senha forte (salve essa senha!)
   - **Region**: Escolha a região mais próxima (ex: South America)
   - **Pricing Plan**: Free (para desenvolvimento)
5. Clique em "Create new project" e aguarde a criação

### 2. Obter as Connection Strings

Após o projeto ser criado:

1. No dashboard do Supabase, vá em **Settings** (ícone de engrenagem no menu lateral)
2. Clique em **Database**
3. Role até a seção **Connection string**
4. Você verá duas strings importantes:

   **Connection pooling (Transaction mode)** - Use esta para `DATABASE_URL`:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

   **Session mode** - Use esta para `DIRECT_URL`:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas connection strings:
   ```env
   # Transaction mode - para queries normais com pooling
   DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

   # Session mode - para migrations e schema updates
   DIRECT_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
   ```

   **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha que você criou no passo 1!

### 4. Gerar o Prisma Client

```bash
npm run db:generate
```

Este comando gera os tipos TypeScript baseados no seu schema.

### 5. Aplicar o Schema ao Banco de Dados

Você tem duas opções:

#### Opção A: Push (Recomendado para desenvolvimento)
```bash
npm run db:push
```

Este comando sincroniza o schema do Prisma com o banco de dados sem criar arquivos de migration.

#### Opção B: Migrate (Recomendado para produção)
```bash
npm run db:migrate
```

Este comando cria uma migration e aplica ao banco de dados.

### 6. Popular o Banco com Dados de Exemplo

```bash
npm run db:seed
```

Este comando irá criar:
- 1 Condomínio (Santos Dumont)
- 1 Bloco (Torre A)
- 4 Apartamentos
- 3 Moradores
- 3 Veículos
- 1 Pet
- 2 Funcionários
- 3 Áreas Comuns
- 2 Reservas
- 1 Visitante
- 2 Chamados
- 4 Registros Financeiros

## 🎯 Comandos Disponíveis

```bash
# Gerar Prisma Client (tipos TypeScript)
npm run db:generate

# Sincronizar schema com banco (sem migrations)
npm run db:push

# Criar e aplicar migration
npm run db:migrate

# Abrir Prisma Studio (GUI para visualizar/editar dados)
npm run db:studio

# Popular banco com dados de exemplo
npm run db:seed
```

## 📊 Visualizar Dados com Prisma Studio

Execute:
```bash
npm run db:studio
```

Isso abrirá uma interface web em `http://localhost:5555` onde você pode:
- Ver todas as tabelas
- Adicionar/editar/deletar registros
- Testar queries
- Ver relacionamentos

## 🗄️ Schema do Banco de Dados

O schema inclui os seguintes modelos principais:

### Gestão de Condomínio
- **Condominium**: Dados do condomínio
- **Block**: Blocos/torres
- **Apartment**: Apartamentos
- **Resident**: Moradores (proprietários, locatários, dependentes)
- **Employee**: Funcionários
- **Vehicle**: Veículos dos moradores
- **Pet**: Pets dos moradores

### Reservas e Áreas Comuns
- **CommonArea**: Áreas comuns (salão, churrasqueira, piscina, etc.)
- **Reservation**: Reservas de áreas comuns

### Controle de Visitantes
- **Visitor**: Visitantes, entregas, prestadores de serviço

### Sistema de Chamados
- **Ticket**: Chamados de manutenção, reclamações, sugestões

### Financeiro
- **FinancialRecord**: Receitas e despesas

### Notificações
- **Notification**: Histórico de notificações SMS/WhatsApp

## 🔧 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se as connection strings estão corretas
- Verifique se substituiu `[YOUR-PASSWORD]` pela senha real
- Verifique sua conexão com internet
- Certifique-se que o projeto Supabase está ativo

### Erro: "Error validating datasource"
- Verifique o formato das URLs no arquivo `.env`
- Certifique-se que não há espaços extras
- Confirme que está usando a string correta para cada variável

### Seed falha
- Execute `npm run db:push` primeiro para garantir que o schema está aplicado
- Verifique se não há dados conflitantes (CPF/CNPJ duplicados)
- Limpe o banco e tente novamente

### Como limpar o banco de dados
No Prisma Studio ou via SQL:
```sql
-- CUIDADO: Isso apaga TODOS os dados!
TRUNCATE TABLE condominiums CASCADE;
```

Ou use o próprio seed que já limpa antes de popular.

## 📝 Próximos Passos

Após configurar o Prisma:

1. ✅ Criar rotas API em `src/app/api`
2. ✅ Implementar autenticação (NextAuth.js)
3. ✅ Conectar páginas frontend ao backend
4. ✅ Implementar validação com Zod
5. ✅ Adicionar tratamento de erros

## 🔗 Links Úteis

- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Prisma com Supabase](https://supabase.com/partners/integrations/prisma)
- [Prisma Studio](https://www.prisma.io/studio)

## 💡 Dicas

- Use `DATABASE_URL` com pooling (`?pgbouncer=true`) para melhor performance
- Use `DIRECT_URL` para migrations (conexão direta)
- Sempre faça backup antes de rodar migrations em produção
- Use Prisma Studio para debugar e visualizar dados durante desenvolvimento
- Mantenha o arquivo `.env` no `.gitignore` (nunca commite senhas!)
