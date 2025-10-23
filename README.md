# 🏢 Sistema de Gestão Condominial

Um sistema completo de gestão condominial desenvolvido em **Next.js 14** com **shadcn/ui**, oferecendo uma interface moderna e responsiva para administração de múltiplos condomínios.

## ✨ Características Principais

- 🏢 **Multi-tenant**: Suporte a múltiplos condomínios
- 📱 **Responsivo**: Interface adaptável para desktop, tablet e mobile
- 🌙 **Tema**: Suporte a modo claro e escuro
- ⚡ **Performance**: Next.js 14 com App Router
- 🎨 **Design System**: shadcn/ui com Tailwind CSS
- 🔐 **Segurança**: Arquitetura preparada para autenticação
- ♿ **Acessibilidade**: Componentes totalmente acessíveis

## 🎯 Funcionalidades

### 📊 Dashboard
- Métricas em tempo real
- Gráficos financeiros
- Atividades recentes
- Próximas reservas

### 🏠 Gestão de Apartamentos
- Lista completa com filtros
- Detalhes de cada unidade
- Status de ocupação
- Histórico de alterações

### 👥 Gestão de Moradores
- Cadastro completo
- Relacionamento com apartamentos
- Tipos: proprietário, locatário, dependente
- Dados de contato e documentos

### 📅 Sistema de Reservas
- Áreas comuns disponíveis
- Calendário de disponibilidade
- Confirmação automática
- Histórico de reservas

### 💰 Controle Financeiro
- Contas a receber/pagar
- Fluxo de caixa detalhado
- Categorização de despesas
- Relatórios financeiros

### 👨‍💼 Gestão de Funcionários
- Cadastro com dados pessoais
- Cargos e salários
- Benefícios e documentos
- Controle de ponto

### 🎫 Sistema de Chamados
- Abertura de tickets
- Categorização por tipo
- Priorização e status
- Histórico completo

### 🏦 Integração Bancária (Nova!)
Sistema completo de gestão financeira com integração real aos bancos brasileiros:

#### 📥 Importação de Extratos
- **Formatos suportados**: OFX, CSV, TXT
- **Bancos compatíveis**: Banco do Brasil, Itaú, Caixa, Santander, Bradesco
- **Validação automática**: Verificação de formato e conteúdo
- **Categorização inteligente**: IA para classificar transações automaticamente
- **Processamento em lote**: Múltiplos arquivos simultaneamente

#### 🔄 Conciliação Bancária Automática
- **Algoritmo ML**: Matching inteligente usando Levenshtein Distance
- **Regras customizáveis**: Engine de regras para diferentes tipos de transação
- **Três níveis de match**: Perfeito (100%), Provável (>80%), Manual (<80%)
- **Aprovação em lote**: Confirme múltiplas transações de uma vez
- **Relatórios detalhados**: Análise completa do processo de conciliação

#### 📄 Geração Real de Boletos
- **APIs oficiais**: Integração com Banco do Brasil e Itaú
- **OAuth 2.0**: Autenticação segura com tokens
- **Ambientes**: Sandbox para testes, Production para uso real
- **Features completas**:
  - Linha digitável oficial
  - Código de barras válido
  - Multa e juros configuráveis
  - Status em tempo real
  - Webhook para atualizações automáticas

#### 🔧 Funcionalidades Técnicas
- **Parser OFX**: Interpretação completa do formato padrão bancário
- **CSV Inteligente**: Detecção automática do layout por banco
- **Validação robusta**: Verificação de integridade e formato
- **Cache de resultados**: Performance otimizada para grandes volumes
- **Logs detalhados**: Rastreabilidade completa das operações

#### 🚀 APIs Suportadas
| Banco | Extrato | Boleto | PIX | Status |
|-------|---------|--------|-----|--------|
| Banco do Brasil | ✅ | ✅ | 🔄 | Produção |
| Itaú | ✅ | ✅ | 🔄 | Produção |
| Caixa Econômica | ✅ | 🔄 | 🔄 | Desenvolvimento |
| Santander | ✅ | 🔄 | 🔄 | Planejado |
| Bradesco | ✅ | 🔄 | 🔄 | Planejado |

