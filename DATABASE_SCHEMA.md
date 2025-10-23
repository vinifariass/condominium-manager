# 🗄️ Esquema do Banco de Dados

Este documento descreve a estrutura completa do banco de dados do sistema de gestão condominial.

## 📊 Diagrama de Relacionamentos

```
┌─────────────────┐
│   Condominium   │ (Principal - Multi-tenant)
└────────┬────────┘
         │
         ├─── Block
         │     └─── Apartment
         │           ├─── Resident
         │           │     ├─── Vehicle
         │           │     ├─── Pet
         │           │     ├─── Reservation
         │           │     ├─── Ticket
         │           │     └─── Visitor (visitingResident)
         │           └─── FinancialRecord
         │
         ├─── Employee
         ├─── CommonArea
         │     └─── Reservation
         ├─── Notification
         └─── Visitor
```

## 📋 Tabelas e Campos

### 🏢 CONDOMINIUM (Condomínio)
Tabela principal que representa cada condomínio gerenciado pelo sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| name | String | Nome do condomínio |
| cnpj | String (UNIQUE) | CNPJ do condomínio |
| address | String | Endereço completo |
| city | String | Cidade |
| state | String | Estado (UF) |
| zipCode | String | CEP |
| phone | String | Telefone |
| email | String | Email de contato |
| managerName | String | Nome do síndico |
| totalApartments | Int | Total de apartamentos |
| totalResidents | Int | Total de moradores |
| occupancyRate | Float | Taxa de ocupação (%) |
| monthlyRevenue | Float | Receita mensal |
| status | Enum | ACTIVE, INACTIVE, MAINTENANCE |
| createdAt | DateTime | Data de criação |
| updatedAt | DateTime | Data de atualização |

**Relações:**
- blocks[] - Blocos do condomínio
- apartments[] - Apartamentos
- residents[] - Moradores
- employees[] - Funcionários
- commonAreas[] - Áreas comuns
- reservations[] - Reservas
- tickets[] - Chamados
- financialRecords[] - Registros financeiros
- notifications[] - Notificações
- visitors[] - Visitantes

---

### 🏗️ BLOCK (Bloco/Torre)
Representa blocos ou torres dentro de um condomínio.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| name | String | Nome do bloco (Ex: "Torre A") |
| floors | Int | Número de andares |
| apartmentsCount | Int | Total de apartamentos |
| condominiumId | String (FK) | Referência ao condomínio |

**Relações:**
- condominium - Condomínio pai
- apartments[] - Apartamentos do bloco

---

### 🏠 APARTMENT (Apartamento)
Representa cada unidade habitacional.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| number | String | Número do apartamento |
| blockId | String (FK) | Referência ao bloco (opcional) |
| condominiumId | String (FK) | Referência ao condomínio |
| floor | Int | Andar |
| area | Float | Área em m² |
| bedrooms | Int | Número de quartos |
| bathrooms | Int | Número de banheiros |
| parkingSpots | Int | Vagas de garagem |
| monthlyFee | Float | Taxa condominial mensal |
| status | Enum | OCCUPIED, VACANT, MAINTENANCE, DEFAULTER |
| balance | Float | Saldo (positivo = crédito, negativo = débito) |
| lastPaymentDate | DateTime | Data do último pagamento |

**UNIQUE CONSTRAINT:** (condominiumId, number) - Número único por condomínio

**Relações:**
- condominium - Condomínio
- block - Bloco (opcional)
- residents[] - Moradores
- vehicles[] - Veículos
- financialRecords[] - Registros financeiros

---

### 👥 RESIDENT (Morador)
Representa moradores (proprietários, locatários, dependentes).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| name | String | Nome completo |
| email | String | Email (opcional) |
| phone | String | Telefone |
| cpf | String (UNIQUE) | CPF |
| rg | String | RG (opcional) |
| birthDate | DateTime | Data de nascimento (opcional) |
| type | Enum | OWNER, TENANT, DEPENDENT |
| apartmentId | String (FK) | Referência ao apartamento |
| condominiumId | String (FK) | Referência ao condomínio |
| moveInDate | DateTime | Data de entrada |
| moveOutDate | DateTime | Data de saída (opcional) |
| status | Enum | ACTIVE, INACTIVE, SUSPENDED |
| isOwner | Boolean | É proprietário? |
| emergencyContactName | String | Nome do contato de emergência |
| emergencyContactPhone | String | Telefone do contato |
| emergencyContactRelationship | String | Parentesco |

