import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get("mes")
    const alunoId = searchParams.get("alunoId")

    const whereClause: any = {}

    if (mes) {
      whereClause.mes = mes
    }

    if (alunoId) {
      whereClause.alunoId = alunoId
    }

    const pagamentos = await prisma.pagamento.findMany({
      where: whereClause,
      include: {
        aluno: {
          include: {
            instrumento: true,
          },
        },
      },
      orderBy: [{ mes: "desc" }, { aluno: { nome: "asc" } }],
    })

    return NextResponse.json(pagamentos)
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { alunoId, valor, mes } = await request.json()

    if (!alunoId || !valor || !mes) {
      return NextResponse.json({ error: "AlunoId, valor e mês são obrigatórios" }, { status: 400 })
    }

    const pagamento = await prisma.pagamento.create({
      data: {
        alunoId,
        valor: Number.parseFloat(valor),
        mes,
      },
      include: {
        aluno: {
          include: {
            instrumento: true,
          },
        },
      },
    })

    return NextResponse.json(pagamento, { status: 201 })
  } catch (error: any) {
    console.error("Erro ao criar pagamento:", error)

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Já existe um pagamento para este aluno neste mês" }, { status: 409 })
    }

    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
