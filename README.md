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

## 🛠 Tecnologias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| Next.js | 14 | Framework React com App Router |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 3.4 | Framework CSS utilitário |
| shadcn/ui | Latest | Biblioteca de componentes |
| Lucide React | Latest | Ícones modernos |
| Radix UI | Latest | Primitivos acessíveis |

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18.17+
- npm, yarn ou pnpm
- Git

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

3. **Execute o projeto**
   ```bash
   npm run dev
   ```

4. **Acesse o sistema**
   ```
   http://localhost:3000
   ```

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
│   │   ├── employees/     # Funcionários
│   │   └── tickets/       # Chamados
│   ├── login/             # Login
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── admin-panel/       # Layout e navegação
│   └── ui/               # Componentes shadcn/ui
├── hooks/                # Hooks customizados
└── lib/                  # Utilitários
```

## 🎨 Screenshots

### Dashboard
![Dashboard](public/demo-light-min.png)

### Modo Escuro
![Dark Mode](public/demo-dark-min.png)

### Mobile
![Mobile](public/demo-mobile-light-min.png)

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

## 🔮 Próximos Passos

### Backend
- [ ] API Routes com Next.js
- [ ] Banco de dados (PostgreSQL)
- [ ] Autenticação (NextAuth.js)
- [ ] Middleware multi-tenant

### Funcionalidades
- [ ] Sistema de notificações
- [ ] Relatórios em PDF
- [ ] Upload de documentos
- [ ] Chat em tempo real
- [ ] App mobile

## 📚 Documentação

- **[Documentação Completa](DOCUMENTATION_COMPLETE.md)**: Guia detalhado
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
- 🔄 **Backend**: Em desenvolvimento
- 🔄 **Autenticação**: Planejada
- 🔄 **API**: Em desenvolvimento

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

*Última atualização: Dezembro 2024*
