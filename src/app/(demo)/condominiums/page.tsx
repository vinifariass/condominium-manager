"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { CreateCondominiumModal } from "@/components/create-condominium-modal"
import { EditCondominiumModal } from "@/components/edit-condominium-modal"
import { ViewCondominiumModal } from "@/components/view-condominium-modal"
import { TestModal } from "@/components/test-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { PermissionGuard } from "@/components/permission-guard"
import { Condominium } from "@/lib/types/condominium"
// import { getCondominiums } from "@/lib/data/condominiums" // Removido - agora usa API
import { useCondominiumActions } from "@/hooks/use-condominium-actions"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Building, MapPin, Users, Phone } from "lucide-react"

function CondominiumsPageContent() {
  const [condominiums, setCondominiums] = useState<Condominium[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [selectedCondominium, setSelectedCondominium] = useState<Condominium | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { handleDeleteCondominium, loading: actionLoading } = useCondominiumActions()

  const loadCondominiums = async () => {
    try {
      console.log("Debug: Iniciando carregamento de condomínios...")
      setIsLoading(true)
      
      const response = await fetch('/api/condominiums')
      if (!response.ok) {
        throw new Error('Failed to fetch condominiums')
      }
      
      const result = await response.json()
      const data = result.data || []
      
      console.log("Debug: Dados recebidos:", data)
      console.log("Debug: Quantidade de condomínios:", data?.length)
      setCondominiums(data)
    } catch (error) {
      console.error("Error loading condominiums:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCondominiums()
  }, [])

  const filteredCondominiums = condominiums.filter(condominium =>
    condominium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condominium.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (condominium.city && condominium.city.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleCreateSuccess = () => {
    loadCondominiums()
  }

  const handleEditSuccess = () => {
    loadCondominiums()
  }

  const handleViewCondominium = (condominium: Condominium) => {
    setSelectedCondominium(condominium)
    setIsViewModalOpen(true)
  }

  const handleEditCondominium = (condominium: Condominium) => {
    setSelectedCondominium(condominium)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (condominium: Condominium) => {
    setSelectedCondominium(condominium)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedCondominium) {
      const result = await handleDeleteCondominium(selectedCondominium.id)
      if (result.success) {
        setIsDeleteDialogOpen(false)
        setSelectedCondominium(null)
        loadCondominiums()
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "inactive":
        return "Inativo"
      case "maintenance":
        return "Em Manutenção"
      default:
        return status
    }
  }

  return (
    <ContentLayout title="Condomínios">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Condomínios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Condomínios</h1>
            <p className="text-muted-foreground">
              Gerencie todos os condomínios do sistema
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Condomínio
          </Button>
          <Button onClick={() => setIsTestModalOpen(true)} variant="secondary">
            Testar Modal
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar condomínios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCondominiums.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum condomínio encontrado</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? 
                  "Não encontramos condomínios com os termos de busca." :
                  "Comece criando seu primeiro condomínio."
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Condomínio
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCondominiums.map((condominium) => (
              <Card key={condominium.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-1">{condominium.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="line-clamp-1">{condominium.city}, {condominium.state}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(condominium.status)}>
                      {getStatusLabel(condominium.status)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-50">
                        <DropdownMenuItem onClick={() => handleViewCondominium(condominium)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCondominium(condominium)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(condominium)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-2" />
                    <span className="line-clamp-1">{condominium.address}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>{condominium.totalUnits} unidades</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span>{condominium.totalBlocks} blocos</span>
                    </div>
                  </div>
                  
                  {condominium.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 mr-2" />
                      <span>{condominium.phone}</span>
                    </div>
                  )}

                  {condominium.manager && (
                    <div className="text-sm">
                      <span className="font-medium">Síndico: </span>
                      <span className="text-muted-foreground">{condominium.manager}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateCondominiumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditCondominiumModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        condominium={selectedCondominium}
      />

      <ViewCondominiumModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        condominium={selectedCondominium}
      />

      <TestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o condomínio &quot;{selectedCondominium?.name}&quot;?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  )
}

export default function CondominiumsPage() {
  return (
    <PermissionGuard 
      permissions={["canManageCondominiums"]}
      fallback={
        <ContentLayout title="Acesso Negado">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para gerenciar condomínios.
            </p>
            <p className="text-sm text-muted-foreground">
              Entre em contato com o administrador do sistema para obter acesso.
            </p>
          </div>
        </ContentLayout>
      }
    >
      <CondominiumsPageContent />
    </PermissionGuard>
  )
}
