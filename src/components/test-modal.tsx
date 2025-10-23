"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TestModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TestModal({ isOpen, onClose }: TestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal de Teste</DialogTitle>
          <DialogDescription>
            Este é um modal de teste para verificar se os componentes estão funcionando corretamente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p>Este é um modal de teste simples.</p>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Fechar
          </Button>
          <Button 
            type="button"
            onClick={() => alert("Botão clicado!")}
          >
            Testar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
