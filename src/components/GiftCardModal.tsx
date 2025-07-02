
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GiftCard {
  id: string;
  name: string;
  image: string;
  values: number[];
  description: string;
}

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftCard: GiftCard | null;
  selectedValue: number | null;
  onValueSelect: (value: number) => void;
  onConfirmPurchase: () => void;
  isProcessing: boolean;
}

const GiftCardModal: React.FC<GiftCardModalProps> = ({
  isOpen,
  onClose,
  giftCard,
  selectedValue,
  onValueSelect,
  onConfirmPurchase,
  isProcessing
}) => {
  if (!giftCard) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <img src={giftCard.image} alt={giftCard.name} className="w-8 h-8 rounded" />
            <span>Comprar {giftCard.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{giftCard.description}</p>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Escolha o valor:</label>
            <div className="grid grid-cols-2 gap-2">
              {giftCard.values.map((value) => (
                <Card 
                  key={value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedValue === value ? 'ring-2 ring-[#0057FF] bg-blue-50' : ''
                  }`}
                  onClick={() => onValueSelect(value)}
                >
                  <CardContent className="p-3 text-center">
                    <span className="font-semibold">R$ {value}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedValue && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-[#0057FF]">R$ {selectedValue}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  O valor será debitado do seu saldo disponível
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={onConfirmPurchase}
              disabled={!selectedValue || isProcessing}
              className="flex-1 bg-[#0057FF] hover:bg-[#0057FF]/90"
            >
              {isProcessing ? 'Processando...' : 'Confirmar Compra'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GiftCardModal;
