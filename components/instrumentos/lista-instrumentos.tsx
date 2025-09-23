"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import type { InstrumentoDisponivel } from "@/lib/types"
import { FormInstrumento } from "./form-instrumento"
import { useToast } from "@/hooks/use-toast"

export function ListaInstrumentos() {
  const [instrumentos, setInstrumentos] = useState<InstrumentoDisponivel[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<InstrumentoDisponivel | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const { toast } = useToast()

  const carregarInstrumentos = async () => {
    try {
      const response = await fetch("/api/instrumentos")
      if (response.ok) {
        const data = await response.json()
        setInstrumentos(data)
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
      setLoading(false)
    }
  }

  const excluirInstrumento = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este instrumento?")) {
      return
    }

    try {
      const response = await fetch(`/api/instrumentos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Instrumento excluído com sucesso",
        })
        carregarInstrumentos()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao excluir instrumento",
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
    carregarInstrumentos()
    setMostrarForm(false)
    setEditando(null)
  }

  const handleCancelar = () => {
    setMostrarForm(false)
    setEditando(null)
  }

  useEffect(() => {
    carregarInstrumentos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando instrumentos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Gerenciar Instrumentos</h2>
        <Button onClick={() => setMostrarForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Instrumento
        </Button>
      </div>

      {(mostrarForm || editando) && (
        <Card>
          <CardHeader>
            <CardTitle>{editando ? "Editar Instrumento" : "Novo Instrumento"}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormInstrumento instrumento={editando} onSalvar={handleSalvar} onCancelar={handleCancelar} />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instrumentos.map((instrumento) => (
          <Card key={instrumento.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{instrumento.nome}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditando(instrumento)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => excluirInstrumento(instrumento.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <Badge variant="secondary">{instrumento.quantidade}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Em uso:</span>
                  <Badge variant="outline">{instrumento.quantidade - instrumento.disponivel}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Disponível:</span>
                  <Badge variant={instrumento.disponivel > 0 ? "default" : "destructive"}>
                    {instrumento.disponivel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {instrumentos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <p className="text-lg mb-2">Nenhum instrumento cadastrado</p>
              <p className="text-sm">Clique em "Adicionar Instrumento" para começar</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
