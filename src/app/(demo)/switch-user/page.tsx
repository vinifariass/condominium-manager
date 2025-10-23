"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { AlertTriangle, Settings } from "lucide-react"

export default function UserSwitchPage() {
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

        {/* Manutenção */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Settings className="h-5 w-5" />
              Recurso em Manutenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Sistema de troca de usuário temporariamente indisponível</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Este recurso está sendo migrado para funcionar com NextAuth. Em breve estará disponível novamente.
                </p>
                <div className="mt-4">
                  <p className="text-sm text-yellow-700">
                    <strong>Para testar diferentes usuários no momento:</strong>
                  </p>
                  <ol className="text-sm text-yellow-700 mt-2 space-y-1 list-decimal list-inside">
                    <li>Faça logout da aplicação</li>
                    <li>Use uma das contas criadas durante o setup:</li>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li><strong>Admin:</strong> admin@condely.com</li>
                      <li><strong>Manager:</strong> manager@condely.com</li>
                      <li><strong>Employee:</strong> employee@condely.com</li>
                      <li><strong>Resident:</strong> resident1@condely.com</li>
                    </ul>
                    <li>Senha para todas as contas: <code className="bg-yellow-200 px-1 rounded">123456</code></li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}
