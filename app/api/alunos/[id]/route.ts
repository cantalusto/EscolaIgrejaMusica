import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { nome, idade, instrumentoId } = await request.json()
    const { id } = params

    if (!nome || !idade || !instrumentoId) {
      return NextResponse.json({ error: "Nome, idade e instrumento são obrigatórios" }, { status: 400 })
    }

    // Buscar aluno atual
    const alunoAtual = await prisma.aluno.findUnique({
      where: { id },
    })

    if (!alunoAtual) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 })
    }

    // Se mudou de instrumento, verificar disponibilidade
    if (alunoAtual.instrumentoId !== instrumentoId) {
      const instrumento = await prisma.instrumento.findUnique({
        where: { id: instrumentoId },
        include: {
          _count: {
            select: { alunos: true },
          },
        },
      })

      if (!instrumento) {
        return NextResponse.json({ error: "Instrumento não encontrado" }, { status: 404 })
      }

      if (instrumento._count.alunos >= instrumento.quantidade) {
        return NextResponse.json({ error: "Este instrumento não está mais disponível" }, { status: 400 })
      }
    }

    const aluno = await prisma.aluno.update({
      where: { id },
      data: {
        nome,
        idade: Number.parseInt(idade),
        instrumentoId,
      },
      include: {
        instrumento: true,
      },
    })

    return NextResponse.json(aluno)
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Excluir aluno (presencas e pagamentos serão excluídos automaticamente devido ao onDelete: Cascade)
    await prisma.aluno.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Aluno excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir aluno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
