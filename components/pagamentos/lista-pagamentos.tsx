"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, DollarSign, Calendar, User, Plus, AlertCircle } from "lucide-react"
import type { Aluno, Pagamento } from "@/lib/types"
import { FormPagamento } from "./form-pagamento"
import { useToast } from "@/hooks/use-toast"

export function ListaPagamentos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [atualizando, setAtualizando] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [mesAno, setMesAno] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>("todos")
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

  const carregarPagamentos = async () => {
    try {
      const params = new URLSearchParams()
      if (mesAno) params.append("mes", mesAno)
      if (alunoSelecionado !== "todos") params.append("alunoId", alunoSelecionado)

      const response = await fetch(`/api/pagamentos?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPagamentos(data)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar pagamentos",
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

  const atualizarStatusPagamento = async (pagamentoId: string, pago: boolean) => {
    setAtualizando(true)
    try {
      const response = await fetch(`/api/pagamentos/${pagamentoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pago }),
      })

      if (response.ok) {
        await carregarPagamentos()
        await carregarAlunos() // Recarregar para atualizar status geral
        toast({
          title: "Sucesso",
          description: `Pagamento ${pago ? "confirmado" : "marcado como pendente"}`,
        })
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao atualizar pagamento",
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
      setAtualizando(false)
    }
  }

  const gerarPagamentosMes = async () => {
    if (
      !confirm(`Tem certeza que deseja gerar pagamentos para ${mesAno}? Isso criará uma cobrança para todos os alunos.`)
    ) {
      return
    }

    setAtualizando(true)
    try {
      const promises = alunos.map((aluno) =>
        fetch("/api/pagamentos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            alunoId: aluno.id,
            valor: 100, // Valor padrão - pode ser configurável
            mes: mesAno,
          }),
        }),
      )

      await Promise.all(promises)
      await carregarPagamentos()
      toast({
        title: "Sucesso",
        description: "Pagamentos gerados com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar pagamentos",
        variant: "destructive",
      })
    } finally {
      setAtualizando(false)
    }
  }

  const handleSalvarPagamento = () => {
    carregarPagamentos()
    setMostrarForm(false)
  }

  const calcularEstatisticas = () => {
    const total = pagamentos.length
    const pagos = pagamentos.filter((p) => p.pago).length
    const pendentes = total - pagos
    const valorTotal = pagamentos.reduce((acc, p) => acc + p.valor, 0)
    const valorRecebido = pagamentos.filter((p) => p.pago).reduce((acc, p) => acc + p.valor, 0)
    const valorPendente = valorTotal - valorRecebido

    return { total, pagos, pendentes, valorTotal, valorRecebido, valorPendente }
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
      carregarPagamentos()
    }
  }, [mesAno, alunoSelecionado, alunos])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando pagamentos...</div>
      </div>
    )
  }

  const stats = calcularEstatisticas()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Gerenciar Pagamentos</h2>
        <div className="flex gap-2">
          <Button onClick={() => setMostrarForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Pagamento
          </Button>
          <Button onClick={gerarPagamentosMes} disabled={atualizando} variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Gerar Mês
          </Button>
        </div>
      </div>

      {mostrarForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <FormPagamento onSalvar={handleSalvarPagamento} onCancelar={() => setMostrarForm(false)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Filtros e Controles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
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
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
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
            <CardTitle className="text-sm font-medium">Pagamentos Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.pagos}</div>
            <p className="text-xs text-muted-foreground">
              R$ {stats.valorRecebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pendentes}</div>
            <p className="text-xs text-muted-foreground">
              R$ {stats.valorPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pagamentos.map((pagamento) => (
          <Card key={pagamento.id} className={`relative ${pagamento.pago ? "border-green-500" : "border-red-500"}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{pagamento.aluno?.nome}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`pagamento-${pagamento.id}`}
                    checked={pagamento.pago}
                    onCheckedChange={(checked) => atualizarStatusPagamento(pagamento.id, checked as boolean)}
                    disabled={atualizando}
                  />
                  <Label htmlFor={`pagamento-${pagamento.id}`} className="text-sm font-medium">
                    Pago
                  </Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mês:</span>
                  <Badge variant="secondary">
                    {new Date(pagamento.mes + "-01").toLocaleDateString("pt-BR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valor:</span>
                  <Badge variant="outline" className="font-mono">
                    R$ {pagamento.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={pagamento.pago ? "default" : "destructive"}>
                    {pagamento.pago ? "Pago" : "Pendente"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Instrumento:</span>
                  <Badge variant="outline">{pagamento.aluno?.instrumento?.nome || "N/A"}</Badge>
                </div>

                {pagamento.pago && pagamento.dataPagamento && (
                  <div className="pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      <span>Pago em {new Date(pagamento.dataPagamento).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                )}

                {!pagamento.pago && (
                  <div className="pt-2 text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" />
                    <span>Pagamento em atraso</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagamentos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <p className="text-lg mb-2">Nenhum pagamento encontrado</p>
              <p className="text-sm">
                {alunos.length === 0
                  ? "Cadastre alunos primeiro"
                  : "Clique em 'Gerar Mês' para criar pagamentos ou ajuste os filtros"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
