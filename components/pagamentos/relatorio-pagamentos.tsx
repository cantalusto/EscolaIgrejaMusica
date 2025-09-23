"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, DollarSign, Users, Calendar } from "lucide-react"
import type { Pagamento } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"]

export function RelatorioPagamentos() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear().toString())
  const { toast } = useToast()

  const carregarPagamentos = async () => {
    try {
      const response = await fetch("/api/pagamentos")
      if (response.ok) {
        const data = await response.json()
        // Filtrar por ano se especificado
        const pagamentosFiltrados = data.filter((pagamento: Pagamento) => {
          if (!anoSelecionado) return true
          return pagamento.mes.startsWith(anoSelecionado)
        })
        setPagamentos(pagamentosFiltrados)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar relatório",
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

  const calcularEstatisticasGerais = () => {
    const total = pagamentos.length
    const pagos = pagamentos.filter((p) => p.pago).length
    const pendentes = total - pagos
    const valorTotal = pagamentos.reduce((acc, p) => acc + p.valor, 0)
    const valorRecebido = pagamentos.filter((p) => p.pago).reduce((acc, p) => acc + p.valor, 0)
    const valorPendente = valorTotal - valorRecebido
    const taxaRecebimento = total > 0 ? Math.round((pagos / total) * 100) : 0

    return {
      total,
      pagos,
      pendentes,
      valorTotal,
      valorRecebido,
      valorPendente,
      taxaRecebimento,
    }
  }

  const gerarDadosGraficoMensal = () => {
    const dadosPorMes: { [mes: string]: { total: number; pagos: number; valor: number } } = {}

    pagamentos.forEach((pagamento) => {
      const mes = pagamento.mes
      if (!dadosPorMes[mes]) {
        dadosPorMes[mes] = { total: 0, pagos: 0, valor: 0 }
      }
      dadosPorMes[mes].total++
      if (pagamento.pago) {
        dadosPorMes[mes].pagos++
        dadosPorMes[mes].valor += pagamento.valor
      }
    })

    return Object.entries(dadosPorMes)
      .map(([mes, dados]) => ({
        mes: new Date(mes + "-01").toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
        total: dados.total,
        pagos: dados.pagos,
        valor: dados.valor,
        taxa: dados.total > 0 ? Math.round((dados.pagos / dados.total) * 100) : 0,
      }))
      .sort((a, b) => a.mes.localeCompare(b.mes))
  }

  const gerarDadosGraficoPizza = () => {
    const stats = calcularEstatisticasGerais()
    return [
      { name: "Pagos", value: stats.pagos, color: COLORS[0] },
      { name: "Pendentes", value: stats.pendentes, color: COLORS[1] },
    ]
  }

  const exportarRelatorio = () => {
    const stats = calcularEstatisticasGerais()
    const dadosMensais = gerarDadosGraficoMensal()

    const relatorio = {
      periodo: anoSelecionado,
      geradoEm: new Date().toLocaleString("pt-BR"),
      estatisticasGerais: stats,
      dadosMensais,
      pagamentos: pagamentos.map((p) => ({
        aluno: p.aluno?.nome,
        instrumento: p.aluno?.instrumento?.nome,
        mes: p.mes,
        valor: p.valor,
        pago: p.pago,
        dataPagamento: p.dataPagamento,
      })),
    }

    const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-pagamentos-${anoSelecionado}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Sucesso",
      description: "Relatório exportado com sucesso",
    })
  }

  useEffect(() => {
    carregarPagamentos()
  }, [anoSelecionado])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando relatório...</div>
      </div>
    )
  }

  const stats = calcularEstatisticasGerais()
  const dadosGraficoMensal = gerarDadosGraficoMensal()
  const dadosGraficoPizza = gerarDadosGraficoPizza()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Relatório de Pagamentos</h2>
        <div className="flex gap-2">
          <div className="space-y-2">
            <Label htmlFor="ano">Ano</Label>
            <Input
              id="ano"
              type="number"
              min="2020"
              max="2030"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(e.target.value)}
              className="w-[100px]"
            />
          </div>
          <Button onClick={exportarRelatorio} variant="outline" className="mt-6 bg-transparent">
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total de Cobranças
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              R$ {stats.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor Recebido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.valorRecebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{stats.pagos} pagamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Valor Pendente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {stats.valorPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{stats.pendentes} pagamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taxa de Recebimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.taxaRecebimento}%</div>
            <p className="text-xs text-muted-foreground">dos pagamentos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGraficoMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "valor"
                      ? `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      : value,
                    name === "valor"
                      ? "Valor Recebido"
                      : name === "pagos"
                        ? "Pagamentos Confirmados"
                        : "Total de Cobranças",
                  ]}
                />
                <Bar dataKey="total" fill="#94a3b8" name="total" />
                <Bar dataKey="pagos" fill="#10b981" name="pagos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosGraficoPizza}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosGraficoPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {pagamentos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <p className="text-lg mb-2">Nenhum pagamento encontrado</p>
              <p className="text-sm">Ajuste o filtro de ano ou gere pagamentos primeiro</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
