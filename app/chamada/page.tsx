import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListaChamada } from "@/components/chamada/lista-chamada"
import { HistoricoPresencas } from "@/components/chamada/historico-presencas"

export default function ChamadaPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="chamada" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chamada">Fazer Chamada</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="chamada">
          <ListaChamada />
        </TabsContent>

        <TabsContent value="historico">
          <HistoricoPresencas />
        </TabsContent>
      </Tabs>
    </div>
  )
}
