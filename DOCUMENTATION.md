# Sistema de Gestão Condominial - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Configuração e Instalação](#configuração-e-instalação)
5. [Funcionalidades](#funcionalidades)
6. [Arquitetura](#arquitetura)
7. [Componentes Principais](#componentes-principais)
8. [Telas e Módulos](#telas-e-módulos)
9. [Personalização](#personalização)
10. [Multi-tenancy](#multi-tenancy)
11. [Próximos Passos](#próximos-passos)

## 🔍 Visão Geral

Este é um sistema completo de gestão condominial desenvolvido em **Next.js 14** com **shadcn/ui**, oferecendo uma interface moderna e responsiva para administração de condomínios. O sistema suporta múltiplos condomínios (multi-tenant) e inclui todos os módulos necessários para uma gestão eficiente.

### Principais Características:
- ✅ Interface moderna com Dark/Light mode
- ✅ Responsivo (mobile-first)
- ✅ Sistema multi-tenant
- ✅ Sidebar colapsável
- ✅ Componentes reutilizáveis
- ✅ TypeScript para type safety
- ✅ Dados reais de exemplo

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Biblioteca de componentes
- **Lucide React** - Ícones modernos
- **Radix UI** - Primitivos acessíveis

### Estado e Dados
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

### Infraestrutura (Sugerida)
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **NextAuth.js** - Autenticação
- **Vercel** - Deploy

## 📁 Estrutura do Projeto

```
shadcn-ui-sidebar/
├── src/
│   ├── app/                          # App Router (Next.js 14)
│   │   ├── globals.css              # Estilos globais
│   │   ├── layout.tsx               # Layout raiz
│   │   ├── page.tsx                 # Página inicial (redirect)
│   │   ├── login/                   # Autenticação
│   │   │   └── page.tsx
│   │   └── (demo)/                  # Grupo de rotas protegidas
│   │       ├── layout.tsx           # Layout do painel admin
│   │       ├── dashboard/           # Dashboard principal
│   │       ├── apartments/          # Gestão de apartamentos
│   │       ├── apartamentos/        # Versão PT-BR
│   │       ├── residents/           # Gestão de moradores
│   │       ├── moradores/           # Versão PT-BR
│   │       ├── reservations/        # Reservas de áreas comuns
│   │       ├── financials/          # Gestão financeira
│   │       ├── condominiums/        # Multi-condomínios
│   │       ├── employees/           # Funcionários
│   │       ├── tickets/             # Chamados/Tickets
│   │       └── cards/               # Demonstração de cards
│   ├── components/
│   │   ├── admin-panel/             # Componentes do painel
│   │   │   ├── admin-panel-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── menu.tsx
│   │   │   └── ...
│   │   ├── ui/                      # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── providers/               # Context providers
│   ├── hooks/                       # Custom hooks
│   │   ├── use-sidebar.ts
│   │   └── use-store.ts
│   └── lib/                         # Utilitários
│       ├── menu-list.ts             # Estrutura do menu
│       └── utils.ts                 # Funções utilitárias
├── public/                          # Arquivos estáticos
├── components.json                  # Configuração shadcn/ui
├── tailwind.config.ts              # Configuração Tailwind
├── next.config.mjs                 # Configuração Next.js
└── package.json                    # Dependências
```

## ⚙️ Configuração e Instalação

### 1. Pré-requisitos
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### 2. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd shadcn-ui-sidebar

# Instale as dependências
npm install

# Execute o projeto em desenvolvimento
npm run dev
```

### 3. Configuração do shadcn/ui

O projeto já está configurado, mas caso precise reconfigurar:

```bash
# Inicializar shadcn/ui
npx shadcn-ui@latest init

# Adicionar componentes
npx shadcn-ui@latest add button card input
```

### 4. Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (opcional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral com estatísticas principais
- Gráficos de receitas e despesas
- Ocupação por blocos
- Atividades recentes
- Próximas reservas

### 🏠 Gestão de Apartamentos
- Lista completa de apartamentos
- Filtros por bloco, status, tipo
- Informações dos proprietários
- Status de ocupação
- Ações (editar, visualizar, histórico)

### 👥 Gestão de Moradores
- Lista de todos os moradores
- Informações de contato
- Histórico de pagamentos
- Veículos cadastrados
- Dependentes e autorizados

### 📅 Reservas
- Sistema de reservas de áreas comuns
- Calendário integrado
- Status das reservas
- Histórico completo
- Regras por área

### 💰 Financeiro
- Controle de receitas e despesas
- Relatórios financeiros
- Status de pagamentos
- Categorização automática
- Gráficos e métricas

### 🏢 Multi-Condomínios
- Gestão de múltiplos condomínios
- Configurações individuais
- Relatórios consolidados
- Usuários por condomínio

### 👷 Funcionários
- Cadastro de funcionários
- Escalas de trabalho
- Histórico de atividades
- Controle de acesso

### 🎫 Chamados/Tickets
- Sistema de tickets
- Categorização automática
- Status e prioridades
- Histórico completo
- Notificações

## 🏗 Arquitetura

### Padrões Utilizados

1. **Component Composition**: Componentes pequenos e reutilizáveis
2. **Atomic Design**: Organização hierárquica de componentes
3. **Server Components**: Uso de RSC quando possível
4. **Type Safety**: TypeScript em todo o projeto
5. **Mobile First**: Design responsivo

### Estrutura de Estado

```typescript
// Exemplo com Zustand
interface AppState {
  currentCondominium: Condominium | null;
  user: User | null;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
}
```

### Roteamento

- **App Router** (Next.js 14)
- **Grupos de rotas** para organização
- **Layouts aninhados** para diferentes seções
- **Middleware** para autenticação

## 🧩 Componentes Principais

### AdminPanelLayout
Layout principal do sistema com sidebar e navbar.

```tsx
// Uso básico
<AdminPanelLayout>
  <ContentLayout title="Dashboard">
    {/* Conteúdo da página */}
  </ContentLayout>
</AdminPanelLayout>
```

### Sidebar
Menu lateral colapsável com navegação principal.

**Características:**
- Responsivo (sheet no mobile)
- Estado persistente
- Ícones e labels
- Grupos de menu

### ContentLayout
Wrapper para conteúdo das páginas com breadcrumbs.

```tsx
<ContentLayout title="Apartamentos">
  <PlaceholderContent />
</ContentLayout>
```

### Cards Estatísticos
Componentes reutilizáveis para métricas.

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total de Apartamentos</CardTitle>
    <Key className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">120</div>
    <p className="text-xs text-muted-foreground">92% ocupados</p>
  </CardContent>
</Card>
```

## 📱 Telas e Módulos

### 1. Dashboard (`/dashboard`)
**Arquivo:** `src/app/(demo)/dashboard/page.tsx`

- Cards de estatísticas principais
- Resumo financeiro
- Ocupação por blocos  
- Atividades recentes
- Próximas reservas

### 2. Apartamentos (`/apartments`)
**Arquivo:** `src/app/(demo)/apartments/page.tsx`

- Lista paginada de apartamentos
- Filtros por bloco, status, tipo
- Cards com informações detalhadas
- Ações por apartamento

### 3. Moradores (`/residents`)
**Arquivo:** `src/app/(demo)/residents/page.tsx`

- Lista de moradores com fotos
- Informações de contato
- Status de pagamento
- Filtros e busca

### 4. Reservas (`/reservations`)
**Arquivo:** `src/app/(demo)/reservations/page.tsx`

- Lista agrupada por data
- Cards por tipo de área
- Status e horários
- Ações de gerenciamento

### 5. Financeiro (`/financials`)
**Arquivo:** `src/app/(demo)/financials/page.tsx`

- Resumo de receitas/despesas
- Lista de transações
- Categorização
- Filtros por período

### 6. Condomínios (`/condominiums`)
**Arquivo:** `src/app/(demo)/condominiums/page.tsx`

- Lista de condomínios gerenciados
- Estatísticas por condomínio
- Ações administrativas

### 7. Funcionários (`/employees`)
**Arquivo:** `src/app/(demo)/employees/page.tsx`

- Lista de funcionários com fotos
- Informações de contato
- Cargos e departamentos
- Horários de trabalho

### 8. Chamados (`/tickets`)
**Arquivo:** `src/app/(demo)/tickets/page.tsx`

- Lista de tickets por status
- Prioridades e categorias
- Histórico e atualizações

## 🎨 Personalização

### Temas
O projeto suporta Dark/Light mode via `next-themes`:

```tsx
// Toggle de tema
import { ModeToggle } from "@/components/mode-toggle";

<ModeToggle />
```

### Cores
Configuradas no `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      // ...
    }
  }
}
```

### Componentes
Todos os componentes shadcn/ui podem ser customizados:

```bash
# Adicionar novos componentes
npx shadcn-ui@latest add component-name

# Customizar componentes existentes
# Edite os arquivos em src/components/ui/
```

### Menu/Sidebar
Configurado em `src/lib/menu-list.ts`:

```typescript
export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        },
        // ...
      ]
    }
  ];
}
```

## 🏢 Multi-tenancy

### Estrutura Prisma (Sugerida)

```prisma
model Tenant {
  id            String   @id @default(cuid())
  name          String
  subdomain     String   @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relacionamentos
  users         User[]
  apartments    Apartment[]
  residents     Resident[]
  // ...
}

model User {
  id        String @id @default(cuid())
  email     String @unique
  name      String
  tenantId  String
  tenant    Tenant @relation(fields: [tenantId], references: [id])
  // ...
}
```

### Middleware de Tenant

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const subdomain = hostname?.split('.')[0];
  
  // Lógica de identificação do tenant
  if (subdomain && subdomain !== 'www') {
    request.headers.set('x-tenant-id', subdomain);
  }
  
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}
```

### Context de Tenant

```typescript
// lib/tenant-context.tsx
'use client';

interface TenantContextType {
  currentTenant: Tenant | null;
  switchTenant: (tenantId: string) => void;
}

export const TenantContext = createContext<TenantContextType>({
  currentTenant: null,
  switchTenant: () => {},
});
```

### APIs Multi-tenant

```typescript
// app/api/apartments/route.ts
export async function GET(request: Request) {
  const tenantId = request.headers.get('x-tenant-id');
  
  const apartments = await prisma.apartment.findMany({
    where: { tenantId },
    include: { resident: true }
  });
  
  return Response.json(apartments);
}
```

## 🔄 Próximos Passos

### Backend/API
1. **Configurar Prisma** com schema completo
2. **Implementar APIs** para todos os módulos
3. **Configurar autenticação** com NextAuth.js
4. **Adicionar validações** com Zod
5. **Implementar uploads** de arquivos

### Funcionalidades Avançadas
1. **Notificações** em tempo real
2. **Relatórios** em PDF
3. **Sistema de mensagens** interno
4. **Agenda** integrada
5. **Controle de acesso** granular

### Integrações
1. **Gateway de pagamento** (Stripe, PagarMe)
2. **Envio de emails** (SendGrid, Mailgun)
3. **SMS** para notificações
4. **WhatsApp Business** API
5. **Backup** automatizado

### Mobile
1. **Progressive Web App** (PWA)
2. **Notificações push**
3. **Modo offline** básico
4. **App nativo** (React Native)

### DevOps
1. **CI/CD** pipeline
2. **Monitoramento** (Sentry)
3. **Analytics** (Vercel Analytics)
4. **Testes** automatizados
5. **Docker** containerization

## 📚 Recursos Adicionais

### Links Úteis
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Adicionar componente shadcn/ui
npx shadcn-ui@latest add component-name

# Lint e formato
npm run lint
npm run format

# Gerar tipos Prisma
npx prisma generate

# Migração do banco
npx prisma migrate dev
```

### Estrutura de Commits

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: ajustes de estilo/formatação
refactor: refatoração de código
test: adiciona/atualiza testes
chore: tarefas de manutenção
```

---

## 📞 Suporte

Para dúvidas ou sugestões:
- Abra uma **issue** no repositório
- Entre em contato via **email**
- Consulte a **documentação** oficial das tecnologias

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e shadcn/ui**
