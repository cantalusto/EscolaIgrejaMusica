export interface Instrumento {
  id: string
  nome: string
  quantidade: number
  createdAt: Date
  updatedAt: Date
  _count?: {
    alunos: number
  }
}

export interface Aluno {
  id: string
  nome: string
  idade: number
  instrumentoId: string
  statusPagamento: boolean
  createdAt: Date
  updatedAt: Date
  instrumento?: Instrumento
  presencas?: Presenca[]
  pagamentos?: Pagamento[]
}

export interface Presenca {
  id: string
  alunoId: string
  data: Date
  presente: boolean
  createdAt: Date
  aluno?: Aluno
}

export interface Pagamento {
  id: string
  alunoId: string
  valor: number
  mes: string
  pago: boolean
  dataPagamento?: Date | null
  createdAt: Date
  updatedAt: Date
  aluno?: Aluno
}

export interface InstrumentoDisponivel extends Instrumento {
  disponivel: number
}
