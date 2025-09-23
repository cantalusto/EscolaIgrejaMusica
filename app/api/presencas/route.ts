import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get("data")
    const alunoId = searchParams.get("alunoId")

    const whereClause: any = {}

    if (data) {
      const dataInicio = new Date(data)
      const dataFim = new Date(data)
      dataFim.setDate(dataFim.getDate() + 1)

      whereClause.data = {
        gte: dataInicio,
        lt: dataFim,
      }
    }

    if (alunoId) {
      whereClause.alunoId = alunoId
    }

    const presencas = await prisma.presenca.findMany({
      where: whereClause,
      include: {
        aluno: {
          include: {
            instrumento: true,
          },
        },
      },
      orderBy: [{ data: "desc" }, { aluno: { nome: "asc" } }],
    })

    return NextResponse.json(presencas)
  } catch (error) {
    console.error("Erro ao buscar presenças:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { alunoId, presente, data } = await request.json()

    if (!alunoId || presente === undefined) {
      return NextResponse.json({ error: "AlunoId e presente são obrigatórios" }, { status: 400 })
    }

    const dataPresenca = data ? new Date(data) : new Date()

    // Verificar se já existe presença para este aluno nesta data
    const presencaExistente = await prisma.presenca.findFirst({
      where: {
        alunoId,
        data: {
          gte: new Date(dataPresenca.toDateString()),
          lt: new Date(new Date(dataPresenca.toDateString()).getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    if (presencaExistente) {
      // Atualizar presença existente
      const presenca = await prisma.presenca.update({
        where: { id: presencaExistente.id },
        data: { presente },
        include: {
          aluno: {
            include: {
              instrumento: true,
            },
          },
        },
      })
      return NextResponse.json(presenca)
    } else {
      // Criar nova presença
      const presenca = await prisma.presenca.create({
        data: {
          alunoId,
          presente,
          data: dataPresenca,
        },
        include: {
          aluno: {
            include: {
              instrumento: true,
            },
          },
        },
      })
      return NextResponse.json(presenca, { status: 201 })
    }
  } catch (error) {
    console.error("Erro ao registrar presença:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
