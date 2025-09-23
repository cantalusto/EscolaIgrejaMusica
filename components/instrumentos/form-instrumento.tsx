"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { InstrumentoDisponivel } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface FormInstrumentoProps {
  instrumento?: InstrumentoDisponivel | null
  onSalvar: () => void
  onCancelar: () => void
}

export function FormInstrumento({ instrumento, onSalvar, onCancelar }: FormInstrumentoProps) {
  const [nome, setNome] = useState(instrumento?.nome || "")
  const [quantidade, setQuantidade] = useState(instrumento?.quantidade?.toString() || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim() || !quantidade || Number.parseInt(quantidade) < 1) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const url = instrumento ? `/api/instrumentos/${instrumento.id}` : "/api/instrumentos"

      const method = instrumento ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          quantidade: Number.parseInt(quantidade),
        }),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: instrumento ? "Instrumento atualizado com sucesso" : "Instrumento criado com sucesso",
        })
        onSalvar()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao salvar instrumento",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Instrumento</Label>
        <Input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Violão, Piano, Bateria..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantidade">Quantidade Disponível</Label>
        <Input
          id="quantidade"
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Ex: 3"
          required
        />
        {instrumento && (
          <p className="text-sm text-muted-foreground">
            Atualmente {instrumento.quantidade - instrumento.disponivel} alunos estão usando este instrumento
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