#### 📊 Métricas e Relatórios
- **Dashboard financeiro**: Visão consolidada de todas as contas
- **Fluxo de caixa**: Gráficos interativos de entrada e saída
- **Conciliação**: Métricas de sucesso e pendências
- **Boletos**: Acompanhamento de geração e pagamentos

## 🛠 Tecnologias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| Next.js | 14 | Framework React com App Router |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 3.4 | Framework CSS utilitário |
| shadcn/ui | Latest | Biblioteca de componentes |
| Lucide React | Latest | Ícones modernos |
| Radix UI | Latest | Primitivos acessíveis |
| Prisma | 6.17 | ORM para banco de dados |
| PostgreSQL | Latest | Banco de dados (via Supabase) |
| Zod | 3.23 | Validação de schemas |

### 🏦 Tecnologias Bancárias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| OFX Parser | Custom | Parser para extratos bancários OFX |
| CSV Parser | Custom | Interpretador inteligente de CSV bancário |
| Levenshtein Distance | Custom | Algoritmo para matching de transações |
| OAuth 2.0 | Standard | Autenticação segura com APIs bancárias |
| Axios | Latest | Cliente HTTP para APIs REST |
| Date-fns | Latest | Manipulação avançada de datas |

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18.17+
- npm, yarn ou pnpm
- Git
- Conta no [Supabase](https://supabase.com) (gratuita)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone [repository-url]
   cd shadcn-ui-sidebar
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados** 📊

   Siga o guia rápido: [QUICK_START.md](./QUICK_START.md)

   Resumo:
   ```bash
   # 1. Crie projeto no Supabase
   # 2. Configure .env com suas connection strings
   cp .env.example .env

   # 3. Gere Prisma Client
   npm run db:generate

   # 4. Aplique schema
   npm run db:push

   # 5. Popule com dados de exemplo
   npm run db:seed
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse o sistema**
   ```
   http://localhost:3000
   ```

### Configuração Bancária (Opcional)

Para usar as funcionalidades bancárias reais, configure as variáveis de ambiente:

1. **Crie o arquivo `.env.local`**
   ```bash
   # Banco do Brasil API
   NEXT_PUBLIC_BB_CLIENT_ID=seu_client_id_bb
   NEXT_PUBLIC_BB_CLIENT_SECRET=seu_client_secret_bb
   NEXT_PUBLIC_BB_API_KEY=sua_api_key_bb

   # Itaú API
   NEXT_PUBLIC_ITAU_CLIENT_ID=seu_client_id_itau
   NEXT_PUBLIC_ITAU_CLIENT_SECRET=seu_client_secret_itau
   NEXT_PUBLIC_ITAU_API_KEY=sua_api_key_itau

   # Ambiente (sandbox/production)
   NEXT_PUBLIC_BANK_ENVIRONMENT=sandbox
   ```

2. **Obtenha as credenciais**
   - **Banco do Brasil**: [Portal do Desenvolvedor BB](https://developers.bb.com.br/)
   - **Itaú**: [Portal do Desenvolvedor Itaú](https://developer.itau.com.br/)

3. **Configure certificados** (se necessário)
   - Coloque os certificados `.pem` em `src/lib/banking/certificates/`
   - Configure os caminhos no arquivo de configuração

> **⚠️ Importante**: As funcionalidades bancárias funcionam com dados de demonstração mesmo sem as credenciais. Para uso em produção, as credenciais são obrigatórias.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router
│   ├── (demo)/            # Rotas protegidas
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── apartments/    # Apartamentos
│   │   ├── residents/     # Moradores
│   │   ├── reservations/  # Reservas
│   │   ├── financials/    # Financeiro
│   │   ├── banking/       # 🏦 Nova! Integração Bancária
│   │   ├── employees/     # Funcionários
│   │   └── tickets/       # Chamados
│   ├── login/             # Login
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── admin-panel/       # Layout e navegação
│   └── ui/               # Componentes shadcn/ui
├── hooks/                # Hooks customizados
└── lib/                  # Utilitários
    ├── banking/          # 🏦 Novo! Serviços bancários
    │   ├── statement-parser.ts    # Parser de extratos OFX/CSV
    │   ├── reconciliation.ts      # Conciliação automática
    │   ├── boleto-service.ts      # Geração real de boletos
    │   └── certificates/          # Certificados bancários
    ├── menu-list.ts       # Configuração do menu
    └── utils.ts          # Utilitários gerais
```

## 🎨 Screenshots

### Dashboard
![Dashboard](public/demo-light-min.png)

### Modo Escuro
![Dark Mode](public/demo-dark-min.png)

### Mobile
![Mobile](public/demo-mobile-light-min.png)

## 🔧 Exemplos de Uso Bancário

### Importação de Extrato
```typescript
// Exemplo de uso do StatementParser
import { StatementParser } from '@/lib/banking/statement-parser';

const handleFileImport = async (file: File) => {
  // Validar arquivo
  const validation = StatementParser.validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Processar arquivo
  const content = await file.text();
  const statement = file.name.endsWith('.ofx') 
    ? StatementParser.parseOFX(content)
    : StatementParser.parseCSV(content, validation.bankCode);

  console.log(`${statement.entries.length} transações importadas`);
};
```

### Conciliação Automática
```typescript
// Exemplo de conciliação bancária
import { BankReconciliationService } from '@/lib/banking/reconciliation';

const reconcileTransactions = async () => {
  const result = await BankReconciliationService.reconcile(
    importedEntries,    // Transações do extrato
    systemTransactions  // Transações do sistema
  );

  console.log(`${result.perfectMatches} matches perfeitos encontrados`);
  console.log(`${result.probableMatches} matches prováveis encontrados`);
};
```

### Geração de Boleto
```typescript
// Exemplo de geração de boleto real
import { BoletoService } from '@/lib/banking/boleto-service';

const generateBoleto = async () => {
  const service = new BoletoService(credentials);
  
  const response = await service.generateBoleto({
    amount: 250.00,
    dueDate: '2024-12-31',
    payer: {
      name: 'João Silva',
      document: '12345678901',
      email: 'joao@email.com'
    },
    description: 'Taxa condominial - Dezembro 2024'
  });

  if (response.success) {
    console.log('Boleto gerado:', response.data.digitableLine);
  }
};
```

## 📱 Responsividade

O sistema é totalmente responsivo com diferentes layouts para:

- **Desktop**: Layout completo com sidebar fixa
- **Tablet**: Sidebar colapsável
- **Mobile**: Menu hambúrguer otimizado

## 🔧 Personalização

### Temas
Edite as variáveis CSS em `src/app/globals.css`:

```css
:root {
  --primary: 210 40% 58%;
  --secondary: 210 40% 96%;
  /* ... outras variáveis */
}
```

### Adicionando Páginas
1. Crie em `src/app/(demo)/[nome]/page.tsx`
2. Adicione no menu em `src/lib/menu-list.ts`
3. Siga os padrões existentes

### Componentes shadcn/ui
```bash
npx shadcn-ui@latest add [component-name]
```

## 🏗 Arquitetura Multi-tenant

O sistema suporta múltiplos condomínios com:

- **Isolamento de dados**: Cada condomínio tem seus próprios dados
- **Customizações**: Configurações específicas por tenant
- **Domínios**: Suporte a subdomínios ou domínios dedicados
- **Escalabilidade**: Arquitetura preparada para crescimento

## 🗄️ Banco de Dados

O sistema utiliza **Prisma ORM** com **PostgreSQL** (via Supabase).

### Modelos Principais
- **Condominium**: Gestão de condomínios
- **Apartment**: Unidades habitacionais
- **Resident**: Moradores (proprietários, locatários, dependentes)
- **Vehicle & Pet**: Veículos e pets
- **Employee**: Funcionários
- **CommonArea & Reservation**: Áreas comuns e reservas
- **Visitor**: Controle de visitantes
- **Ticket**: Sistema de chamados
- **FinancialRecord**: Receitas e despesas
- **Notification**: Notificações SMS/WhatsApp

### Comandos do Banco
```bash
npm run db:generate  # Gerar Prisma Client
npm run db:push      # Aplicar schema ao banco
npm run db:migrate   # Criar migration
npm run db:studio    # Abrir Prisma Studio (GUI)
npm run db:seed      # Popular com dados de exemplo
```

### Documentação do Banco
- [QUICK_START.md](./QUICK_START.md) - Setup rápido (5 min)
- [PRISMA_SETUP.md](./PRISMA_SETUP.md) - Guia completo
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Estrutura detalhada

### Documentação do Frontend
- [DIALOGS_IMPLEMENTATION.md](./DIALOGS_IMPLEMENTATION.md) - Implementação de modais de criar/editar

## 📡 API REST

O sistema possui **5 APIs REST completas** com CRUD:

- ✅ **Apartamentos** (`/api/apartments`)
- ✅ **Moradores** (`/api/residents`)
- ✅ **Reservas** (`/api/reservations`)
- ✅ **Visitantes** (`/api/visitors`)
- ✅ **Financeiro** (`/api/financial`)

Todas com:
- GET (listar com filtros)
- POST (criar com validação)
- PATCH (atualizar)
- DELETE (remover)

### Exemplo de Uso
```typescript
// Listar apartamentos
const res = await fetch('/api/apartments?condominiumId=123')
const apartments = await res.json()

// Criar morador
await fetch('/api/residents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'João', type: 'OWNER', ... })
})
```

### Guias das APIs
- [API_QUICK_START.md](./API_QUICK_START.md) - Início rápido
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Documentação completa

## 🔮 Próximos Passos

### Backend
- [x] Banco de dados (PostgreSQL com Prisma)
- [x] Schema completo do banco
- [x] Seed com dados de exemplo
- [x] API Routes com Next.js (5 APIs REST)
- [x] Autenticação (NextAuth.js)
- [x] Validações (Zod)
- [ ] Conectar frontend às APIs
- [ ] Middleware de autorização
- [ ] Paginação nas APIs
- [ ] Middleware multi-tenant

### Funcionalidades Gerais
- [ ] Sistema de notificações (estrutura pronta)
- [ ] Relatórios em PDF
- [ ] Upload de documentos
- [ ] Chat em tempo real
- [ ] App mobile

### 🏦 Melhorias Bancárias
- [ ] **PIX**: Integração completa para recebimentos e pagamentos
- [ ] **Mais bancos**: Santander, Bradesco, Nubank
- [ ] **Open Banking**: Integração com APIs do Banco Central
- [ ] **Machine Learning**: Melhorar precisão da conciliação
- [ ] **Webhooks**: Notificações em tempo real de pagamentos
- [ ] **Backup automático**: Backup de dados bancários
- [ ] **Auditoria**: Log completo de operações financeiras
- [ ] **Dashboard BI**: Analytics avançados financeiros

## 📚 Documentação

### Backend
- **[API_QUICK_START.md](./API_QUICK_START.md)**: Início rápido com as APIs
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**: Documentação completa das APIs
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**: Resumo da implementação

### Banco de Dados
- **[QUICK_START.md](./QUICK_START.md)**: Setup rápido do banco
- **[PRISMA_SETUP.md](./PRISMA_SETUP.md)**: Guia completo Prisma + Supabase
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)**: Estrutura do banco

