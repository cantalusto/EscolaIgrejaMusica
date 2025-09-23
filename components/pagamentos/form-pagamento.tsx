"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Aluno } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface FormPagamentoProps {
  onSalvar: () => void
  onCancelar: () => void
}

export function FormPagamento({ onSalvar, onCancelar }: FormPagamentoProps) {
  const [alunoId, setAlunoId] = useState("")
  const [valor, setValor] = useState("100")
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7))
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAlunos, setLoadingAlunos] = useState(true)
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
      setLoadingAlunos(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!alunoId || !valor || !mes || Number.parseFloat(valor) <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/pagamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alunoId,
          valor: Number.parseFloat(valor),
          mes,
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Pagamento criado com sucesso",
        })
        onSalvar()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao criar pagamento",
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

  useEffect(() => {
    carregarAlunos()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="aluno">Aluno</Label>
        {loadingAlunos ? (
          <div className="text-sm text-muted-foreground">Carregando alunos...</div>
        ) : (
          <Select value={alunoId} onValueChange={setAlunoId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um aluno" />
            </SelectTrigger>
            <SelectContent>
              {alunos.map((aluno) => (
                <SelectItem key={aluno.id} value={aluno.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{aluno.nome}</span>
                    <span className="text-xs text-muted-foreground ml-2">({aluno.instrumento?.nome})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor">Valor (R$)</Label>
        <Input
          id="valor"
          type="number"
          min="0.01"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="100.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mes">Mês/Ano</Label>
        <Input id="mes" type="month" value={mes} onChange={(e) => setMes(e.target.value)} required />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || alunos.length === 0}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
