# Sistema de Moradores - Documentação

## Funcionalidades Implementadas

### 1. Dashboard de Moradores
- **Cards de Estatísticas**: Total de moradores, proprietários, inquilinos e dependentes
- **Percentuais**: Distribuição proporcional de cada tipo de morador
- **Status em Tempo Real**: Atualização automática com base nos filtros aplicados

### 2. Cadastro de Moradores
- **Modal de Cadastro**: Interface amigável para adicionar novos moradores
- **Campos Obrigatórios**: Nome, apartamento e tipo de morador
- **Campos Opcionais**: Email, telefone, CPF, data de nascimento, bloco
- **Validação**: Verificação de campos obrigatórios antes do salvamento
- **Tipos de Morador**: 
  - Proprietário (ícone Shield)
  - Inquilino (ícone User)
  - Dependente (ícone UserPlus)

### 3. Sistema de Filtros Avançados
- **Busca Global**: Nome, email, apartamento ou CPF
- **Filtro por Status**: Ativo, Inativo, Pendente ou Todos
- **Filtro por Tipo**: Proprietário, Inquilino, Dependente ou Todos
- **Filtro por Apartamento**: Busca específica por número do apartamento
- **Indicador Visual**: Badge mostrando quantos filtros estão ativos
- **Limpeza de Filtros**: Botão para remover todos os filtros

### 4. Lista de Moradores
- **Cards Interativos**: Hover effects e layout responsivo
- **Avatar**: Iniciais do nome quando não há foto
- **Badges de Status**: Cores semânticas para status e tipos
- **Informações Completas**: 
  - Nome e badges de tipo/status
  - Apartamento, bloco, telefone e email
  - CPF, data de nascimento e data de cadastro
- **Ações Contextuais**: 
  - Editar morador
  - Menu dropdown com opções extras (enviar email, remover)

### 5. Estados da Interface
- **Lista Vazia**: Mensagem amigável quando não há moradores
- **Resultados Filtrados**: Contador de moradores filtrados vs total
- **Loading States**: Preparado para integração com APIs

## Componentes Utilizados

### UI Components (Shadcn/ui)
- `Dialog` - Modal de cadastro
- `Select` - Dropdowns de seleção
- `Input` - Campos de entrada
- `Button` - Botões de ação
- `Badge` - Indicadores visuais
- `Avatar` - Fotos dos moradores
- `Card` - Layout dos cards
- `DropdownMenu` - Menu de ações

### Icons (Lucide React)
- `Users`, `Shield`, `User`, `UserPlus` - Tipos e categorias
- `Plus`, `Edit`, `Trash2`, `Save` - Ações
- `Search`, `Filter`, `X` - Navegação e filtros
- `Phone`, `Mail`, `MapPin` - Informações de contato

## Dados Mock

### Estrutura do Morador
```typescript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  apartment: string,
  block: string,
  role: "Proprietário" | "Inquilino" | "Dependente",
  status: "Ativo" | "Inativo" | "Pendente",
  avatar: string | null,
  cpf: string,
  birthDate: string,
  createdAt: string
}
```

### Estados de Filtro
```typescript
{
  searchTerm: string,
  statusFilter: "all" | "Ativo" | "Inativo" | "Pendente",
  roleFilter: "all" | "Proprietário" | "Inquilino" | "Dependente",
  apartmentFilter: string
}
```

## Funcionalidades Interativas

### 1. Busca em Tempo Real
- Filtro instantâneo conforme o usuário digita
- Busca em múltiplos campos simultaneamente
- Case-insensitive para melhor UX

### 2. Filtros Combinados
- Múltiplos filtros podem ser aplicados simultaneamente
- Lógica AND entre diferentes tipos de filtro
- Indicador visual de filtros ativos

### 3. Gestão de Estado
- Estado local com React hooks
- Atualizações automáticas dos cards de estatística
- Formulário controlado com validação

### 4. Responsividade
- Layout adaptável para diferentes tamanhos de tela
- Grid responsivo nos cards de estatística
- Modal com scroll para telas menores

## Melhorias Futuras

### Integração com Backend
- [ ] Conectar com API REST
- [ ] Implementar loading states reais
- [ ] Adicionar tratamento de erros
- [ ] Implementar paginação

### Funcionalidades Avançadas
- [ ] Upload de foto do morador
- [ ] Edição inline de moradores
- [ ] Exportação para Excel/PDF
- [ ] Histórico de alterações
- [ ] Validação de CPF em tempo real
- [ ] Máscara para campos de telefone

### UX/UI
- [ ] Animações de transição
- [ ] Feedback visual para ações
- [ ] Confirmação antes de remover
- [ ] Toast notifications
- [ ] Skeleton loading

## Permissões e Segurança
- Sistema preparado para integração com controle de acesso
- Diferentes níveis de permissão para visualização/edição
- Validação de dados no frontend e backend

## Tecnologias Utilizadas
- **React 18**: Hooks, estado local, componentes funcionais
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Styling utility-first
- **Radix UI**: Componentes acessíveis e customizáveis
- **Lucide React**: Ícones consistentes e modernos
