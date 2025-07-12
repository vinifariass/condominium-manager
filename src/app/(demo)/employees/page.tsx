import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  Phone,
  Mail,
  Calendar,
  Badge,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock
} from "lucide-react";

export default function EmployeesPage() {
  // Dados simulados - substituir por dados reais da API
  const employees = [
    {
      id: 1,
      name: "Carlos Santos",
      position: "Porteiro",
      department: "Segurança",
      shift: "Diurno (06:00 - 14:00)",
      phone: "(11) 98888-7777",
      email: "carlos.santos@email.com",
      cpf: "123.456.789-00",
      admissionDate: "2020-03-15",
      salary: 2500,
      status: "Ativo",
      address: "Rua das Flores, 123 - São Paulo",
      emergencyContact: {
        name: "Ana Santos",
        phone: "(11) 97777-6666",
        relationship: "Esposa"
      }
    },
    {
      id: 2,
      name: "Maria Oliveira",
      position: "Faxineira",
      department: "Limpeza",
      shift: "Matutino (07:00 - 15:00)",
      phone: "(11) 96666-5555",
      email: "maria.oliveira@email.com",
      cpf: "987.654.321-00",
      admissionDate: "2019-08-22",
      salary: 1800,
      status: "Ativo",
      address: "Av. Paulista, 456 - São Paulo",
      emergencyContact: {
        name: "José Oliveira",
        phone: "(11) 95555-4444",
        relationship: "Marido"
      }
    },
    {
      id: 3,
      name: "João Silva",
      position: "Zelador",
      department: "Manutenção",
      shift: "Integral (08:00 - 17:00)",
      phone: "(11) 94444-3333",
      email: "joao.silva@email.com",
      cpf: "456.789.123-00",
      admissionDate: "2021-01-10",
      salary: 3200,
      status: "Ativo",
      address: "Rua da Paz, 789 - São Paulo",
      emergencyContact: {
        name: "Carla Silva",
        phone: "(11) 93333-2222",
        relationship: "Irmã"
      }
    },
    {
      id: 4,
      name: "Ana Costa",
      position: "Administradora",
      department: "Administração",
      shift: "Comercial (08:00 - 18:00)",
      phone: "(11) 92222-1111",
      email: "ana.costa@email.com",
      cpf: "789.123.456-00",
      admissionDate: "2018-05-03",
      salary: 4500,
      status: "Ativo",
      address: "Rua dos Pinheiros, 321 - São Paulo",
      emergencyContact: {
        name: "Pedro Costa",
        phone: "(11) 91111-0000",
        relationship: "Pai"
      }
    },
    {
      id: 5,
      name: "Roberto Lima",
      position: "Porteiro",
      department: "Segurança",
      shift: "Noturno (22:00 - 06:00)",
      phone: "(11) 90000-9999",
      email: "roberto.lima@email.com",
      cpf: "321.654.987-00",
      admissionDate: "2022-09-15",
      salary: 2800,
      status: "Férias",
      address: "Av. Brasil, 654 - São Paulo",
      emergencyContact: {
        name: "Lucia Lima",
        phone: "(11) 89999-8888",
        relationship: "Mãe"
      }
    }
  ];

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === "Ativo").length,
    onVacation: employees.filter(emp => emp.status === "Férias").length,
    departments: Array.from(new Set(employees.map(emp => emp.department))).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Férias":
        return "bg-yellow-100 text-yellow-800";
      case "Licença":
        return "bg-blue-100 text-blue-800";
      case "Demitido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ContentLayout title="Funcionários">
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Todos os colaboradores
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Em atividade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Férias</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.onVacation}</div>
              <p className="text-xs text-muted-foreground">
                Ausentes temporariamente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
              <Badge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.departments}</div>
              <p className="text-xs text-muted-foreground">
                Áreas de atuação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Ações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Funcionários</CardTitle>
                <CardDescription>Gerencie todos os colaboradores do condomínio</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Funcionário
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar funcionários..."
                  className="pl-8 w-full p-2 border rounded-md"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{employee.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Badge className="h-3 w-3 mr-1" />
                          {employee.position} - {employee.department}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {employee.shift}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {employee.phone}
                        </span>
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {employee.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Admissão: {new Date(employee.admissionDate).toLocaleDateString('pt-BR')}</span>
                        <span>Salário: R$ {employee.salary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funcionários por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionários por Departamento</CardTitle>
            <CardDescription>Distribuição dos colaboradores por área</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(new Set(employees.map(emp => emp.department))).map((department) => {
                const deptEmployees = employees.filter(emp => emp.department === department);
                const activeCount = deptEmployees.filter(emp => emp.status === "Ativo").length;
                return (
                  <div key={department} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{department}</h4>
                      <p className="text-sm text-muted-foreground">
                        {deptEmployees.length} funcionário{deptEmployees.length !== 1 ? 's' : ''} total
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{activeCount} ativo{activeCount !== 1 ? 's' : ''}</p>
                      <p className="text-xs text-muted-foreground">
                        {deptEmployees.length - activeCount} ausente{(deptEmployees.length - activeCount) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
