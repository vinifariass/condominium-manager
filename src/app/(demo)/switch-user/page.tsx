"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { setCurrentUser } from "@/lib/actions/user-actions"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getRoleLabel } from "@/lib/types/user"
import { Users, Shield, RefreshCw } from "lucide-react"
import { toast } from "sonner"

const availableUsers = [
  {
    id: "1",
    name: "Administrador Sistema",
    email: "admin@sistema.com",
    role: "admin" as const,
    description: "Acesso total ao sistema - Pode gerenciar condomínios, usuários, relatórios"
  },
  {
    id: "2", 
    name: "João Silva",
    email: "joao.silva@email.com", 
    role: "manager" as const,
    description: "Síndico - Pode gerenciar operações do condomínio, mas não criar novos condomínios"
  },
  {
    id: "3",
    name: "Maria Santos", 
    email: "maria.santos@email.com",
    role: "employee" as const, 
    description: "Funcionário - Pode gerenciar reservas, chamados e manutenção"
  }
]

export default function UserSwitchPage() {
  const { user, refreshUser } = useCurrentUser()
  const [switching, setSwitching] = useState<string | null>(null)

  const handleSwitchUser = async (userId: string) => {
    setSwitching(userId)
    try {
      const result = await setCurrentUser(userId)
      if (result.success) {
        await refreshUser()
        toast.success(`Logado como ${result.data?.name}`)
      } else {
        toast.error("Erro ao trocar usuário")
      }
    } catch (error) {
      toast.error("Erro ao trocar usuário")
    } finally {
      setSwitching(null)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "employee":
        return "bg-green-100 text-green-800 border-green-200"
      case "resident":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <ContentLayout title="Trocar Usuário">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Trocar Usuário</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trocar Usuário</h1>
          <p className="text-muted-foreground">
            Simule diferentes tipos de usuário para testar as permissões do sistema
          </p>
        </div>

        {/* Usuário Atual */}
        {user && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Usuário Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Usuários Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableUsers.map((availableUser) => (
            <Card 
              key={availableUser.id} 
              className={`hover:shadow-md transition-shadow ${
                user?.id === availableUser.id ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {availableUser.name}
                  </div>
                  <Badge className={getRoleColor(availableUser.role)}>
                    {getRoleLabel(availableUser.role)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{availableUser.email}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {availableUser.description}
                  </p>
                </div>
                
                <Button
                  onClick={() => handleSwitchUser(availableUser.id)}
                  disabled={switching === availableUser.id || user?.id === availableUser.id}
                  className="w-full"
                  variant={user?.id === availableUser.id ? "secondary" : "default"}
                >
                  {switching === availableUser.id && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {user?.id === availableUser.id ? "Usuário Atual" : "Trocar para este usuário"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Como funciona</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Esta página permite simular diferentes tipos de usuário para testar as permissões.
                  Cada tipo de usuário tem acesso a diferentes funcionalidades do sistema:
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• <strong>Administrador:</strong> Acesso total - gerencia condomínios, usuários, relatórios</li>
                  <li>• <strong>Síndico:</strong> Gerencia operações do condomínio, mas não cria novos condomínios</li>
                  <li>• <strong>Funcionário:</strong> Gerencia reservas, chamados e manutenção</li>
                  <li>• <strong>Morador:</strong> Apenas reservas e chamados próprios</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}
