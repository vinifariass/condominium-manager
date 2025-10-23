# Implementação de Dialogs (Modais)

Este documento descreve a implementação dos dialogs de criar/editar nas páginas de Apartamentos e Moradores.

## 📋 O que foi implementado

### 1. **Página de Apartamentos** ([src/app/(demo)/apartamentos/page.tsx](src/app/(demo)/apartamentos/page.tsx))

#### Funcionalidades
- ✅ Dialog para criar novo apartamento
- ✅ Dialog para editar apartamento existente
- ✅ Formulário completo com validação
- ✅ Estados de loading durante submissão
- ✅ Atualização automática da lista após criar/editar
- ✅ Botão "Editar" conectado em cada card de apartamento

#### Campos do Formulário
- **Número** * (obrigatório)
- **Andar** * (obrigatório)
- **Área (m²)** * (obrigatório)
- **Taxa Mensal (R$)** * (obrigatório)
- **Quartos** * (obrigatório)
- **Banheiros** * (obrigatório)
- **Vagas** * (obrigatório)
- **Status** * (select com opções: Vago, Ocupado, Em Manutenção, Inadimplente)

#### Estados do Dialog
- **Criar**: Formulário vazio para adicionar novo apartamento
- **Editar**: Formulário preenchido com dados do apartamento selecionado
- **Loading**: Spinner no botão durante submissão
- **Sucesso**: Dialog fecha automaticamente e lista é atualizada

---

### 2. **Página de Moradores** ([src/app/(demo)/moradores/page.tsx](src/app/(demo)/moradores/page.tsx))

#### Funcionalidades
- ✅ Dialog para criar novo morador
- ✅ Dialog para editar morador existente
- ✅ Formulário completo com validação
- ✅ Estados de loading durante submissão
- ✅ Atualização automática da lista após criar/editar
- ✅ Botão "Editar" conectado em cada card de morador

#### Campos do Formulário
- **Nome Completo** * (obrigatório)
- **CPF** * (obrigatório)
- **RG** (opcional)
- **Email** (opcional)
- **Telefone** * (obrigatório)
- **Tipo** * (select: Proprietário, Locatário, Dependente)
- **ID do Apartamento** * (obrigatório)
- **Status** * (select: Ativo, Inativo, Mudou-se)
- **É proprietário?** (select: Sim/Não)

#### Estados do Dialog
- **Criar**: Formulário vazio para adicionar novo morador
- **Editar**: Formulário preenchido com dados do morador selecionado
- **Loading**: Spinner no botão durante submissão
- **Sucesso**: Dialog fecha automaticamente e lista é atualizada

---

## 🎨 Componentes Utilizados

### Shadcn/ui Components
- **Dialog**: Container principal do modal
- **DialogTrigger**: Botão que abre o dialog
- **DialogContent**: Conteúdo do dialog
- **DialogHeader**: Cabeçalho com título e descrição
- **DialogTitle**: Título do dialog
- **DialogDescription**: Descrição do dialog
- **DialogFooter**: Rodapé com botões de ação
- **DialogClose**: Botão para fechar o dialog
- **Input**: Campos de texto
- **Label**: Labels dos campos
- **Select**: Campos de seleção dropdown
- **Button**: Botões de ação
- **Loader2**: Ícone de loading animado

---

## 🔄 Fluxo de Funcionamento

### Criar Novo Registro

1. Usuário clica no botão "Novo Apartamento" ou "Novo Morador"
2. Dialog abre com formulário vazio
3. Usuário preenche os campos obrigatórios
4. Usuário clica em "Criar"
5. Botão mostra loading spinner
6. Request POST é enviado para a API
7. Se sucesso:
   - Dialog fecha automaticamente
   - Lista é recarregada com novo registro
8. Se erro:
   - Alert exibe mensagem de erro
   - Dialog permanece aberto para correção

### Editar Registro Existente

1. Usuário clica no botão "Editar" em um card
2. Dialog abre com formulário preenchido com dados existentes
3. Usuário modifica os campos desejados
4. Usuário clica em "Atualizar"
5. Botão mostra loading spinner
6. Request PATCH é enviado para a API
7. Se sucesso:
   - Dialog fecha automaticamente
   - Lista é recarregada com dados atualizados
8. Se erro:
   - Alert exibe mensagem de erro
   - Dialog permanece aberto para correção

---

## 💻 Código Exemplo

### Estado do Dialog (Apartamentos)

```typescript
const [dialogOpen, setDialogOpen] = useState(false);
const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
const [submitting, setSubmitting] = useState(false);
```

### Função de Submit (Apartamentos)

