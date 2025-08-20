import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PixleyOnRamp } from '@/components/pixley/PixleyOnRamp';
import { PixleyOffRamp } from '@/components/pixley/PixleyOffRamp';
import { PixleyTransactions } from '@/components/pixley/PixleyTransactions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, History, Info, Loader2 } from 'lucide-react';

interface UserLimits {
  dailyLimits: any;
  monthlyLimits: any;
  dailyUsage: any;
  monthlyUsage: any;  
  remainingLimits: any;
}

export default function PixleyPage() {
  const { toast } = useToast();
  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [loadingLimits, setLoadingLimits] = useState(false);

  const loadUserLimits = async () => {
    setLoadingLimits(true);
    try {
      const { data, error } = await supabase.functions.invoke('pixley-user-limits');

      if (error) throw error;

      if (data.status === 'success') {
        setLimits(data.data);
        toast({
          title: 'Limites carregados',
          description: 'Seus limites foram atualizados',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Erro ao carregar limites:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar limites do usuário',
        variant: 'destructive',
      });
    } finally {
      setLoadingLimits(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pixley Crypto</h1>
          <p className="text-muted-foreground">
            Compre e venda criptomoedas usando PIX
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadUserLimits}
          disabled={loadingLimits}
        >
          {loadingLimits ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Info className="w-4 h-4 mr-2" />
          )}
          Ver Limites
        </Button>
      </div>

      {limits && (
        <Card>
          <CardHeader>
            <CardTitle>Seus Limites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Limites Diários</h4>
                <div className="text-sm space-y-1">
                  {limits.dailyLimits && Object.entries(limits.dailyLimits).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key.toUpperCase()}:</span>
                      <span>{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Uso Diário</h4>
                <div className="text-sm space-y-1">
                  {limits.dailyUsage && Object.entries(limits.dailyUsage).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key.toUpperCase()}:</span>
                      <span>{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Limites Restantes</h4>
                <div className="text-sm space-y-1">
                  {limits.remainingLimits && Object.entries(limits.remainingLimits).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key.toUpperCase()}:</span>
                      <span className="font-medium">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="on-ramp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="on-ramp" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Comprar Cripto
          </TabsTrigger>
          <TabsTrigger value="off-ramp" className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Vender Cripto
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="on-ramp" className="mt-6">
          <PixleyOnRamp />
        </TabsContent>

        <TabsContent value="off-ramp" className="mt-6">
          <PixleyOffRamp />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <PixleyTransactions />
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>⚠️ Esta é uma integração com o ambiente SANDBOX da Pixley</p>
            <p>Todas as transações são para fins de teste apenas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}