"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal } from "lucide-react";

export function TestModalInteractions() {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold">Teste de Interações de Modal</h3>
      
      <div className="flex gap-4 items-center">
        {/* Dropdown Menu de 3 pontinhos */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              Abrir Dialog
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAlertOpen(true)}>
              Abrir Alert
            </DropdownMenuItem>
            <DropdownMenuItem>
              Ação 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botões diretos para teste */}
        <Button onClick={() => setDialogOpen(true)}>
          Abrir Dialog Direto
        </Button>
        
        <Button variant="destructive" onClick={() => setAlertOpen(true)}>
          Abrir Alert Direto
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog de Teste</DialogTitle>
            <DialogDescription>
              Este é um dialog de teste. Você deve conseguir clicar em qualquer lugar após fechá-lo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alert de Teste</AlertDialogTitle>
            <AlertDialogDescription>
              Este é um alert de teste. Você deve conseguir clicar em qualquer lugar após fechá-lo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setAlertOpen(false)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="text-sm text-muted-foreground">
        Teste: Abra o dropdown dos 3 pontinhos, clique em uma opção para abrir um modal, 
        feche o modal e tente clicar nos botões novamente. Tudo deve funcionar normalmente.
      </div>
    </div>
  );
}