### Frontend
- **[Documentação Completa](DOCUMENTATION_COMPLETE.md)**: Guia detalhado do frontend
- **[shadcn/ui](https://ui.shadcn.com/)**: Biblioteca de componentes
- **[Next.js 14](https://nextjs.org/docs)**: Framework React
- **[Tailwind CSS](https://tailwindcss.com/docs)**: CSS utilitário

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting
npm run type-check   # Verificação de tipos
```

## 📊 Status do Projeto

- ✅ **Interface**: Completa e responsiva
- ✅ **Componentes**: shadcn/ui integrados
- ✅ **Páginas**: Todas as principais criadas
- ✅ **Dados**: Exemplos realistas
- ✅ **Integração Bancária**: Funcionalidades reais implementadas
  - ✅ Importação de extratos (OFX/CSV)
  - ✅ Conciliação automática com IA
  - ✅ Geração real de boletos (BB/Itaú)
  - ✅ APIs de produção configuradas
- 🔄 **Backend**: Em desenvolvimento
- 🔄 **Autenticação**: Planejada
- 🔄 **API**: Em desenvolvimento
- 🔄 **PIX**: Integração planejada

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Desenvolvido por

**Sistema criado com ❤️ para modernizar a gestão condominial**

Para dúvidas ou suporte:
- 📧 Entre em contato via Issues
- 📖 Consulte a [documentação completa](DOCUMENTATION_COMPLETE.md)
- 🐛 Reporte bugs via Issues do GitHub

---

*Última atualização: Agosto 2025 - Integração Bancária Real implementada*
