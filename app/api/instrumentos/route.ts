import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const instrumentos = await prisma.instrumento.findMany({
      include: {
        _count: {
          select: { alunos: true },
        },
      },
      orderBy: { nome: "asc" },
    })

    // Calcular instrumentos disponíveis
    const instrumentosDisponiveis = instrumentos.map((instrumento) => ({
      ...instrumento,
      disponivel: instrumento.quantidade - instrumento._count.alunos,
    }))

    return NextResponse.json(instrumentosDisponiveis)
  } catch (error) {
    console.error("Erro ao buscar instrumentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { nome, quantidade } = await request.json()

    if (!nome || !quantidade || quantidade < 1) {
      return NextResponse.json({ error: "Nome e quantidade são obrigatórios" }, { status: 400 })
    }

    const instrumento = await prisma.instrumento.create({
      data: {
        nome,
        quantidade: Number.parseInt(quantidade),
      },
    })

    return NextResponse.json(instrumento, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar instrumento:", error)

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Já existe um instrumento com este nome" }, { status: 409 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
