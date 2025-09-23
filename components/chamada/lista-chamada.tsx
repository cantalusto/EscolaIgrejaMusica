"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Check, X, User, Clock } from "lucide-react"
import type { Aluno, Presenca } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function ListaChamada() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [presencas, setPresencas] = useState<Presenca[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split("T")[0])
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
    }
  }

  const carregarPresencas = async (data: string) => {
    try {
      const response = await fetch(`/api/presencas?data=${data}`)
      if (response.ok) {
        const presencasData = await response.json()
        setPresencas(presencasData)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar presenças",
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

  const marcarPresenca = async (alunoId: string, presente: boolean) => {
    setSalvando(true)
    try {
      const response = await fetch("/api/presencas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alunoId,
          presente,
          data: dataSelecionada,
        }),
      })

      if (response.ok) {
        await carregarPresencas(dataSelecionada)
        toast({
          title: "Sucesso",
          description: `Presença ${presente ? "marcada" : "desmarcada"} com sucesso`,
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao registrar presença",
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
      setSalvando(false)
    }
  }

  const obterStatusPresenca = (alunoId: string) => {
    const presenca = presencas.find((p) => p.alunoId === alunoId)
    return presenca?.presente || false
  }

  const jaTemPresenca = (alunoId: string) => {
    return presencas.some((p) => p.alunoId === alunoId)
  }

  const handleDataChange = (novaData: string) => {
    setDataSelecionada(novaData)
    carregarPresencas(novaData)
  }

  const marcarTodosPresentes = async () => {
    setSalvando(true)
    try {
      const promises = alunos.map((aluno) => marcarPresenca(aluno.id, true))
      await Promise.all(promises)
      toast({
        title: "Sucesso",
        description: "Todos os alunos foram marcados como presentes",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao marcar todos como presentes",
        variant: "destructive",
      })
    } finally {
      setSalvando(false)
    }
  }

  const limparChamada = async () => {
    if (!confirm("Tem certeza que deseja limpar toda a chamada desta data?")) {
      return
    }

    setSalvando(true)
    try {
      const promises = alunos.map((aluno) => marcarPresenca(aluno.id, false))
      await Promise.all(promises)
      toast({
        title: "Sucesso",
        description: "Chamada limpa com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao limpar chamada",
        variant: "destructive",
      })
    } finally {
      setSalvando(false)
    }
  }

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      await carregarAlunos()
      await carregarPresencas(dataSelecionada)
      setLoading(false)
    }
    carregarDados()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando dados...</div>
      </div>
    )
  }

  const alunosPresentes = presencas.filter((p) => p.presente).length
  const totalAlunos = alunos.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Sistema de Chamada</h2>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {alunosPresentes}/{totalAlunos} presentes
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Controle de Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="space-y-2">
              <Label htmlFor="data">Data da Aula</Label>
              <Input
                id="data"
                type="date"
                value={dataSelecionada}
                onChange={(e) => handleDataChange(e.target.value)}
                className="w-auto"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={marcarTodosPresentes} disabled={salvando} variant="default">
                <Check className="h-4 w-4 mr-2" />
                Marcar Todos
              </Button>
              <Button onClick={limparChamada} disabled={salvando} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Limpar Chamada
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alunos.map((aluno) => {
          const presente = obterStatusPresenca(aluno.id)
          const temPresenca = jaTemPresenca(aluno.id)

          return (
            <Card
              key={aluno.id}
              className={`relative ${presente ? "border-green-500" : temPresenca ? "border-red-500" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{aluno.nome}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`presenca-${aluno.id}`}
                      checked={presente}
                      onCheckedChange={(checked) => marcarPresenca(aluno.id, checked as boolean)}
                      disabled={salvando}
                    />
                    <Label htmlFor={`presenca-${aluno.id}`} className="text-sm font-medium">
                      Presente
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Idade:</span>
                    <Badge variant="secondary">{aluno.idade} anos</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Instrumento:</span>
                    <Badge variant="outline">{aluno.instrumento?.nome || "N/A"}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={presente ? "default" : temPresenca ? "destructive" : "secondary"}>
                      {presente ? "Presente" : temPresenca ? "Ausente" : "Não marcado"}
                    </Badge>
                  </div>

                  {temPresenca && (
                    <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Registrado em {new Date(dataSelecionada).toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {alunos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <p className="text-lg mb-2">Nenhum aluno cadastrado</p>
              <p className="text-sm">Cadastre alunos primeiro para fazer a chamada</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
