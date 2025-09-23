import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { pago } = await request.json()
    const { id } = params

    if (pago === undefined) {
      return NextResponse.json({ error: "Status de pagamento é obrigatório" }, { status: 400 })
    }

    const pagamento = await prisma.pagamento.update({
      where: { id },
      data: {
        pago,
        dataPagamento: pago ? new Date() : null,
      },
      include: {
        aluno: {
          include: {
            instrumento: true,
          },
        },
      },
    })

    // Atualizar status de pagamento do aluno baseado nos pagamentos pendentes
    const pagamentosPendentes = await prisma.pagamento.count({
      where: {
        alunoId: pagamento.alunoId,
        pago: false,
      },
    })

    await prisma.aluno.update({
      where: { id: pagamento.alunoId },
      data: {
        statusPagamento: pagamentosPendentes === 0,
      },
    })

    return NextResponse.json(pagamento)
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
