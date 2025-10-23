# Sistema Financeiro - Documentação

## Visão Geral
Foi implementado um sistema financeiro completo para o condomínio com dashboard, relatórios e controle de receitas, despesas e taxas condominiais.

## Páginas Implementadas

### 1. Dashboard Financeiro (`/financials`)
- **Localização**: `src/app/(demo)/financials/page.tsx`
- **Funcionalidades**:
  - Cards de resumo com totais de receitas, despesas, saldo líquido e taxa de pagamento
  - Quick actions para navegar para cada submenu
  - Lista de transações recentes
  - Links para relatórios

### 2. Receitas (`/financials/income`)
- **Localização**: `src/app/(demo)/financials/income/page.tsx`
- **Funcionalidades**:
  - Cards de resumo (Total Recebido, Receita Pendente, Total do Mês)
  - Tabela completa de receitas com:
    - Data, Descrição, Categoria
    - Apartamento e Morador
    - Valor e Status
    - Ações (Editar, Recibo)
  - Filtros e busca
  - Exportação de dados

### 3. Despesas (`/financials/expenses`)
- **Localização**: `src/app/(demo)/financials/expenses/page.tsx`
- **Funcionalidades**:
  - Cards de resumo (Total Pago, Pendente, Vencido, Total do Mês)
  - Tabela completa de despesas com:
    - Data, Descrição, Categoria
    - Fornecedor, Vencimento
    - Valor e Status
    - Ações (Editar, Pagar)
  - Controle de status (Pago, Pendente, Vencido)

### 4. Taxas Condominiais (`/financials/fees`)
- **Localização**: `src/app/(demo)/financials/fees/page.tsx`
- **Funcionalidades**:
  - Cards de resumo (Total Arrecadado, Pendente, Vencido, Taxa de Pagamento)
  - Tabela por apartamento com:
    - Apartamento e Morador
    - Mês/Ano e Vencimento
    - Valor base, Multas/Descontos
    - Total e Status
    - Ações (Boleto, Receber)
  - Cálculo automático de multas e descontos

### 5. Relatórios (`/reports`)
- **Localização**: `src/app/(demo)/reports/page.tsx`
- **Funcionalidades**:
  - Dashboard de análise com métricas principais
  - Gráficos de receitas e despesas por categoria
  - Galeria de relatórios disponíveis:
    - Relatório Financeiro Mensal
    - Relatório de Inadimplência
    - Demonstrativo de Resultados (DRE)
    - Relatório de Reservas
    - Balancete Contábil
    - Análise de Custos por Categoria
  - Download e visualização de relatórios

## Controle de Permissões
Todas as páginas utilizam o `PermissionGuard` com as seguintes permissões:
- **Páginas Financeiras**: `canManageFinancials`
- **Relatórios**: `canViewReports`

## Dados Mock
Cada página possui dados de demonstração realistas incluindo:
- Valores monetários em formato brasileiro
- Datas e prazos de vencimento
- Status diversos (Pago, Pendente, Vencido, Recebido)
- Categorias de receitas e despesas
- Apartamentos e moradores ficícios

## Funcionalidades de UI/UX
- **Breadcrumbs**: Navegação consistente em todas as páginas
- **Cards de Resumo**: Informações-chave destacadas
- **Tabelas Responsivas**: Layout adaptável para diferentes tamanhos de tela
- **Badges de Status**: Indicadores visuais coloridos para diferentes estados
- **Ações Contextuais**: Botões de ação apropriados para cada item
- **Feedback Visual**: Cores semânticas (verde para positivo, vermelho para negativo, etc.)

## Integrações
- **Sistema de Menu**: Integrado com o menu lateral e controle de permissões
- **Layout Padrão**: Utiliza o `ContentLayout` para consistência
- **Componentes UI**: Shadcn/ui para interface padronizada
- **Icons**: Lucide React para ícones consistentes

## Próximos Passos
1. Implementar funcionalidades reais de CRUD
2. Conectar com APIs backend
3. Adicionar validação de formulários
4. Implementar geração real de relatórios
5. Adicionar gráficos interativos
6. Integrar sistema de notificações para vencimentos

## Arquivos Criados/Modificados
- `src/app/(demo)/financials/page.tsx` - Dashboard financeiro principal
- `src/app/(demo)/financials/income/page.tsx` - Gestão de receitas
- `src/app/(demo)/financials/expenses/page.tsx` - Gestão de despesas
- `src/app/(demo)/financials/fees/page.tsx` - Taxas condominiais
- `src/app/(demo)/reports/page.tsx` - Sistema de relatórios
