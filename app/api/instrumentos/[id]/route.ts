import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { nome, quantidade } = await request.json()
    const { id } = params

    if (!nome || !quantidade || quantidade < 1) {
      return NextResponse.json({ error: "Nome e quantidade são obrigatórios" }, { status: 400 })
    }

    // Verificar se a nova quantidade não é menor que o número de alunos já cadastrados
    const alunosCount = await prisma.aluno.count({
      where: { instrumentoId: id },
    })

    if (quantidade < alunosCount) {
      return NextResponse.json(
        { error: `Não é possível reduzir a quantidade. Existem ${alunosCount} alunos usando este instrumento.` },
        { status: 400 },
      )
    }

    const instrumento = await prisma.instrumento.update({
      where: { id },
      data: {
        nome,
        quantidade: Number.parseInt(quantidade),
      },
    })

    return NextResponse.json(instrumento)
  } catch (error: any) {
    console.error("Erro ao atualizar instrumento:", error)

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Já existe um instrumento com este nome" }, { status: 409 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Verificar se existem alunos usando este instrumento
    const alunosCount = await prisma.aluno.count({
      where: { instrumentoId: id },
    })

    if (alunosCount > 0) {
      return NextResponse.json(
        { error: `Não é possível excluir. Existem ${alunosCount} alunos usando este instrumento.` },
        { status: 400 },
      )
    }

    await prisma.instrumento.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Instrumento excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir instrumento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
