"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Aluno, InstrumentoDisponivel } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface FormAlunoProps {
  aluno?: Aluno | null
  onSalvar: () => void
  onCancelar: () => void
}

export function FormAluno({ aluno, onSalvar, onCancelar }: FormAlunoProps) {
  const [nome, setNome] = useState(aluno?.nome || "")
  const [idade, setIdade] = useState(aluno?.idade?.toString() || "")
  const [instrumentoId, setInstrumentoId] = useState(aluno?.instrumentoId || "")
  const [instrumentos, setInstrumentos] = useState<InstrumentoDisponivel[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingInstrumentos, setLoadingInstrumentos] = useState(true)
  const { toast } = useToast()

  const carregarInstrumentos = async () => {
    try {
      const response = await fetch("/api/instrumentos")
      if (response.ok) {
        const data = await response.json()
        // Filtrar apenas instrumentos disponíveis, mas incluir o instrumento atual do aluno se estiver editando
        const instrumentosDisponiveis = data.filter(
          (inst: InstrumentoDisponivel) => inst.disponivel > 0 || (aluno && inst.id === aluno.instrumentoId),
        )
        setInstrumentos(instrumentosDisponiveis)
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar instrumentos",
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
      setLoadingInstrumentos(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim() || !idade || !instrumentoId || Number.parseInt(idade) < 1) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const url = aluno ? `/api/alunos/${aluno.id}` : "/api/alunos"

      const method = aluno ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          idade: Number.parseInt(idade),
          instrumentoId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: aluno ? "Aluno atualizado com sucesso" : "Aluno cadastrado com sucesso",
        })
        onSalvar()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao salvar aluno",
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
    carregarInstrumentos()
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome completo do aluno"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="idade">Idade</Label>
        <Input
          id="idade"
          type="number"
          min="1"
          max="100"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Digite a idade"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instrumento">Instrumento</Label>
        {loadingInstrumentos ? (
          <div className="text-sm text-muted-foreground">Carregando instrumentos...</div>
        ) : (
          <Select value={instrumentoId} onValueChange={setInstrumentoId} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um instrumento" />
            </SelectTrigger>
            <SelectContent>
              {instrumentos.map((instrumento) => (
                <SelectItem key={instrumento.id} value={instrumento.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{instrumento.nome}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({instrumento.disponivel} disponível{instrumento.disponivel !== 1 ? "is" : ""})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {instrumentos.length === 0 && !loadingInstrumentos && (
          <p className="text-sm text-muted-foreground">
            Nenhum instrumento disponível. Cadastre instrumentos primeiro ou aumente a quantidade dos existentes.
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || instrumentos.length === 0}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
