import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const alunos = await prisma.aluno.findMany({
      include: {
        instrumento: true,
        _count: {
          select: {
            presencas: {
              where: { presente: true },
            },
          },
        },
      },
      orderBy: { nome: "asc" },
    })

    return NextResponse.json(alunos)
  } catch (error) {
    console.error("Erro ao buscar alunos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nome, idade, instrumentoId } = await request.json()

    if (!nome || !idade || !instrumentoId) {
      return NextResponse.json({ error: "Nome, idade e instrumento são obrigatórios" }, { status: 400 })
    }

    // Verificar se o instrumento está disponível
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

    const aluno = await prisma.aluno.create({
      data: {
        nome,
        idade: Number.parseInt(idade),
        instrumentoId,
      },
      include: {
        instrumento: true,
      },
    })

    // Criar pagamento inicial para o mês atual
    const mesAtual = new Date().toISOString().slice(0, 7) // YYYY-MM
    await prisma.pagamento.create({
      data: {
        alunoId: aluno.id,
        valor: 100, // Valor padrão - pode ser configurável
        mes: mesAtual,
      },
    })

    return NextResponse.json(aluno, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar aluno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
