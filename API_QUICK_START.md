# 🚀 API Quick Start

Guia rápido para começar a usar as APIs REST.

## ⚡ Setup em 3 Passos

### 1. Configure o .env
```bash
cp .env.example .env
```

Edite `.env` e adicione:
```env
DATABASE_URL="sua-connection-string-do-supabase"
DIRECT_URL="sua-direct-url-do-supabase"
NEXTAUTH_SECRET="gere-um-secret-forte"
NEXTAUTH_URL="http://localhost:3000"
```

**Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 2. Aplicar Schema
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Iniciar
```bash
npm run dev
```

---

## 📡 Testando as APIs

### Via Browser (GET)
```
http://localhost:3000/api/apartments
http://localhost:3000/api/residents
http://localhost:3000/api/reservations
http://localhost:3000/api/visitors
http://localhost:3000/api/financial
```

### Via cURL

**Listar apartamentos:**
```bash
curl http://localhost:3000/api/apartments
```

**Criar apartamento:**
```bash
curl -X POST http://localhost:3000/api/apartments \
  -H "Content-Type: application/json" \
  -d '{
    "number": "103",
    "floor": 1,
    "area": 75,
    "bedrooms": 2,
    "bathrooms": 2,
    "parkingSpots": 1,
    "monthlyFee": 850,
    "condominiumId": "COLE-O-ID-DO-CONDOMINIO-AQUI"
  }'
```

**Atualizar apartamento:**
```bash
curl -X PATCH http://localhost:3000/api/apartments/APARTMENT-ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "OCCUPIED",
    "balance": -850
  }'
```

---

## 💻 No Frontend (React/Next.js)

### Exemplo 1: Listar Apartamentos
```typescript
'use client'

import { useEffect, useState } from 'react'

export function ApartmentsList() {
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApartments() {
      const res = await fetch('/api/apartments')
      const data = await res.json()
      setApartments(data)
      setLoading(false)
    }
    fetchApartments()
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      {apartments.map((apt) => (
        <div key={apt.id}>
          Apt {apt.number} - {apt.status}
        </div>
      ))}
    </div>
  )
}
```

### Exemplo 2: Criar Apartamento
```typescript
'use client'

import { useState } from 'react'

export function CreateApartmentForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      number: formData.get('number'),
      floor: Number(formData.get('floor')),
      area: Number(formData.get('area')),
      bedrooms: Number(formData.get('bedrooms')),
      bathrooms: Number(formData.get('bathrooms')),
      parkingSpots: Number(formData.get('parkingSpots')),
      monthlyFee: Number(formData.get('monthlyFee')),
      condominiumId: formData.get('condominiumId'),
    }

    try {
      const res = await fetch('/api/apartments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(`Erro: ${error.error}`)
        return
      }

      const apartment = await res.json()
      alert(`Apartamento ${apartment.number} criado!`)

      // Resetar formulário ou redirecionar
      e.currentTarget.reset()
    } catch (error) {
      alert('Erro ao criar apartamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="number" placeholder="Número" required />
      <input name="floor" type="number" placeholder="Andar" required />
      {/* ... outros campos ... */}
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Apartamento'}
      </button>
    </form>
  )
}
```

### Exemplo 3: Atualizar Status
```typescript
async function updateVisitorStatus(visitorId: string, status: string) {
  const res = await fetch(`/api/visitors/${visitorId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

  if (!res.ok) {
    throw new Error('Falha ao atualizar visitante')
  }

  return res.json()
}

// Uso:
await updateVisitorStatus('clx123...', 'AUTHORIZED')
```

---

## 🔍 Filtros nas APIs

Todas as APIs de listagem suportam filtros via query params:

```typescript
// Apartamentos de um condomínio específico
fetch('/api/apartments?condominiumId=clx123')

// Apartamentos ocupados
fetch('/api/apartments?status=OCCUPIED')

// Moradores proprietários
fetch('/api/residents?type=OWNER')

// Reservas confirmadas
fetch('/api/reservations?status=CONFIRMED')

// Visitantes aguardando
fetch('/api/visitors?status=WAITING')

// Receitas pagas
fetch('/api/financial?type=INCOME&status=PAID')
```

---

## 🛡️ Tratamento de Erros

```typescript
async function fetchWithErrorHandling() {
  try {
    const res = await fetch('/api/apartments')

    if (!res.ok) {
      const error = await res.json()

      if (res.status === 400) {
        // Erro de validação
        console.error('Validação:', error.details)
      } else if (res.status === 404) {
        console.error('Not found')
      } else {
        console.error('Erro:', error.error)
      }

      return null
    }

    return await res.json()
  } catch (error) {
    console.error('Network error:', error)
    return null
  }
}
```

---

## 📚 Próximos Passos

1. ✅ Testar as APIs no browser
2. ✅ Ver dados no Prisma Studio (`npm run db:studio`)
3. ✅ Conectar uma página do frontend à API
4. ✅ Implementar loading e error states
5. ✅ Adicionar toast notifications

---

## 📖 Documentação Completa

Para referência completa de todos os endpoints:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

Para entender a estrutura do banco:
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

**Pronto para desenvolver!** 🚀
