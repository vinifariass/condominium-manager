# 🔐 Sistema de Permissões e Troca de Usuário

## ✅ Funcionalidades Implementadas

### 1. Sistema de Permissões
- **4 Tipos de Usuário**:
  - **Admin**: Acesso total ao sistema
  - **Manager** (Síndico): Gerencia operações do condomínio
  - **Employee** (Funcionário): Reservas, chamados e manutenção
  - **Resident** (Morador): Apenas reservas e chamados próprios

### 2. Permissões por Funcionalidade
| Funcionalidade | Admin | Manager | Employee | Resident |
|---------------|-------|---------|----------|----------|
| Dashboard | ✅ | ✅ | ✅ | ❌ |
| Condomínios | ✅ | ❌ | ❌ | ❌ |
| Usuários | ✅ | ❌ | ❌ | ❌ |
| Apartamentos | ✅ | ✅ | ❌ | ❌ |
| Moradores | ✅ | ✅ | ❌ | ❌ |
| Funcionários | ✅ | ✅ | ❌ | ❌ |
| Financeiro/Banking | ✅ | ✅ | ❌ | ❌ |
| Reservas | ✅ | ✅ | ✅ | ✅ |
| Chamados | ✅ | ✅ | ✅ | ✅ |
| Relatórios | ✅ | ✅ | ❌ | ❌ |

### 3. Troca de Usuário
- **Rota**: `/switch-user`
- **Funcionalidade**: Permite simular diferentes tipos de usuário para testar permissões
- **Usuários Disponíveis**:
  - **Administrador Sistema** (admin@sistema.com) - Admin
  - **João Silva** (joao.silva@email.com) - Manager/Síndico
  - **Maria Santos** (maria.santos@email.com) - Employee/Funcionário

## 🧪 Como Testar

### 1. Acesse a página de troca de usuário
```
http://localhost:3000/switch-user
```

### 2. Teste diferentes usuários
1. **Como Admin**:
   - Acesso a todas as funcionalidades
   - Pode ver condomínios, usuários, financeiro

2. **Como Manager (Síndico)**:
   - Acesso limitado (sem condomínios e usuários)
   - Pode gerenciar apartamentos, moradores, financeiro

3. **Como Employee (Funcionário)**:
   - Acesso apenas a reservas e chamados
   - Não pode acessar financeiro, apartamentos, moradores

### 3. Páginas Protegidas com PermissionGuard
- ✅ `/users` - Gestão de Usuários (Admin only)
- ✅ `/condominiums` - Gestão de Condomínios (Admin only)
- ✅ `/banking` - Integração Bancária (Admin + Manager)
- ✅ `/apartments` - Gestão de Apartamentos (Admin + Manager)
- ✅ `/residents` - Gestão de Moradores (Admin + Manager)
- ✅ `/financials` - Controle Financeiro (Admin + Manager)

### 4. Menu Dinâmico
- O menu lateral se adapta automaticamente às permissões do usuário
- Itens são ocultados se o usuário não tem permissão

## 🐛 Debug

### Componente de Debug
Um componente de debug aparece no canto inferior direito (apenas em desenvolvimento) mostrando:
- Usuário atual logado
- Role/perfil do usuário
- Permissões ativas

### Logs do Console
- Logs detalhados no terminal do servidor
- Acompanhe as trocas de usuário no console

## 🔧 Implementação Técnica

### Arquivos Principais
- `src/hooks/use-current-user.ts` - Hook para gerenciar usuário atual
- `src/components/permission-guard.tsx` - Componente para proteger páginas
- `src/lib/types/user.ts` - Tipos e permissões
- `src/lib/db/mock-users.ts` - Banco de dados mock de usuários
- `src/app/(demo)/switch-user/page.tsx` - Página de troca de usuário

### Como Proteger uma Nova Página
```tsx
import { PermissionGuard } from "@/components/permission-guard";

export default function MinhaPage() {
  return (
    <PermissionGuard 
      permissions={["canManageFinancials"]}
      fallback={<div>Acesso Negado</div>}
    >
      <MeuConteudo />
    </PermissionGuard>
  );
}
```

## ✅ Status Atual
- ✅ Sistema de permissões funcionando
- ✅ Troca de usuário funcionando
- ✅ Menu dinâmico funcionando
- ✅ Páginas principais protegidas
- ✅ Debug tool implementado

## 🎯 Próximos Passos
- [ ] Implementar autenticação real (NextAuth.js)
- [ ] Persistir usuário no localStorage/cookies
- [ ] Adicionar mais granularidade nas permissões
- [ ] Implementar roles customizados por condomínio
