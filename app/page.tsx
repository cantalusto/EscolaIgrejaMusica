import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Users, Calendar, CreditCard } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Sistema de Gerenciamento</h1>
        <p className="text-xl text-muted-foreground mb-2">Escola de música Assembleia de Deus Seara</p>
        <p className="text-muted-foreground">
          Gerencie alunos, instrumentos, presenças e pagamentos de forma simples e eficiente
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Music className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Instrumentos</CardTitle>
            <CardDescription>Gerencie os instrumentos disponíveis e suas quantidades</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/instrumentos">
              <Button className="w-full">Gerenciar Instrumentos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Alunos</CardTitle>
            <CardDescription>Cadastre e gerencie os alunos da escola de música</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/alunos">
              <Button className="w-full">Gerenciar Alunos</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Chamada</CardTitle>
            <CardDescription>Controle a presença dos alunos nas aulas</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chamada">
              <Button className="w-full">Fazer Chamada</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Pagamentos</CardTitle>
            <CardDescription>Controle os pagamentos e mensalidades dos alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pagamentos">
              <Button className="w-full">Gerenciar Pagamentos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Sistema</CardTitle>
            <CardDescription>
              Use o menu acima para navegar entre as diferentes funcionalidades do sistema
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
