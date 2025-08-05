"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCondominiumInput } from "@/lib/types/condominium"
import { useCondominiumActions } from "@/hooks/use-condominium-actions"

interface CreateCondominiumModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateCondominiumModal({ isOpen, onClose, onSuccess }: CreateCondominiumModalProps) {
  const { handleCreateCondominium, loading } = useCondominiumActions()
  
  // Fix para garantir que o body sempre tenha pointer-events: auto
  useEffect(() => {
    if (isOpen) {
      document.body.style.pointerEvents = "auto"
    }
    return () => {
      document.body.style.pointerEvents = "auto"
    }
  }, [isOpen])
  
  const [formData, setFormData] = useState<CreateCondominiumInput>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    cnpj: "",
    totalUnits: 0,
    totalBlocks: 0,
    manager: "",
    status: "active"
  })

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      cnpj: "",
      totalUnits: 0,
      totalBlocks: 0,
      manager: "",
      status: "active"
    })
  }

  const handleInputChange = (field: keyof CreateCondominiumInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await handleCreateCondominium(formData)
    
    if (result.success) {
      resetForm()
      onClose()
      onSuccess()
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Criar Novo Condomínio</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo condomínio.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nome do condomínio"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleInputChange("cnpj", e.target.value)}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Endereço completo"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Cidade"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="UF"
                maxLength={2}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                placeholder="00000-000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalUnits">Total de Unidades *</Label>
              <Input
                id="totalUnits"
                type="number"
                min="1"
                value={formData.totalUnits}
                onChange={(e) => handleInputChange("totalUnits", parseInt(e.target.value) || 0)}
                placeholder="Ex: 50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalBlocks">Total de Blocos *</Label>
              <Input
                id="totalBlocks"
                type="number"
                min="1"
                value={formData.totalBlocks}
                onChange={(e) => handleInputChange("totalBlocks", parseInt(e.target.value) || 0)}
                placeholder="Ex: 5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manager">Síndico</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                placeholder="Nome do síndico"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar Condomínio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