```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setSubmitting(true);

  const formData = new FormData(e.currentTarget);
  const data = {
    number: formData.get('number') as string,
    floor: parseInt(formData.get('floor') as string),
    area: parseFloat(formData.get('area') as string),
    bedrooms: parseInt(formData.get('bedrooms') as string),
    bathrooms: parseInt(formData.get('bathrooms') as string),
    parkingSpots: parseInt(formData.get('parkingSpots') as string),
    monthlyFee: parseFloat(formData.get('monthlyFee') as string),
    status: formData.get('status') as ApartmentStatus,
    condominiumId: 'temp-id', // TODO: Get from user session
  };

  try {
    const url = editingApartment
      ? `/api/apartments/${editingApartment.id}`
      : '/api/apartments';
    const method = editingApartment ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Falha ao salvar apartamento');
    }

    await fetchApartments();
    setDialogOpen(false);
    setEditingApartment(null);
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Erro ao salvar');
  } finally {
    setSubmitting(false);
  }
}
```

### JSX do Dialog (Exemplo simplificado)

```typescript
<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogTrigger asChild>
    <Button onClick={() => setEditingApartment(null)}>
      <Plus className="h-4 w-4 mr-2" />
      Novo Apartamento
    </Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[600px]">
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {editingApartment ? 'Editar Apartamento' : 'Novo Apartamento'}
        </DialogTitle>
        <DialogDescription>
          {editingApartment
            ? 'Atualize as informações do apartamento'
            : 'Adicione um novo apartamento ao condomínio'}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {/* Campos do formulário */}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={handleCloseDialog}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            editingApartment ? 'Atualizar' : 'Criar'
          )}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

---

## ✨ Features Implementadas

### Validação
- ✅ Campos obrigatórios marcados com *
- ✅ Validação HTML5 nativa (required, type, step)
- ✅ Tipos de input corretos (email, number, text)

### UX/UI
- ✅ Loading spinner durante submissão
- ✅ Botão desabilitado durante loading
- ✅ Dialog fecha automaticamente após sucesso
- ✅ Formulário preenchido automaticamente no modo edição
- ✅ Placeholders descritivos em todos os campos
- ✅ Labels claras e intuitivas
- ✅ Design responsivo (sm:max-w-[600px])
- ✅ Suporte a tema dark/light

### Gerenciamento de Estado
- ✅ Estado separado para dialog aberto/fechado
- ✅ Estado para registro sendo editado (null = criando)
- ✅ Estado para loading durante submissão
- ✅ Limpeza de estado ao fechar dialog

---

## 🚀 Como Usar

### Criar Novo Registro

1. Abra a página de Apartamentos ou Moradores
2. Clique no botão "Novo Apartamento" ou "Novo Morador"
3. Preencha todos os campos obrigatórios (marcados com *)
4. Clique em "Criar"
5. Aguarde a confirmação e atualização da lista

### Editar Registro

1. Localize o registro na lista
2. Clique no botão "Editar" no card
3. Modifique os campos desejados
4. Clique em "Atualizar"
5. Aguarde a confirmação e atualização da lista

### Cancelar

- Clique no botão "Cancelar" ou
- Clique fora do dialog ou
- Pressione ESC

---

## 📝 Notas Importantes

### TODO Items

1. **condominiumId**: Atualmente usando 'temp-id', deve ser obtido da sessão do usuário
2. **Validação Backend**: Garantir que a API valida todos os campos
3. **Toast Notifications**: Substituir `alert()` por toast notifications (próxima feature)
4. **Error Handling**: Melhorar tratamento de erros específicos da API
5. **apartmentId em Moradores**: Implementar select dropdown para escolher apartamento ao invés de digitar ID

### Melhorias Futuras

- [ ] Toast notifications ao invés de alert
- [ ] Validação de CPF/RG
- [ ] Máscaras de input (telefone, CPF, valores)
- [ ] Select de apartamentos com busca
- [ ] Upload de documentos
- [ ] Confirmação antes de sair com dados não salvos
- [ ] Validação assíncrona (verificar CPF duplicado)

---

## 🔗 Arquivos Relacionados

- [src/app/(demo)/apartamentos/page.tsx](src/app/(demo)/apartamentos/page.tsx)
- [src/app/(demo)/moradores/page.tsx](src/app/(demo)/moradores/page.tsx)
- [src/components/ui/dialog.tsx](src/components/ui/dialog.tsx)
- [src/components/ui/select.tsx](src/components/ui/select.tsx)
- [src/components/ui/input.tsx](src/components/ui/input.tsx)
- [src/components/ui/label.tsx](src/components/ui/label.tsx)
- [src/app/api/apartments/route.ts](src/app/api/apartments/route.ts)
- [src/app/api/apartments/[id]/route.ts](src/app/api/apartments/[id]/route.ts)
- [src/app/api/residents/route.ts](src/app/api/residents/route.ts)
- [src/app/api/residents/[id]/route.ts](src/app/api/residents/[id]/route.ts)

---

## 📊 Progresso Geral

```
Páginas com Dialogs:       ██████████░░░░░░░░░░  40%
- ✅ Apartamentos (criar/editar)
- ✅ Moradores (criar/editar)
- ⏳ Reservas
- ⏳ Visitantes
- ⏳ Financeiro
```

---

**Data de Implementação**: 2025-10-22
**Status**: ✅ Completo e Funcional
