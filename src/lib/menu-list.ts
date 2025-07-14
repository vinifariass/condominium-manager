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
  FileSpreadsheet
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
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
          icon: Building2
        },
        {
          href: "/apartments",
          label: "Apartamentos", 
          icon: Key
        },
        {
          href: "/residents",
          label: "Moradores",
          icon: Users
        },
        {
          href: "/visitor-control",
          label: "Controle de Visitantes",
          icon: UserCheck
        },
        {
          href: "/employees",
          label: "Funcionários",
          icon: Users
        }
      ]
    },
    {
      groupLabel: "Operações",
      menus: [
        {
          href: "/reservations",
          label: "Reservas",
          icon: Calendar
        },
        {
          href: "/common-areas",
          label: "Áreas Comuns",
          icon: MapPin
        },
        {
          href: "/maintenance",
          label: "Manutenção",
          icon: Wrench
        },
        {
          href: "/tickets",
          label: "Chamados",
          icon: HeadphonesIcon
        },
        {
          href: "/import",
          label: "Importação Excel",
          icon: FileSpreadsheet
        }
      ]
    },
    {
      groupLabel: "Financeiro",
      menus: [
        {
          href: "/financials",
          label: "Financeiro",
          icon: DollarSign,
          submenus: [
            {
              href: "/financials/income",
              label: "Receitas"
            },
            {
              href: "/financials/expenses",
              label: "Despesas"
            },
            {
              href: "/financials/fees",
              label: "Taxas Condominiais"
            }
          ]
        },
        {
          href: "/reports",
          label: "Relatórios",
          icon: BarChart3
        }
      ]
    },
    {
      groupLabel: "Comunicação",
      menus: [
        {
          href: "/notices",
          label: "Avisos",
          icon: FileText
        },
        {
          href: "/notifications",
          label: "Notificações",
          icon: Bell
        }
      ]
    },
    {
      groupLabel: "Sistema",
      menus: [
        {
          href: "/settings",
          label: "Configurações",
          icon: Settings
        },
        {
          href: "/help",
          label: "Como usar",
          icon: HelpCircle
        },
        {
          href: "/pricing",
          label: "Planos e Preços",
          icon: Calculator
        },
        {
          href: "/cards",
          label: "Cards",
          icon: CreditCard
        }
      ]
    }
  ];
}