**Relações:**
- apartment - Apartamento
- condominium - Condomínio
- vehicles[] - Veículos
- pets[] - Pets
- reservations[] - Reservas
- tickets[] - Chamados
- visitors[] - Visitantes (como anfitrião)

---

### 🚗 VEHICLE (Veículo)
Veículos dos moradores.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| plate | String (UNIQUE) | Placa |
| model | String | Modelo |
| brand | String | Marca (opcional) |
| color | String | Cor (opcional) |
| year | Int | Ano (opcional) |
| residentId | String (FK) | Referência ao morador |
| apartmentId | String (FK) | Referência ao apartamento |

---

### 🐾 PET (Pet)
Animais de estimação dos moradores.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| name | String | Nome do pet |
| species | String | Espécie (Cachorro, Gato, etc) |
| breed | String | Raça (opcional) |
| age | Int | Idade (opcional) |
| residentId | String (FK) | Referência ao morador |

---

### 👔 EMPLOYEE (Funcionário)
Funcionários do condomínio.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| name | String | Nome completo |
| email | String | Email (opcional) |
| phone | String | Telefone |
| cpf | String (UNIQUE) | CPF |
| role | String | Cargo |
| salary | Float | Salário (opcional) |
| hireDate | DateTime | Data de contratação |
| terminationDate | DateTime | Data de demissão (opcional) |
| status | Enum | ACTIVE, INACTIVE, ON_LEAVE |
| condominiumId | String (FK) | Referência ao condomínio |

---

### 🏊 COMMON_AREA (Área Comum)
Áreas comuns disponíveis para reserva.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| name | String | Nome (Ex: "Salão de Festas") |
| description | String | Descrição (opcional) |
| capacity | Int | Capacidade de pessoas |
| bookingFee | Float | Taxa de reserva |
| requiresApproval | Boolean | Requer aprovação do síndico |
| status | Enum | AVAILABLE, UNAVAILABLE, MAINTENANCE |
| condominiumId | String (FK) | Referência ao condomínio |

**Relações:**
- reservations[] - Reservas da área

---

### 📅 RESERVATION (Reserva)
Reservas de áreas comuns.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| commonAreaId | String (FK) | Referência à área comum |
| residentId | String (FK) | Referência ao morador |
| condominiumId | String (FK) | Referência ao condomínio |
| date | DateTime | Data da reserva |
| startTime | String | Horário início (Ex: "14:00") |
| endTime | String | Horário fim (Ex: "18:00") |
| guests | Int | Número de convidados |
| status | Enum | PENDING, CONFIRMED, CANCELLED, COMPLETED |
| paymentStatus | Enum | PENDING, PAID, OVERDUE, REFUNDED, CANCELLED |
| amount | Float | Valor |
| observation | String | Observações (opcional) |

---

### 👋 VISITOR (Visitante)
Controle de visitantes, entregas e prestadores de serviço.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| name | String | Nome do visitante |
| phone | String | Telefone (opcional) |
| document | String | Documento (CPF/RG) |
| visitingResidentId | String (FK) | Quem está visitando |
| condominiumId | String (FK) | Referência ao condomínio |
| vehiclePlate | String | Placa do veículo (opcional) |
| company | String | Empresa (para entregas/serviços) |
| purpose | String | Motivo da visita |
| type | Enum | VISITOR, DELIVERY, SERVICE, CONTRACTOR |
| status | Enum | WAITING, AUTHORIZED, DENIED, ENTERED, LEFT |
| arrivalTime | DateTime | Horário de chegada |
| departureTime | DateTime | Horário de saída (opcional) |
| authorizedBy | String | Autorizado por (opcional) |

---

### 🎫 TICKET (Chamado)
Sistema de chamados para manutenção, reclamações, sugestões.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| title | String | Título |
| description | String | Descrição detalhada |
| category | Enum | MAINTENANCE, CLEANING, SECURITY, COMPLAINT, SUGGESTION, OTHER |
| priority | Enum | LOW, MEDIUM, HIGH, URGENT |
| status | Enum | OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED |
| residentId | String (FK) | Quem abriu o chamado |
| condominiumId | String (FK) | Referência ao condomínio |
| assignedTo | String | Responsável (opcional) |
| resolvedAt | DateTime | Data de resolução (opcional) |

