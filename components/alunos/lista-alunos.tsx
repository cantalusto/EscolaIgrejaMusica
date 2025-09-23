"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, User } from "lucide-react"
import type { Aluno } from "@/lib/types"
import { FormAluno } from "./form-aluno"
import { useToast } from "@/hooks/use-toast"

export function ListaAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<Aluno | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const { toast } = useToast()

  const carregarAlunos = async () => {
    try {
      const response = await fetch("/api/alunos")
      if (response.ok) {
        const data = await response.json()
        setAlunos(data)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar alunos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const excluirAluno = async (id: string) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este aluno? Todos os dados de presença e pagamento também serão excluídos.",
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/alunos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Aluno excluído com sucesso",
        })
        carregarAlunos()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao excluir aluno",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive",
      })
    }
  }

  const handleSalvar = () => {
    carregarAlunos()
    setMostrarForm(false)
    setEditando(null)
  }

  const handleCancelar = () => {
    setMostrarForm(false)
    setEditando(null)
  }

  useEffect(() => {
    carregarAlunos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando alunos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Gerenciar Alunos</h2>
        <Button onClick={() => setMostrarForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Cadastrar Aluno
        </Button>
      </div>

      {(mostrarForm || editando) && (
        <Card>
          <CardHeader>
            <CardTitle>{editando ? "Editar Aluno" : "Novo Aluno"}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormAluno aluno={editando} onSalvar={handleSalvar} onCancelar={handleCancelar} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alunos.map((aluno) => (
          <Card key={aluno.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{aluno.nome}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditando(aluno)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => excluirAluno(aluno.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Idade:</span>
                  <Badge variant="secondary">{aluno.idade} anos</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Instrumento:</span>
                  <Badge variant="outline">{aluno.instrumento?.nome || "N/A"}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pagamento:</span>
                  <Badge variant={aluno.statusPagamento ? "default" : "destructive"}>
                    {aluno.statusPagamento ? "Em dia" : "Pendente"}
                  </Badge>
                </div>

                {aluno._count && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Presenças:</span>
                    <Badge variant="secondary">{aluno._count.presencas || 0}</Badge>
                  </div>
                )}

                <div className="pt-2 text-xs text-muted-foreground">
                  Cadastrado em: {new Date(aluno.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alunos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <p className="text-lg mb-2">Nenhum aluno cadastrado</p>
              <p className="text-sm">Clique em "Cadastrar Aluno" para começar</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
