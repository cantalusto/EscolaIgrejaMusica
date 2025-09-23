-- CreateTable
CREATE TABLE "public"."instrumentos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instrumentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."alunos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "instrumentoId" TEXT NOT NULL,
    "statusPagamento" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."presencas" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presente" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presencas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pagamentos" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "mes" TEXT NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "dataPagamento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instrumentos_nome_key" ON "public"."instrumentos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "pagamentos_alunoId_mes_key" ON "public"."pagamentos"("alunoId", "mes");

-- AddForeignKey
ALTER TABLE "public"."alunos" ADD CONSTRAINT "alunos_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "public"."instrumentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."presencas" ADD CONSTRAINT "presencas_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagamentos" ADD CONSTRAINT "pagamentos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
