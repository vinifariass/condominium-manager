"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Condominium } from "@/lib/types/condominium"
import { Building, MapPin, Phone, Mail, Users, Hash, User, Calendar } from "lucide-react"

interface ViewCondominiumModalProps {
  isOpen: boolean
  onClose: () => void
  condominium: Condominium | null
}

export function ViewCondominiumModal({ isOpen, onClose, condominium }: ViewCondominiumModalProps) {
  if (!condominium) return null

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {condominium.name}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do condomínio
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={getStatusColor(condominium.status)}>
              {getStatusLabel(condominium.status)}
            </Badge>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Nome</span>
                  <p className="text-sm">{condominium.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">CNPJ</span>
                  <p className="text-sm">{condominium.cnpj || "Não informado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Endereço</span>
                <p className="text-sm">{condominium.address}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Cidade</span>
                  <p className="text-sm">{condominium.city}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Estado</span>
                  <p className="text-sm">{condominium.state}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">CEP</span>
                  <p className="text-sm">{condominium.zipCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Telefone</span>
                    <p className="text-sm">{condominium.phone || "Não informado"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-500">E-mail</span>
                    <p className="text-sm">{condominium.email || "Não informado"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Informações do Empreendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total de Unidades</span>
                    <p className="text-sm font-semibold">{condominium.totalUnits}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total de Blocos</span>
                    <p className="text-sm font-semibold">{condominium.totalBlocks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-500">Síndico</span>
                    <p className="text-sm">{condominium.manager || "Não informado"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Datas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Criado em</span>
                  <p className="text-sm">{new Date(condominium.createdAt).toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Última atualização</span>
                  <p className="text-sm">{new Date(condominium.updatedAt).toLocaleString("pt-BR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
