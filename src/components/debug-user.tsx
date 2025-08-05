"use client"

import { useCurrentUser } from "@/hooks/use-current-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getRoleLabel } from "@/lib/types/user"
import { User, Shield, X, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"

export function DebugUser() {
  const { user, permissions, loading } = useCurrentUser()
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV === 'production') return null

  // Checar se deve ser visível (Ctrl + D para toggle)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault()
        setIsVisible(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsVisible(true)}
          className="bg-orange-500 text-white border-orange-600 hover:bg-orange-600"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsMinimized(false)}
          className="bg-orange-500 text-white border-orange-600 hover:bg-orange-600"
        >
          <User className="h-4 w-4 mr-2" />
          {user?.name?.split(' ')[0] || 'Debug'}
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-background/95 backdrop-blur border-2 border-orange-500 dark:border-orange-400">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <User className="h-4 w-4" />
          Debug - Usuário Atual
          <Badge variant="outline" className="ml-auto text-xs">
            ID: {user?.id || "?"}
          </Badge>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/20"
            >
              <EyeOff className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-xs text-muted-foreground">Carregando...</p>
        ) : user ? (
          <>
            <div>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <Badge variant="secondary" className="text-xs">
                {getRoleLabel(user.role)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {user.role}
              </Badge>
            </div>
            {permissions && (
              <div className="text-xs">
                <p className="font-medium mb-2 text-foreground">Permissões Ativas:</p>
                <div className="space-y-1">
                  {permissions.canViewDashboard && (
                    <div className="text-green-600 dark:text-green-400">✓ Dashboard</div>
                  )}
                  {permissions.canManageUsers && (
                    <div className="text-green-600 dark:text-green-400">✓ Usuários</div>
                  )}
                  {permissions.canManageCondominiums && (
                    <div className="text-green-600 dark:text-green-400">✓ Condomínios</div>
                  )}
                  {permissions.canManageFinancials && (
                    <div className="text-green-600 dark:text-green-400">✓ Financeiro</div>
                  )}
                  {permissions.canManageApartments && (
                    <div className="text-green-600 dark:text-green-400">✓ Apartamentos</div>
                  )}
                  {permissions.canManageResidents && (
                    <div className="text-green-600 dark:text-green-400">✓ Moradores</div>
                  )}
                  {permissions.canManageEmployees && (
                    <div className="text-green-600 dark:text-green-400">✓ Funcionários</div>
                  )}
                  {permissions.canManageReservations && (
                    <div className="text-green-600 dark:text-green-400">✓ Reservas</div>
                  )}
                  {permissions.canManageTickets && (
                    <div className="text-green-600 dark:text-green-400">✓ Chamados</div>
                  )}
                  {permissions.canViewReports && (
                    <div className="text-green-600 dark:text-green-400">✓ Relatórios</div>
                  )}
                </div>
              </div>
            )}
            <div className="text-xs text-orange-600 dark:text-orange-400 border-t border-orange-200 dark:border-orange-800 pt-2">
              <strong>Dica:</strong> Ctrl+D para ocultar/mostrar
            </div>
          </>
        ) : (
          <p className="text-xs text-red-600 dark:text-red-400">Nenhum usuário logado</p>
        )}
      </CardContent>
    </Card>
  )
}
