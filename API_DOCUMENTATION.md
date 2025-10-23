# 📡 API Documentation

Documentação completa das APIs REST do sistema de gestão condominial.

## 🔐 Autenticação

### POST `/api/auth/[...nextauth]`
NextAuth.js endpoint para autenticação.

**Login com Credenciais:**
```json
POST /api/auth/callback/credentials
{
  "email": "admin@condominio.com",
  "password": "senha123"
}
```

**Sessão:**
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const session = await getServerSession(authOptions)
// session.user.id, session.user.role
```

---

## 🏠 Apartamentos

### GET `/api/apartments`
Lista todos os apartamentos.

**Query Parameters:**
- `condominiumId` (string, opcional) - Filtrar por condomínio
- `status` (string, opcional) - Filtrar por status (OCCUPIED, VACANT, MAINTENANCE, DEFAULTER)

**Response:**
```json
[
  {
    "id": "clx123...",
    "number": "101",
    "floor": 1,
    "area": 75,
    "bedrooms": 2,
    "bathrooms": 2,
    "parkingSpots": 1,
    "monthlyFee": 850,
    "status": "OCCUPIED",
    "balance": 0,
    "block": {
      "name": "Torre A"
    },
    "residents": [...],
    "condominium": {
      "id": "...",
      "name": "Condomínio Santos Dumont"
    }
  }
]
```

### POST `/api/apartments`
Cria novo apartamento.

**Body:**
```json
{
  "number": "101",
  "floor": 1,
  "area": 75,
  "bedrooms": 2,
  "bathrooms": 2,
  "parkingSpots": 1,
  "monthlyFee": 850,
  "condominiumId": "clx123...",
  "blockId": "clx456..." // opcional
}
```

### GET `/api/apartments/[id]`
Busca apartamento por ID.

**Response:** Objeto apartamento com relacionamentos completos.

### PATCH `/api/apartments/[id]`
Atualiza apartamento.

**Body:** Campos parciais para atualizar.

### DELETE `/api/apartments/[id]`
Deleta apartamento.

---

## 👥 Moradores

### GET `/api/residents`
Lista todos os moradores.

**Query Parameters:**
- `condominiumId` (string, opcional)
- `apartmentId` (string, opcional)
- `type` (string, opcional) - OWNER, TENANT, DEPENDENT
- `status` (string, opcional) - ACTIVE, INACTIVE, SUSPENDED

**Response:**
```json
[
  {
    "id": "clx123...",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-1111",
    "cpf": "123.456.789-10",
    "type": "OWNER",
    "isOwner": true,
    "status": "ACTIVE",
    "apartment": {
      "number": "101",
      "block": {
        "name": "Torre A"
      }
    },
    "vehicles": [...],
    "pets": [...]
  }
]
```

### POST `/api/residents`
Cria novo morador.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-1111",
  "cpf": "123.456.789-10",
  "type": "OWNER",
  "apartmentId": "clx123...",
  "condominiumId": "clx456...",
  "isOwner": true,
  "emergencyContactName": "Maria Silva",
  "emergencyContactPhone": "(11) 98888-2222",
  "emergencyContactRelationship": "Esposa"
}
```

### GET `/api/residents/[id]`
Busca morador por ID (com reservas e tickets).

### PATCH `/api/residents/[id]`
Atualiza morador.

### DELETE `/api/residents/[id]`
Deleta morador.

---

## 📅 Reservas

### GET `/api/reservations`
Lista todas as reservas.

**Query Parameters:**
- `condominiumId` (string, opcional)
- `status` (string, opcional) - PENDING, CONFIRMED, CANCELLED, COMPLETED

**Response:**
```json
[
  {
    "id": "clx123...",
    "date": "2024-02-15T00:00:00Z",
    "startTime": "18:00",
    "endTime": "23:00",
    "guests": 60,
    "status": "CONFIRMED",
    "paymentStatus": "PAID",
    "amount": 300,
    "observation": "Festa de aniversário",
    "commonArea": {
      "name": "Salão de Festas",
      "capacity": 80
    },
    "resident": {
      "name": "João Silva",
      "phone": "(11) 99999-1111",
      "apartment": {
        "number": "101"
      }
    }
  }
]
```

### POST `/api/reservations`
Cria nova reserva.

**Body:**
```json
{
  "commonAreaId": "clx123...",
  "residentId": "clx456...",
  "condominiumId": "clx789...",
  "date": "2024-02-15T00:00:00Z",
  "startTime": "18:00",
  "endTime": "23:00",
  "guests": 60,
  "amount": 300,
  "observation": "Festa de aniversário"
}
```

### GET `/api/reservations/[id]`
Busca reserva por ID.

