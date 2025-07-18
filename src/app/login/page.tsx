import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  ArrowRight
} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Lado Esquerdo - Informações */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Sistema de Condomínio</h1>
                <p className="text-muted-foreground">Gestão completa e inteligente</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Gerencie seu condomínio com facilidade</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Controle de moradores e apartamentos</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Gestão financeira completa</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Sistema de reservas e chamados</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Comunicação eficiente com moradores</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Relatórios e dashboards em tempo real</span>
                </li>
              </ul>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="font-semibold">Nossos clientes</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-lg border">
                  <Avatar>
                    <AvatarFallback>CS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Carlos Silva</p>
                    <p className="text-xs text-muted-foreground">Síndico - Residencial Jardim das Flores</p>
                    <p className="text-sm mt-1">&ldquo;O sistema revolucionou nossa gestão!&rdquo;</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-lg border">
                  <Avatar>
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Ana Santos</p>
                    <p className="text-xs text-muted-foreground">Administradora - Portal do Sol</p>
                    <p className="text-sm mt-1">&ldquo;Interface intuitiva e muito completa.&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm">Lembrar de mim</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>

                <Button className="w-full py-3" size="lg" asChild>
                  <Link href="/dashboard" className="flex items-center justify-center">
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center justify-center py-3">
                  <Building2 className="mr-2 h-4 w-4" />
                  Síndico
                </Button>
                <Button variant="outline" className="flex items-center justify-center py-3">
                  <User className="mr-2 h-4 w-4" />
                  Morador
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Cadastre-se aqui
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>© 2024 Sistema de Condomínio. Todos os direitos reservados.</p>
            <div className="mt-2 space-x-4">
              <Link href="/privacy" className="hover:underline">Privacidade</Link>
              <Link href="/terms" className="hover:underline">Termos</Link>
              <Link href="/support" className="hover:underline">Suporte</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
