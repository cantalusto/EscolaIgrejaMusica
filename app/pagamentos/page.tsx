import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListaPagamentos } from "@/components/pagamentos/lista-pagamentos"
import { RelatorioPagamentos } from "@/components/pagamentos/relatorio-pagamentos"

export default function PagamentosPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="pagamentos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pagamentos">Gerenciar Pagamentos</TabsTrigger>
          <TabsTrigger value="relatorio">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="pagamentos">
          <ListaPagamentos />
        </TabsContent>

        <TabsContent value="relatorio">
          <RelatorioPagamentos />
        </TabsContent>
      </Tabs>
    </div>
  )
}