### PATCH `/api/reservations/[id]`
Atualiza reserva (status, pagamento, etc).

### DELETE `/api/reservations/[id]`
Cancela reserva.

---

## 👋 Visitantes

### GET `/api/visitors`
Lista todos os visitantes.

**Query Parameters:**
- `condominiumId` (string, opcional)
- `status` (string, opcional) - WAITING, AUTHORIZED, DENIED, ENTERED, LEFT
- `type` (string, opcional) - VISITOR, DELIVERY, SERVICE, CONTRACTOR

**Response:**
```json
[
  {
    "id": "clx123...",
    "name": "Carlos Silva",
    "phone": "(11) 99999-1111",
    "document": "123.456.789-10",
    "purpose": "Visita pessoal",
    "type": "VISITOR",
    "status": "WAITING",
    "arrivalTime": "2024-01-20T14:30:00Z",
    "visitingResident": {
      "name": "João Silva",
      "phone": "(11) 98888-7777",
      "apartment": {
        "number": "101",
        "block": {
          "name": "Torre A"
        }
      }
    }
  }
]
```

### POST `/api/visitors`
Registra novo visitante.

**Body:**
```json
{
  "name": "Carlos Silva",
  "phone": "(11) 99999-1111",
  "document": "123.456.789-10",
  "visitingResidentId": "clx123...",
  "condominiumId": "clx456...",
  "purpose": "Visita pessoal",
  "type": "VISITOR",
  "vehiclePlate": "ABC-1234" // opcional
}
```

### GET `/api/visitors/[id]`
Busca visitante por ID.

### PATCH `/api/visitors/[id]`
Atualiza status do visitante (autorizar, negar, registrar saída).

**Body:**
```json
{
  "status": "AUTHORIZED",
  "authorizedBy": "Porteiro João"
}
```

### DELETE `/api/visitors/[id]`
Remove registro de visitante.

---

## 💰 Financeiro

### GET `/api/financial`
Lista todos os registros financeiros.

**Query Parameters:**
- `condominiumId` (string, opcional)
- `type` (string, opcional) - INCOME, EXPENSE
- `status` (string, opcional) - PENDING, PAID, OVERDUE, REFUNDED, CANCELLED

**Response:**
```json
[
  {
    "id": "clx123...",
    "type": "INCOME",
    "category": "Taxa Condominial",
    "description": "Taxa condominial - Apartamento 101",
    "amount": 850,
    "dueDate": "2024-01-15T00:00:00Z",
    "paymentDate": "2024-01-14T00:00:00Z",
    "paymentMethod": "PIX",
    "status": "PAID",
    "apartment": {
      "number": "101",
      "block": {
        "name": "Torre A"
      }
    }
  }
]
```

### POST `/api/financial`
Cria novo registro financeiro.

**Body:**
```json
{
  "type": "INCOME",
  "category": "Taxa Condominial",
  "description": "Taxa condominial - Apartamento 101",
  "amount": 850,
  "dueDate": "2024-01-15T00:00:00Z",
  "condominiumId": "clx123...",
  "apartmentId": "clx456..." // opcional
}
```

### GET `/api/financial/[id]`
Busca registro financeiro por ID.

### PATCH `/api/financial/[id]`
Atualiza registro (marcar como pago, adicionar data de pagamento).

**Body:**
```json
{
  "status": "PAID",
  "paymentDate": "2024-01-14T00:00:00Z",
  "paymentMethod": "PIX"
}
```

### DELETE `/api/financial/[id]`
Deleta registro financeiro.

---

## 🔧 Validação

Todas as rotas POST e PATCH usam **Zod** para validação de dados.

**Exemplo de erro de validação:**
```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["email"],
      "message": "Email inválido"
    }
  ]
}
```

## 🛡️ Códigos de Status HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request (validação falhou)
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Exemplo de Uso no Frontend

```typescript
// Buscar apartamentos
const response = await fetch('/api/apartments?condominiumId=clx123')
const apartments = await response.json()

// Criar apartamento
const response = await fetch('/api/apartments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    number: '101',
    floor: 1,
    area: 75,
    // ...
  })
})

// Atualizar apartamento
const response = await fetch(`/api/apartments/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'OCCUPIED',
    balance: -1700
  })
})

// Deletar apartamento
await fetch(`/api/apartments/${id}`, {
  method: 'DELETE'
})
```

## 🚀 Próximos Passos

- [ ] Adicionar autenticação com NextAuth em todas as rotas
- [ ] Implementar middleware de autorização (roles)
- [ ] Adicionar paginação nas listagens
- [ ] Implementar busca/filtros avançados
- [ ] Adicionar rate limiting
- [ ] Implementar cache (Redis)

---

**Documentação criada em:** Janeiro 2025
