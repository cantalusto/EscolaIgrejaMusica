"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, TrendingUp } from "lucide-react"
import type { Aluno, Presenca } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function HistoricoPresencas() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [presencas, setPresencas] = useState<Presenca[]>([])
  const [loading, setLoading] = useState(true)
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("todos")
  const [mesAno, setMesAno] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
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

  const carregarPresencas = async () => {
    try {
      const params = new URLSearchParams()
      if (alunoSelecionado !== "todos") {
        params.append("alunoId", alunoSelecionado)
      }

      const response = await fetch(`/api/presencas?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        // Filtrar por mês/ano se especificado
        const presencasFiltradas = data.filter((presenca: Presenca) => {
          if (!mesAno) return true
          const dataPresenca = new Date(presenca.data).toISOString().slice(0, 7)
          return dataPresenca === mesAno
        })
        setPresencas(presencasFiltradas)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar histórico",
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

  const calcularEstatisticas = (alunoId?: string) => {
    const presencasFiltradas = alunoId ? presencas.filter((p) => p.alunoId === alunoId) : presencas

    const totalAulas = presencasFiltradas.length
    const presentes = presencasFiltradas.filter((p) => p.presente).length
    const ausentes = totalAulas - presentes
    const percentualPresenca = totalAulas > 0 ? Math.round((presentes / totalAulas) * 100) : 0

    return { totalAulas, presentes, ausentes, percentualPresenca }
  }

  const agruparPresencasPorData = () => {
    const grupos: { [data: string]: Presenca[] } = {}

    presencas.forEach((presenca) => {
      const data = new Date(presenca.data).toLocaleDateString("pt-BR")
      if (!grupos[data]) {
        grupos[data] = []
      }
      grupos[data].push(presenca)
    })

    return Object.entries(grupos).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
  }

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      await carregarAlunos()
      setLoading(false)
    }
    carregarDados()
  }, [])

  useEffect(() => {
    if (alunos.length > 0) {
      carregarPresencas()
    }
  }, [alunoSelecionado, mesAno, alunos])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando histórico...</div>
      </div>
    )
  }

  const estatisticasGerais = calcularEstatisticas()
  const presencasAgrupadas = agruparPresencasPorData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Histórico de Presenças</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-2">
              <Label htmlFor="aluno">Aluno</Label>
              <Select value={alunoSelecionado} onValueChange={setAlunoSelecionado}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os alunos</SelectItem>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mesAno">Mês/Ano</Label>
              <Input
                id="mesAno"
                type="month"
                value={mesAno}
                onChange={(e) => setMesAno(e.target.value)}
                className="w-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Aulas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticasGerais.totalAulas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Presenças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticasGerais.presentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ausências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticasGerais.ausentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taxa de Presença
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticasGerais.percentualPresenca}%</div>
          </CardContent>
        </Card>
      </div>

      {alunoSelecionado !== "todos" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Estatísticas do Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const aluno = alunos.find((a) => a.id === alunoSelecionado)
              const stats = calcularEstatisticas(alunoSelecionado)
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{aluno?.nome}</h3>
                    <p className="text-muted-foreground">
                      {aluno?.instrumento?.nome} • {aluno?.idade} anos
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Aulas</p>
                      <p className="text-xl font-bold">{stats.totalAulas}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Presenças</p>
                      <p className="text-xl font-bold text-green-600">{stats.presentes}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ausências</p>
                      <p className="text-xl font-bold text-red-600">{stats.ausentes}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa</p>
                      <p className="text-xl font-bold">{stats.percentualPresenca}%</p>
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Histórico por Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {presencasAgrupadas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma presença registrada para os filtros selecionados
              </p>
            ) : (
              presencasAgrupadas.map(([data, presencasData]) => (
                <div key={data} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{data}</h3>
                    <Badge variant="secondary">
                      {presencasData.filter((p) => p.presente).length}/{presencasData.length} presentes
                    </Badge>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {presencasData.map((presenca) => (
                      <div key={presenca.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{presenca.aluno?.nome}</span>
                        <Badge variant={presenca.presente ? "default" : "destructive"} className="text-xs">
                          {presenca.presente ? "Presente" : "Ausente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
