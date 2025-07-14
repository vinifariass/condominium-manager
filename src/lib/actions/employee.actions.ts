"use server";

// Interfaces para tipagem - preparado para backend/Prisma
export interface EmployeeData {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'Ativo' | 'Inativo' | 'Férias' | 'Licença';
  hireDate: string;
  salary: number;
  condominiumId?: number;
  condominium?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Filtros interface - preparado para backend
export interface EmployeeFilters {
  search?: string;
  role?: string[];
  department?: string[];
  status?: string[];
  condominiumId?: number[];
  hireDate?: {
    start?: string;
    end?: string;
  };
  salaryRange?: {
    min?: number;
    max?: number;
  };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Constantes para filtros - futuramente virão do banco de dados
export const EMPLOYEE_FILTER_OPTIONS = {
  roles: [
    "Síndico",
    "Administrador",
    "Porteiro",
    "Zelador",
    "Técnico de Manutenção",
    "Segurança",
    "Limpeza",
    "Jardineiro",
    "Supervisor"
  ],
  departments: [
    "Administração",
    "Manutenção",
    "Segurança",
    "Limpeza",
    "Portaria",
    "Jardinagem",
    "Técnico"
  ],
  status: ["Ativo", "Inativo", "Férias", "Licença"]
};

// Dados mockados - futuramente substituído por consultas ao Prisma
const MOCK_EMPLOYEES: EmployeeData[] = [
  {
    id: 1,
    name: "Paulo Santos",
    email: "paulo.santos@email.com",
    phone: "(21) 99999-1111",
    role: "Técnico de Manutenção",
    department: "Manutenção",
    status: "Ativo",
    hireDate: "2023-01-15",
    salary: 3500.00,
    condominiumId: 1,
    condominium: "Condomínio Santos Dumont",
    createdAt: "2023-01-15T08:00:00",
    updatedAt: "2024-01-15T08:00:00"
  },
  {
    id: 2,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(21) 99999-2222",
    role: "Administrador",
    department: "Administração",
    status: "Ativo",
    hireDate: "2022-06-10",
    salary: 5000.00,
    condominiumId: 1,
    condominium: "Condomínio Santos Dumont",
    createdAt: "2022-06-10T08:00:00",
    updatedAt: "2024-01-15T08:00:00"
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro.oliveira@email.com",
    phone: "(21) 99999-3333",
    role: "Porteiro",
    department: "Portaria",
    status: "Ativo",
    hireDate: "2023-03-20",
    salary: 2800.00,
    condominiumId: 2,
    condominium: "Condomínio Griffe",
    createdAt: "2023-03-20T08:00:00",
    updatedAt: "2024-01-15T08:00:00"
  },
  {
    id: 4,
    name: "Ana Paula Griffe",
    email: "ana.griffe@email.com",
    phone: "(21) 99999-4444",
    role: "Síndico",
    department: "Administração",
    status: "Ativo",
    hireDate: "2021-08-05",
    salary: 6000.00,
    condominiumId: 2,
    condominium: "Condomínio Griffe",
    createdAt: "2021-08-05T08:00:00",
    updatedAt: "2024-01-15T08:00:00"
  },
  {
    id: 5,
    name: "José Ferreira",
    email: "jose.ferreira@email.com",
    phone: "(21) 99999-5555",
    role: "Zelador",
    department: "Limpeza",
    status: "Férias",
    hireDate: "2022-11-12",
    salary: 2500.00,
    condominiumId: 3,
    condominium: "Condomínio Artagus",
    createdAt: "2022-11-12T08:00:00",
    updatedAt: "2024-01-15T08:00:00"
  }
];

// Função para buscar funcionários com filtros - preparada para Prisma
export async function getEmployees(filters: EmployeeFilters = {}): Promise<{
  employees: EmployeeData[];
  totalCount: number;
  totalPages: number;
}> {
  try {
    // TODO: Substituir por consulta ao Prisma
    // const employees = await prisma.employee.findMany({
    //   where: buildWhereClause(filters),
    //   include: { condominium: true },
    //   orderBy: {
    //     [filters.sortBy || 'name']: filters.sortOrder || 'asc'
    //   },
    //   skip: filters.page ? (filters.page - 1) * (filters.limit || 10) : 0,
    //   take: filters.limit || 10
    // });

    let filteredEmployees = [...MOCK_EMPLOYEES];

    // Filtro de pesquisa por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.name.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.role.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower) ||
        (employee.condominium && employee.condominium.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por cargo
    if (filters.role && filters.role.length > 0) {
      filteredEmployees = filteredEmployees.filter(employee =>
        filters.role!.includes(employee.role)
      );
    }

    // Filtro por departamento
    if (filters.department && filters.department.length > 0) {
      filteredEmployees = filteredEmployees.filter(employee =>
        filters.department!.includes(employee.department)
      );
    }

    // Filtro por status
    if (filters.status && filters.status.length > 0) {
      filteredEmployees = filteredEmployees.filter(employee =>
        filters.status!.includes(employee.status)
      );
    }

    // Filtro por condomínio
    if (filters.condominiumId && filters.condominiumId.length > 0) {
      filteredEmployees = filteredEmployees.filter(employee =>
        employee.condominiumId && filters.condominiumId!.includes(employee.condominiumId)
      );
    }

    // Filtro por data de contratação
    if (filters.hireDate?.start || filters.hireDate?.end) {
      filteredEmployees = filteredEmployees.filter(employee => {
        const hireDate = new Date(employee.hireDate);
        if (filters.hireDate?.start && hireDate < new Date(filters.hireDate.start)) {
          return false;
        }
        if (filters.hireDate?.end && hireDate > new Date(filters.hireDate.end)) {
          return false;
        }
        return true;
      });
    }

    // Filtro por faixa salarial
    if (filters.salaryRange?.min !== undefined || filters.salaryRange?.max !== undefined) {
      filteredEmployees = filteredEmployees.filter(employee => {
        if (filters.salaryRange?.min !== undefined && employee.salary < filters.salaryRange.min) {
          return false;
        }
        if (filters.salaryRange?.max !== undefined && employee.salary > filters.salaryRange.max) {
          return false;
        }
        return true;
      });
    }

    // Ordenação
    const sortBy = filters.sortBy || 'name';
    const sortOrder = filters.sortOrder || 'asc';
    
    filteredEmployees.sort((a, b) => {
      let aValue: any = a[sortBy as keyof EmployeeData];
      let bValue: any = b[sortBy as keyof EmployeeData];
      
      if (sortBy === 'hireDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Paginação
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const totalCount = filteredEmployees.length;
    const totalPages = Math.ceil(totalCount / limit);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    return {
      employees: paginatedEmployees,
      totalCount,
      totalPages
    };
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    throw new Error('Falha ao buscar funcionários');
  }
}

// Função para buscar um funcionário por ID - preparada para Prisma
export async function getEmployeeById(id: number): Promise<EmployeeData | null> {
  try {
    // TODO: Substituir por consulta ao Prisma
    const employee = MOCK_EMPLOYEES.find(e => e.id === id);
    return employee || null;
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    throw new Error('Falha ao buscar funcionário');
  }
}

// Função para criar um novo funcionário - preparada para Prisma
export async function createEmployee(employeeData: Omit<EmployeeData, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmployeeData> {
  try {
    // TODO: Substituir por inserção no Prisma
    const newEmployee: EmployeeData = {
      ...employeeData,
      id: Math.max(...MOCK_EMPLOYEES.map(e => e.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MOCK_EMPLOYEES.push(newEmployee);
    return newEmployee;
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    throw new Error('Falha ao criar funcionário');
  }
}

// Função para atualizar um funcionário - preparada para Prisma
export async function updateEmployee(id: number, employeeData: Partial<EmployeeData>): Promise<EmployeeData | null> {
  try {
    // TODO: Substituir por atualização no Prisma
    const employeeIndex = MOCK_EMPLOYEES.findIndex(e => e.id === id);
    if (employeeIndex === -1) return null;

    MOCK_EMPLOYEES[employeeIndex] = {
      ...MOCK_EMPLOYEES[employeeIndex],
      ...employeeData,
      updatedAt: new Date().toISOString()
    };

    return MOCK_EMPLOYEES[employeeIndex];
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    throw new Error('Falha ao atualizar funcionário');
  }
}

// Função para deletar um funcionário - preparada para Prisma
export async function deleteEmployee(id: number): Promise<boolean> {
  try {
    // TODO: Substituir por deleção no Prisma
    const employeeIndex = MOCK_EMPLOYEES.findIndex(e => e.id === id);
    if (employeeIndex === -1) return false;

    MOCK_EMPLOYEES.splice(employeeIndex, 1);
    return true;
  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);
    throw new Error('Falha ao deletar funcionário');
  }
}

// Função para obter estatísticas dos funcionários - preparada para Prisma
export async function getEmployeeStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  onVacation: number;
  averageSalary: number;
  totalSalary: number;
}> {
  try {
    // TODO: Substituir por agregações do Prisma
    const total = MOCK_EMPLOYEES.length;
    const active = MOCK_EMPLOYEES.filter(e => e.status === 'Ativo').length;
    const inactive = MOCK_EMPLOYEES.filter(e => e.status === 'Inativo').length;
    const onVacation = MOCK_EMPLOYEES.filter(e => e.status === 'Férias').length;
    const totalSalary = MOCK_EMPLOYEES.reduce((sum, employee) => sum + employee.salary, 0);
    const averageSalary = total > 0 ? totalSalary / total : 0;

    return {
      total,
      active,
      inactive,
      onVacation,
      averageSalary,
      totalSalary
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas de funcionários:', error);
    throw new Error('Falha ao buscar estatísticas de funcionários');
  }
}

// Função para obter opções de filtro dinâmicas - preparada para Prisma
export async function getEmployeeFilterOptions(): Promise<typeof EMPLOYEE_FILTER_OPTIONS> {
  try {
    // TODO: Buscar opções dinâmicas do banco de dados
    return EMPLOYEE_FILTER_OPTIONS;
  } catch (error) {
    console.error('Erro ao buscar opções de filtro:', error);
    return EMPLOYEE_FILTER_OPTIONS;
  }
}
