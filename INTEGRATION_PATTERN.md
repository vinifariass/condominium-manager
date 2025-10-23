# 🔌 Padrão de Integração Frontend → API

## ✅ Implementado em:
- ✅ **Apartamentos** ([apartamentos/page.tsx](src/app/(demo)/apartamentos/page.tsx))
- ✅ **Moradores** ([moradores/page.tsx](src/app/(demo)/moradores/page.tsx))
- ✅ **Reservas** ([reservations/page-api.tsx](src/app/(demo)/reservations/page-api.tsx)) **← NOVO!**

## 📋 Checklist de Implementação

### 1. **Imports Necessários**
```typescript
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
```

### 2. **Estados**
```typescript
const [items, setItems] = useState<ItemType[]>([]);
const [loading, setLoading] = useState(true);
const [dialogOpen, setDialogOpen] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [editingItem, setEditingItem] = useState<ItemType | null>(null);
```

### 3. **Load Data (useEffect)**
```typescript
useEffect(() => {
  loadItems();
}, []);

async function loadItems() {
  try {
    setLoading(true);
    const res = await fetch(`/api/endpoint?condominiumId=${condominiumId}`);
    if (!res.ok) throw new Error("Erro ao carregar");
    const data = await res.json();
    setItems(data);
  } catch (error) {
    toast.error("Erro ao carregar dados");
  } finally {
    setLoading(false);
  }
}
```

### 4. **Create/Update (handleSubmit)**
```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  // Validação frontend
  if (!formData.requiredField) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }

  setSubmitting(true);
  try {
    const url = editingItem ? `/api/endpoint/${editingItem.id}` : "/api/endpoint";
    const method = editingItem ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, condominiumId }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao salvar");
    }

    toast.success(editingItem ? "Atualizado!" : "Criado!");
    setDialogOpen(false);
    resetForm();
    loadItems();
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setSubmitting(false);
  }
}
```

### 5. **Delete (handleDelete)**
```typescript
async function handleDelete(id: string) {
  if (!confirm("Tem certeza que deseja deletar?")) return;

  try {
    const res = await fetch(`/api/endpoint/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao deletar");
    toast.success("Deletado com sucesso!");
    loadItems();
  } catch (error: any) {
    toast.error(error.message);
  }
}
```

### 6. **Loading State**
```typescript
if (loading) {
  return (
    <ContentLayout title="Título">
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </ContentLayout>
  );
}
```

### 7. **Dialog com Form**
```typescript
<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogTrigger asChild>
    <Button onClick={resetForm}>
      <Plus className="h-4 w-4 mr-2" />
      Novo Item
    </Button>
  </DialogTrigger>
  <DialogContent>
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{editingItem ? "Editar" : "Novo"}</DialogTitle>
      </DialogHeader>

      {/* Form fields here */}
      <Input
        value={formData.field}
        onChange={(e) => setFormData({ ...formData, field: e.target.value })}
        required
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingItem ? "Atualizar" : "Criar"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

### 8. **Action Buttons**
```typescript
<Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
  Editar
</Button>
<Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
  <Trash2 className="h-4 w-4" />
</Button>
```

## 🎯 Features Implementadas

| Feature | Status | Descrição |
|---------|--------|-----------|
| **CRUD Completo** | ✅ | Create, Read, Update, Delete |
| **Loading States** | ✅ | Spinner durante carregamento |
| **Error Handling** | ✅ | Try/catch + Toast messages |
| **Toast Notifications** | ✅ | Feedback visual de sucesso/erro |
| **Validação Frontend** | ✅ | Validação antes de enviar |
| **Confirmação Delete** | ✅ | Confirmar antes de deletar |
| **Edit Mode** | ✅ | Preenche form com dados existentes |
| **Form Reset** | ✅ | Limpa form após criar/editar |
| **Auto Refresh** | ✅ | Recarrega lista após mudanças |
| **Disabled Submit** | ✅ | Desabilita botão durante submissão |

## 📦 Próximas Páginas

### Falta Implementar:
1. **Visitantes** → [/api/visitors](src/app/api/visitors/route.ts) ✅ API pronta
2. **Financeiro (Expenses)** → [/api/financial](src/app/api/financial/route.ts) ✅ API pronta
3. **Financeiro (Income)** → [/api/financial](src/app/api/financial/route.ts) ✅ API pronta
4. **Financeiro (Fees)** → [/api/financial](src/app/api/financial/route.ts) ✅ API pronta

## 🚀 Como Aplicar em Nova Página

1. Copie [reservations/page-api.tsx](src/app/(demo)/reservations/page-api.tsx)
2. Ajuste a interface `TypeScript` para o modelo
3. Troque os endpoints da API
4. Ajuste os campos do formulário
5. Teste CRUD completo
6. Renomeie para `page.tsx` quando pronto

## ⚠️ Importante

- **TODO**: Trocar `'temp-id'` por `condominiumId` real do usuário logado
- **TODO**: Adicionar paginação quando houver 100+ registros
- **TODO**: Adicionar busca/filtros no frontend

## 📊 Progresso Geral

```
Frontend/Backend Integration:
├─ Apartamentos         ████████████████████ 100%
├─ Moradores            ████████████████████ 100%
├─ Reservas             ████████████████████ 100% ← NOVO!
├─ Visitantes           ░░░░░░░░░░░░░░░░░░░░   0%
├─ Financeiro (Exp)     ░░░░░░░░░░░░░░░░░░░░   0%
├─ Financeiro (Inc)     ░░░░░░░░░░░░░░░░░░░░   0%
└─ Financeiro (Fees)    ░░░░░░░░░░░░░░░░░░░░   0%

TOTAL:                  ████████░░░░░░░░░░░░  43%
```

---

**Última atualização:** Outubro 2025
