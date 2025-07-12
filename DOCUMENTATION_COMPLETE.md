# Sistema de Gestão Condominial - Documentação Completa

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Instalação e Configuração](#instalação-e-configuração)
5. [Funcionalidades](#funcionalidades)
6. [Arquitetura Multi-tenant](#arquitetura-multi-tenant)
7. [Sistema de Design](#sistema-de-design)
8. [Páginas e Componentes](#páginas-e-componentes)
9. [Customização](#customização)
10. [Deploy](#deploy)
11. [Manutenção](#manutenção)
12. [API e Backend](#api-e-backend)
13. [Contribuição](#contribuição)

## 🏢 Visão Geral

Este é um sistema completo de gestão condominial desenvolvido em Next.js 14 com shadcn/ui. O sistema foi projetado para atender múltiplos condomínios (multi-tenant) oferecendo funcionalidades completas de administração, financeiro, reservas, moradores e muito mais.

### Principais Características
- ✅ Interface moderna e responsiva
- ✅ Sistema multi-tenant completo
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão de apartamentos e moradores
- ✅ Sistema de reservas de áreas comuns
- ✅ Controle financeiro completo
- ✅ Gestão de funcionários
- ✅ Sistema de chamados/tickets
- ✅ Tema claro/escuro
- ✅ Totalmente acessível (a11y)

## 🛠 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes
- **Lucide React** - Ícones
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados

### Dependências Principais
```json
{
  "next": "14.0.0",
  "react": "18.0.0",
  "typescript": "5.0.0",
  "tailwindcss": "3.4.0",
  "@radix-ui/react-*": "^1.0.0",
  "lucide-react": "^0.400.0"
}
```

## 📁 Estrutura do Projeto

```
shadcn-ui-sidebar/
├── src/
│   ├── app/                        # App Router (Next.js 14)
│   │   ├── (demo)/                 # Grupo de rotas protegidas
│   │   │   ├── layout.tsx          # Layout com sidebar
│   │   │   ├── dashboard/          # Dashboard principal
│   │   │   ├── apartments/         # Gestão de apartamentos
│   │   │   ├── residents/          # Gestão de moradores
│   │   │   ├── reservations/       # Sistema de reservas
│   │   │   ├── financials/         # Controle financeiro
│   │   │   ├── condominiums/       # Gestão de condomínios
│   │   │   ├── employees/          # Gestão de funcionários
│   │   │   └── tickets/            # Sistema de chamados
│   │   ├── login/                  # Página de login
│   │   ├── globals.css             # Estilos globais
│   │   ├── layout.tsx              # Layout raiz
│   │   └── page.tsx                # Página inicial (redirect)
│   ├── components/                 # Componentes React
│   │   ├── admin-panel/            # Componentes do painel
│   │   │   ├── admin-panel-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navbar.tsx
│   │   │   └── ...
│   │   ├── ui/                     # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── providers/              # Context providers
│   ├── hooks/                      # Hooks customizados
│   │   ├── use-sidebar.ts
│   │   └── use-store.ts
│   └── lib/                        # Utilitários
│       ├── utils.ts
│       └── menu-list.ts            # Configuração do menu
├── public/                         # Arquivos estáticos
├── components.json                 # Configuração shadcn/ui
├── tailwind.config.ts             # Configuração Tailwind
├── tsconfig.json                  # Configuração TypeScript
└── package.json                   # Dependências
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 18.17+ 
- npm, yarn ou pnpm
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <repository-url>
cd shadcn-ui-sidebar
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/condominio_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Multi-tenant
TENANT_DOMAIN_MAPPING="true"

# Email (opcional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@yourapp.com"
```

4. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. **Acesse o sistema**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🎯 Funcionalidades

### Dashboard Principal
- **Métricas em tempo real**: Apartamentos ocupados, receitas, despesas
- **Gráficos financeiros**: Receitas vs despesas por mês
- **Atividades recentes**: Últimas movimentações do sistema
- **Reservas próximas**: Agenda de reservas das áreas comuns
- **Taxa de ocupação**: Percentual de apartamentos ocupados

### Gestão de Apartamentos
- **Lista completa**: Todos os apartamentos com status
- **Filtros avançados**: Por bloco, andar, status, tipo
- **Detalhes completos**: Área, quartos, banheiros, vagas
- **Histórico**: Movimentações e alterações
- **Ações rápidas**: Editar, visualizar, alterar status

### Gestão de Moradores
- **Cadastro completo**: Dados pessoais, contatos, documentos
- **Relacionamento**: Vinculação com apartamentos
- **Status**: Proprietário, locatário, dependente
- **Histórico**: Mudanças e ocorrências
- **Comunicação**: Contatos e preferências

### Sistema de Reservas
- **Áreas comuns**: Salão de festas, churrasqueira, quadra
- **Calendário visual**: Disponibilidade em tempo real
- **Regras flexíveis**: Horários, antecedência, valores
- **Confirmação automática**: E-mail e notificações
- **Histórico**: Reservas passadas e futuras

### Controle Financeiro
- **Contas a receber**: Taxas condominiais, multas
- **Contas a pagar**: Fornecedores, funcionários, serviços
- **Fluxo de caixa**: Entradas e saídas detalhadas
- **Relatórios**: Balancetes, demonstrativos
- **Categorização**: Organização por tipo de despesa

### Gestão de Funcionários
- **Cadastro completo**: Dados pessoais, cargo, salário
- **Controle de ponto**: Horários e turnos
- **Benefícios**: Vale transporte, alimentação, saúde
- **Documentos**: Contratos, exames, certificados
- **Folha de pagamento**: Cálculos automáticos

### Sistema de Chamados
- **Abertura fácil**: Interface intuitiva para moradores
- **Categorização**: Manutenção, limpeza, segurança
- **Priorização**: Urgente, alta, média, baixa
- **Acompanhamento**: Status em tempo real
- **Histórico completo**: Todas as interações

## 🏗 Arquitetura Multi-tenant

### Conceitos Base
O sistema suporta múltiplos condomínios (tenants) com isolamento completo de dados e customizações específicas.

### Implementação

#### 1. Estrutura do Banco de Dados
```sql
-- Tabela de tenants (condomínios)
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE,
    database_name VARCHAR(100),
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Todas as outras tabelas incluem tenant_id
CREATE TABLE apartments (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    number VARCHAR(10) NOT NULL,
    block VARCHAR(10),
    -- outros campos...
);
```

#### 2. Middleware de Tenant
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host');
  const tenant = getTenantFromDomain(hostname);
  
  // Adiciona tenant ao header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-id', tenant.id);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

#### 3. Context Provider
```typescript
// contexts/TenantContext.tsx
interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
}

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  
  // Lógica para buscar tenant baseado no domínio
  
  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};
```

#### 4. API Routes com Tenant
```typescript
// app/api/apartments/route.ts
export async function GET(request: Request) {
  const tenantId = request.headers.get('x-tenant-id');
  
  const apartments = await db.apartment.findMany({
    where: { tenantId: parseInt(tenantId) }
  });
  
  return Response.json(apartments);
}
```

## 🎨 Sistema de Design

### Tema e Cores
O sistema utiliza CSS variables para suporte completo a tema claro/escuro:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... outras variáveis para tema escuro */
}
```

### Componentes Base
Todos os componentes seguem o padrão shadcn/ui com variantes consistentes:

```typescript
// Button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
  }
);
```

### Responsividade
O sistema é totalmente responsivo usando classes Tailwind:

```typescript
// Grid responsivo exemplo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards responsivos */}
</div>

// Sidebar responsiva
<div className="hidden lg:block lg:w-64 lg:fixed lg:inset-y-0">
  {/* Sidebar desktop */}
</div>
<div className="lg:hidden">
  {/* Menu mobile */}
</div>
```

## 📄 Páginas e Componentes

### Layout Principal
```typescript
// app/(demo)/layout.tsx
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPanelLayout>
      {children}
    </AdminPanelLayout>
  );
}
```

### Componentes Reutilizáveis

#### ContentLayout
```typescript
// components/admin-panel/content-layout.tsx
interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="container relative h-full flex-col items-start justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {title}
              </h1>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
```

#### Card de Estatísticas
```typescript
// Componente reutilizável para métricas
interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% em relação ao mês anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Páginas Específicas

#### Dashboard
- **Arquivo**: `src/app/(demo)/dashboard/page.tsx`
- **Funcionalidades**: 
  - Cards de métricas gerais
  - Gráfico de receitas vs despesas
  - Lista de atividades recentes
  - Próximas reservas
  - Taxa de ocupação por bloco

#### Apartamentos
- **Arquivo**: `src/app/(demo)/apartments/page.tsx`
- **Funcionalidades**:
  - Lista paginada de apartamentos
  - Filtros por bloco, andar, status
  - Cards com informações detalhadas
  - Ações de edição e visualização

#### Moradores
- **Arquivo**: `src/app/(demo)/residents/page.tsx`
- **Funcionalidades**:
  - Lista de moradores com fotos
  - Filtros por tipo, status, apartamento
  - Informações de contato
  - Histórico de mudanças

#### Reservas
- **Arquivo**: `src/app/(demo)/reservations/page.tsx`
- **Funcionalidades**:
  - Calendário de reservas
  - Lista agrupada por data
  - Status de confirmação
  - Filtros por área comum

#### Financeiro
- **Arquivo**: `src/app/(demo)/financials/page.tsx`
- **Funcionalidades**:
  - Resumo financeiro
  - Lista de transações
  - Categorização de despesas
  - Saldo por categoria

#### Funcionários
- **Arquivo**: `src/app/(demo)/employees/page.tsx`
- **Funcionalidades**:
  - Lista de funcionários
  - Informações de cargo e salário
  - Contatos e documentos
  - Histórico de admissão

#### Chamados
- **Arquivo**: `src/app/(demo)/tickets/page.tsx`
- **Funcionalidades**:
  - Lista de tickets por prioridade
  - Status de andamento
  - Categorização por tipo
  - Histórico de interações

## 🔧 Customização

### Adicionando Novos Componentes shadcn/ui
```bash
npx shadcn-ui@latest add [component-name]
```

### Customizando Cores
Edite as variáveis CSS em `src/app/globals.css`:

```css
:root {
  --primary: 210 40% 58%; /* Nova cor primária */
  --secondary: 210 40% 96%; /* Nova cor secundária */
}
```

### Adicionando Novas Páginas
1. Crie o arquivo da página em `src/app/(demo)/[nome]/page.tsx`
2. Adicione a rota no menu em `src/lib/menu-list.ts`
3. Implemente o componente seguindo o padrão existente

```typescript
// src/lib/menu-list.ts
export function getMenuList(pathname: string): Submenu[] {
  return [
    {
      groupLabel: "",
      menus: [
        // ... outros menus
        {
          href: "/nova-pagina",
          label: "Nova Página",
          icon: NewIcon,
          active: pathname.includes("/nova-pagina"),
        },
      ]
    }
  ];
}
```

### Modificando o Layout
O layout principal está em `src/components/admin-panel/admin-panel-layout.tsx`. Você pode customizar:
- Largura da sidebar
- Posicionamento dos elementos
- Comportamento responsivo
- Cores e estilos

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Build Manual
```bash
npm run build
npm start
```

## 🧪 Testes

### Configuração Jest (Exemplo)
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

```typescript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

### Exemplo de Teste
```typescript
// __tests__/dashboard.test.tsx
import { render, screen } from '@testing-library/react'
import DashboardPage from '@/app/(demo)/dashboard/page'

describe('Dashboard', () => {
  it('renders dashboard stats', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText('Total de Apartamentos')).toBeInTheDocument()
    expect(screen.getByText('Receita Total')).toBeInTheDocument()
  })
})
```

## 🔗 API e Backend

### Estrutura Recomendada
```
src/app/api/
├── auth/
│   └── route.ts
├── apartments/
│   ├── route.ts
│   └── [id]/route.ts
├── residents/
│   ├── route.ts
│   └── [id]/route.ts
├── reservations/
│   ├── route.ts
│   └── [id]/route.ts
└── financials/
    ├── route.ts
    └── [id]/route.ts
```

### Exemplo de API Route
```typescript
// src/app/api/apartments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tenantId = request.headers.get('x-tenant-id');
  
  try {
    const apartments = await db.apartment.findMany({
      where: { tenantId: parseInt(tenantId) },
      include: { residents: true }
    });
    
    return NextResponse.json(apartments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const tenantId = request.headers.get('x-tenant-id');
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const apartment = await db.apartment.create({
      data: {
        ...body,
        tenantId: parseInt(tenantId)
      }
    });
    
    return NextResponse.json(apartment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
```

### Prisma Schema (Exemplo)
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        Int      @id @default(autoincrement())
  name      String
  domain    String?  @unique
  settings  Json?
  createdAt DateTime @default(now())
  
  apartments  Apartment[]
  residents   Resident[]
  employees   Employee[]
  reservations Reservation[]
  transactions Transaction[]
}

model Apartment {
  id       Int    @id @default(autoincrement())
  tenantId Int
  number   String
  block    String?
  floor    Int?
  bedrooms Int?
  bathrooms Int?
  area     Float?
  status   String @default("occupied")
  
  tenant    Tenant     @relation(fields: [tenantId], references: [id])
  residents Resident[]
  
  @@unique([tenantId, number, block])
}

model Resident {
  id          Int      @id @default(autoincrement())
  tenantId    Int
  apartmentId Int?
  name        String
  email       String?
  phone       String?
  document    String?
  type        String   @default("owner") // owner, tenant, dependent
  status      String   @default("active")
  createdAt   DateTime @default(now())
  
  tenant    Tenant     @relation(fields: [tenantId], references: [id])
  apartment Apartment? @relation(fields: [apartmentId], references: [id])
}

// ... outros models
```

## 🔐 Autenticação e Autorização

### NextAuth.js Setup
```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Implementar lógica de autenticação
        const user = await authenticateUser(credentials)
        
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            tenantId: user.tenantId
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = user.tenantId
      }
      return token
    },
    async session({ session, token }) {
      session.user.tenantId = token.tenantId
      return session
    }
  }
}
```

### Middleware de Proteção
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Lógica adicional de autorização
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/apartments/:path*', '/residents/:path*']
}
```

## 📊 Monitoramento e Analytics

### Métricas Recomendadas
- Tempo de carregamento das páginas
- Taxa de erro das APIs
- Uso por funcionalidade
- Performance do banco de dados

### Implementação com Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🧹 Manutenção

### Scripts Úteis
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  }
}
```

### Checklist de Atualizações
- [ ] Atualizar dependências regularmente
- [ ] Verificar breaking changes do Next.js
- [ ] Testar em diferentes navegadores
- [ ] Validar acessibilidade
- [ ] Backup regular do banco de dados
- [ ] Monitorar logs de erro
- [ ] Revisar métricas de performance

### Troubleshooting Comum

#### Problema: Build falha
```bash
# Limpar cache
rm -rf .next
npm run build
```

#### Problema: Tipos TypeScript
```bash
# Regenerar tipos Prisma
npx prisma generate
```

#### Problema: Estilos não carregam
```bash
# Verificar importação do globals.css
# Verificar configuração do Tailwind
```

## 🤝 Contribuição

### Guia para Contribuidores

1. **Fork do projeto**
2. **Crie uma branch feature**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commits semânticos**
   ```bash
   git commit -m "feat: adiciona sistema de notificações"
   ```
4. **Pull Request**
   - Descreva as mudanças
   - Inclua screenshots se necessário
   - Teste todas as funcionalidades

### Padrões de Código

#### Nomenclatura
- **Componentes**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useUserData.ts`)
- **Utilitários**: camelCase (`formatCurrency.ts`)
- **Páginas**: kebab-case (`user-profile/page.tsx`)

#### Estrutura de Componentes
```typescript
// ComponentName.tsx
interface ComponentNameProps {
  // Props interface
}

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Issues e Bugs
- Use o template de issue
- Inclua steps para reproduzir
- Adicione screenshots quando relevante
- Especifique versão do navegador/SO

## 📚 Recursos Adicionais

### Documentação Oficial
- [Next.js 14](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Prisma](https://www.prisma.io/docs)

### Tutoriais e Guias
- [App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [shadcn/ui Setup](https://ui.shadcn.com/docs/installation/next)
- [Multi-tenancy Patterns](https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/multi-tenancy-models.html)

### Comunidade
- [Next.js Discord](https://discord.com/invite/bUG2bvbtHy)
- [shadcn/ui Discord](https://discord.gg/shadcn)

## 📝 Changelog

### Versão 1.0.0 (Atual)
- ✅ Sistema completo de gestão condominial
- ✅ Interface responsiva com tema claro/escuro
- ✅ Múltiplas páginas funcionais
- ✅ Arquitetura multi-tenant preparada
- ✅ Componentes shadcn/ui integrados
- ✅ TypeScript 100% configurado

### Próximas Versões
- [ ] v1.1.0: Integração com API real
- [ ] v1.2.0: Sistema de notificações
- [ ] v1.3.0: Relatórios avançados
- [ ] v1.4.0: App mobile (React Native)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

**Desenvolvido com ❤️ para gestão condominial moderna**

Para dúvidas ou suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

*Última atualização: Dezembro 2024*
