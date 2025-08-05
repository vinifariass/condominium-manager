import {
  LayoutGrid,
  Building2,
  Users,
  Key,
  UserCheck,
  Calendar,
  DollarSign,
  FileText,
  HeadphonesIcon,
  Bell,
  Settings,
  CreditCard,
  BarChart3,
  MapPin,
  Wrench,
  LucideIcon,
  HelpCircle,
  Calculator,
  FileSpreadsheet,
  Banknote
} from "lucide-react";
import { UserPermissions } from "./types/user";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  permission?: keyof UserPermissions;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  permission?: keyof UserPermissions;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, permissions?: UserPermissions): Group[] {
  const allMenus: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          permission: "canViewDashboard",
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Gestão",
      menus: [
        {
          href: "/condominiums",
          label: "Condomínios",
          icon: Building2,
          permission: "canManageCondominiums"
        },
        {
          href: "/apartments",
          label: "Apartamentos", 
          icon: Key,
          permission: "canManageApartments"
        },
        {
          href: "/residents",
          label: "Moradores",
          icon: Users,
          permission: "canManageResidents"
        },
        {
          href: "/visitor-control",
          label: "Controle de Visitantes",
          icon: UserCheck,
          permission: "canManageResidents"
        },
        {
          href: "/employees",
          label: "Funcionários",
          icon: Users,
          permission: "canManageEmployees"
        },
        {
          href: "/hr-management",
          label: "Recursos Humanos",
          icon: FileText,
          permission: "canManageEmployees",
          submenus: [
            {
              href: "/hr-management",
              label: "Dashboard RH",
              permission: "canManageEmployees"
            },
            {
              href: "/hr-management/medical-certificates",
              label: "Atestados Médicos",
              permission: "canManageEmployees"
            },
            {
              href: "/hr-management/substitutions",
              label: "Substituições",
              permission: "canManageEmployees"
            },
            {
              href: "/hr-management/timesheet",
              label: "Controle de Ponto",
              permission: "canManageEmployees"
            }
          ]
        },
        {
          href: "/users",
          label: "Usuários do Sistema",
          icon: Users,
          permission: "canManageUsers"
        }
      ]
    },
    {
      groupLabel: "Operações",
      menus: [
        {
          href: "/reservations",
          label: "Reservas",
          icon: Calendar,
          permission: "canManageReservations"
        },
        {
          href: "/common-areas",
          label: "Áreas Comuns",
          icon: MapPin,
          permission: "canManageReservations"
        },
        {
          href: "/maintenance",
          label: "Manutenção",
          icon: Wrench,
          permission: "canManageTickets"
        },
        {
          href: "/tickets",
          label: "Chamados",
          icon: HeadphonesIcon,
          permission: "canManageTickets"
        },
        {
          href: "/import",
          label: "Importação Excel",
          icon: FileSpreadsheet,
          permission: "canManageCondominiums"
        }
      ]
    },
    {
      groupLabel: "Financeiro",
      menus: [
        {
          href: "/banking",
          label: "Integração Bancária",
          icon: Banknote,
          permission: "canManageFinancials"
        },
        {
          href: "/financials",
          label: "Financeiro",
          icon: DollarSign,
          permission: "canManageFinancials",
          submenus: [
            {
              href: "/financials/income",
              label: "Receitas",
              permission: "canManageFinancials"
            },
            {
              href: "/financials/expenses",
              label: "Despesas",
              permission: "canManageFinancials"
            },
            {
              href: "/financials/fees",
              label: "Taxas Condominiais",
              permission: "canManageFinancials"
            }
          ]
        },
        {
          href: "/reports",
          label: "Relatórios",
          icon: BarChart3,
          permission: "canViewReports"
        }
      ]
    },
    {
      groupLabel: "Comunicação",
      menus: [
        {
          href: "/notices",
          label: "Avisos",
          icon: FileText,
          permission: "canManageTickets"
        },
        {
          href: "/notifications",
          label: "Notificações",
          icon: Bell,
          permission: "canManageTickets"
        }
      ]
    },
    {
      groupLabel: "Sistema",
      menus: [
        {
          href: "/switch-user",
          label: "Trocar Usuário",
          icon: Users,
          permission: "canManageUsers"
        },
        {
          href: "/settings",
          label: "Configurações",
          icon: Settings,
          permission: "canManageUsers"
        },
        {
          href: "/help",
          label: "Como usar",
          icon: HelpCircle
          // Sem permissão - todos podem acessar
        },
        {
          href: "/pricing",
          label: "Planos e Preços",
          icon: Calculator,
          permission: "canManageUsers"
        },
        {
          href: "/cards",
          label: "Cards",
          icon: CreditCard
          // Sem permissão - todos podem acessar
        }
      ]
    }
  ];

  // Se não há permissões, retorna todos os menus (para compatibilidade)
  if (!permissions) {
    return allMenus;
  }

  // Filtrar menus baseado nas permissões
  return allMenus.map(group => ({
    ...group,
    menus: group.menus.filter(menu => {
      // Se o menu não tem permissão definida, sempre mostrar
      if (!menu.permission) return true;
      
      // Verificar se o usuário tem a permissão necessária
      return permissions[menu.permission];
    }).map(menu => ({
      ...menu,
      submenus: menu.submenus?.filter(submenu => {
        // Se o submenu não tem permissão definida, sempre mostrar
        if (!submenu.permission) return true;
        
        // Verificar se o usuário tem a permissão necessária
        return permissions[submenu.permission];
      })
    }))
  })).filter(group => group.menus.length > 0); // Remover grupos vazios
}
