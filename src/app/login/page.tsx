"use client";

import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  Copy,
  Check
} from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Usuários de demonstração
const demoUsers = [
  {
    email: "admin@condely.com",
    password: "123456",
    role: "ADMIN",
    name: "Admin Sistema",
    description: "Acesso total ao sistema"
  },
  {
    email: "manager@condely.com", 
    password: "123456",
    role: "MANAGER",
    name: "João Silva",
    description: "Síndico do condomínio"
  },
  {
    email: "employee@condely.com",
    password: "123456", 
    role: "EMPLOYEE",
    name: "Maria Santos",
    description: "Funcionária do condomínio"
  },
  {
    email: "resident1@condely.com",
    password: "123456",
    role: "RESIDENT", 
    name: "Carlos Oliveira",
    description: "Morador do condomínio"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedField, setCopiedField] = useState<"email" | "password" | null>(null);

  // Função para preencher automaticamente com dados do admin
  const fillDemoCredentials = (userType: string = "admin") => {
    const user = demoUsers.find(u => u.role.toLowerCase() === userType.toLowerCase()) || demoUsers[0];
    setFormData(prev => ({
      ...prev,
      email: user.email,
      password: user.password
    }));
    setError("");
  };

  // Função para copiar credenciais
  const copyToClipboard = (text: string, field: "email" | "password") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Função para lidar com mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(""); // Limpar erro ao digitar
  };

  // Função para validar email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Função para lidar com o login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validações
    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Por favor, insira um email válido");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔄 Attempting login with:", formData.email);
      
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log("🔄 Login result:", result);
      console.log("🔄 Result type:", typeof result);
      console.log("🔄 Result keys:", result ? Object.keys(result) : "No keys");

      if (result?.error) {
        console.log("❌ Login error:", result.error);
        setError("Email ou senha incorretos");
      } else if (result?.ok) {
        console.log("✅ Login successful, redirecting to dashboard");
        setSuccess("Login realizado com sucesso!");
        toast.success("Bem-vindo ao sistema!");
        
        // Usar window.location para força a navegação
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } else {
        console.log("⚠️ Login result unclear:", result);
        // Vamos tentar redirecionar mesmo assim se não houve erro
        if (!result || typeof result === 'undefined') {
          console.log("🤔 Result is undefined, trying to redirect anyway");
          setSuccess("Login realizado com sucesso!");
          toast.success("Bem-vindo ao sistema!");
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 500);
        } else {
          setError("Erro inesperado. Tente novamente.");
        }
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para login rápido por tipo de usuário
  const handleQuickLogin = async (userType: string) => {
    const user = demoUsers.find(u => u.role.toLowerCase() === userType.toLowerCase());
    if (!user) return;

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      console.log("🔄 Quick login result:", result);

      if (result?.error) {
        console.log("❌ Quick login error:", result.error);
        toast.error("Erro ao fazer login");
      } else if (result?.ok) {
        console.log("✅ Quick login successful, redirecting to dashboard");
        toast.success(`Login realizado como ${user.name}!`);
        
        // Usar window.location para força a navegação
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } else {
        console.log("⚠️ Quick login result unclear:", result);
        toast.error("Erro inesperado. Tente novamente.");
      }
    } catch (error) {
      console.error("Error during quick login:", error);
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

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

            {/* Demo Users Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Usuários Demo Disponíveis</h3>
              <div className="space-y-3">
                {demoUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </div>
                ))}
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
              {/* Demo Credentials Card */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Credenciais Demo</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Teste</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded px-3 py-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="ml-2 font-mono text-blue-600 dark:text-blue-400">{demoUsers[0].email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(demoUsers[0].email, "email")}
                      className="h-6 w-6 p-0"
                    >
                      {copiedField === "email" ? 
                        <Check className="h-3 w-3 text-green-600" /> : 
                        <Copy className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded px-3 py-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Senha:</span>
                      <span className="ml-2 font-mono text-blue-600 dark:text-blue-400">{demoUsers[0].password}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(demoUsers[0].password, "password")}
                      className="h-6 w-6 p-0"
                    >
                      {copiedField === "password" ? 
                        <Check className="h-3 w-3 text-green-600" /> : 
                        <Copy className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials("admin")}
                  className="w-full mt-3 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                >
                  Preencher automaticamente
                </Button>
              </div>

              {/* Mensagens de erro e sucesso */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-200">{success}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background disabled:opacity-50"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background disabled:opacity-50"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="rounded border-border"
                      disabled={isLoading}
                    />
                    <span className="text-sm">Lembrar de mim</span>
                  </label>
                </div>

                <Button 
                  type="submit"
                  className="w-full py-3" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Login rápido</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  type="button"
                  onClick={() => handleQuickLogin("manager")}
                >
                  <Building2 className="mr-2 h-3 w-3" />
                  Síndico
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                  type="button"
                  onClick={() => handleQuickLogin("resident")}
                >
                  <User className="mr-2 h-3 w-3" />
                  Morador
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>© 2024 Sistema de Condomínio. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