---

### 💰 FINANCIAL_RECORD (Registro Financeiro)
Receitas e despesas do condomínio.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| type | Enum | INCOME, EXPENSE |
| category | String | Categoria |
| description | String | Descrição |
| amount | Float | Valor |
| dueDate | DateTime | Data de vencimento (opcional) |
| paymentDate | DateTime | Data de pagamento (opcional) |
| paymentMethod | String | Método de pagamento (opcional) |
| status | Enum | PENDING, PAID, OVERDUE, REFUNDED, CANCELLED |
| apartmentId | String (FK) | Apartamento (opcional - para taxas) |
| condominiumId | String (FK) | Referência ao condomínio |

---

### 🔔 NOTIFICATION (Notificação)
Histórico de notificações enviadas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (CUID) | ID único |
| title | String | Título |
| message | String | Mensagem |
| type | Enum | VISITOR_ARRIVAL, DELIVERY, MAINTENANCE, PAYMENT_REMINDER, EMERGENCY, RESERVATION_CONFIRMATION, GENERAL |
| recipientPhone | String | Telefone do destinatário |
| recipientName | String | Nome do destinatário |
| method | Enum | SMS, WHATSAPP, EMAIL, PUSH |
| status | Enum | PENDING, SENT, DELIVERED, FAILED |
| sentAt | DateTime | Data/hora de envio (opcional) |
| condominiumId | String (FK) | Referência ao condomínio |
| metadata | JSON | Dados adicionais (opcional) |

---

## 🔑 Principais Relacionamentos

1. **Condominium → Apartment (1:N)**
   - Um condomínio tem muitos apartamentos
   - Cascade delete: deletar condomínio deleta apartamentos

2. **Apartment → Resident (1:N)**
   - Um apartamento pode ter vários moradores
   - Cascade delete: deletar apartamento deleta moradores

3. **Resident → Vehicle (1:N)**
   - Um morador pode ter vários veículos
   - Cascade delete

4. **Resident → Pet (1:N)**
   - Um morador pode ter vários pets
   - Cascade delete

5. **CommonArea → Reservation (1:N)**
   - Uma área comum tem várias reservas
   - Cascade delete

6. **Resident → Reservation (1:N)**
   - Um morador pode fazer várias reservas
   - Cascade delete

7. **Resident → Visitor (1:N)**
   - Um morador pode receber vários visitantes
   - Cascade delete

8. **Apartment → FinancialRecord (1:N)**
   - Um apartamento tem vários registros financeiros
   - Set null: deletar apartamento mantém registros

## 📈 Índices e Performance

### Índices Automáticos (Prisma)
- Primary Keys (id)
- Foreign Keys
- Unique constraints (cpf, cnpj, plate, etc)

### Índices Recomendados para Produção
```sql
-- Busca de apartamentos por status
CREATE INDEX idx_apartments_status ON apartments(status);

-- Busca de moradores ativos
CREATE INDEX idx_residents_status ON residents(status);

-- Busca de reservas por data
CREATE INDEX idx_reservations_date ON reservations(date);

-- Busca de visitantes por status e data
CREATE INDEX idx_visitors_status_arrival ON visitors(status, arrivalTime);

-- Busca financeira por tipo e status
CREATE INDEX idx_financial_type_status ON financial_records(type, status);
```

## 🛡️ Segurança e Boas Práticas

1. **Cascade Delete**: Deletar condomínio remove todos os dados relacionados
2. **Set Null**: Deletar apartamento mantém histórico financeiro
3. **Unique Constraints**: CPF, CNPJ, Placa únicos no sistema
4. **Validações**: Usar Zod no backend para validar dados
5. **Soft Delete**: Considerar adicionar `deletedAt` para registros importantes
6. **Auditoria**: Todos os modelos têm `createdAt` e `updatedAt`

## 🔄 Migrations vs Push

- **Development**: Use `npm run db:push` (mais rápido)
- **Production**: Use `npm run db:migrate` (controle de versão)
- **Schema Changes**: Sempre teste em ambiente de staging primeiro
