
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Car, Calculator, MessageCircle, ArrowRight } from 'lucide-react';
import { vehicleCategories } from '@/data/vehicleCategories';

interface FinancingCalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FinancingCalculatorModal: React.FC<FinancingCalculatorModalProps> = ({ open, onOpenChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [installments, setInstallments] = useState(48);
  const [showResult, setShowResult] = useState(false);

  const brands = useMemo(() => {
    const cat = vehicleCategories.find(c => c.name === selectedCategory);
    return cat?.brands || [];
  }, [selectedCategory]);

  const models = useMemo(() => {
    const brand = brands.find(b => b.name === selectedBrand);
    return brand?.models || [];
  }, [brands, selectedBrand]);

  const selectedVehicle = useMemo(() => {
    return models.find(m => m.name === selectedModel);
  }, [models, selectedModel]);

  const calculation = useMemo(() => {
    if (!selectedVehicle) return null;
    const price = selectedVehicle.price;
    const downPayment = price * (downPaymentPercent / 100);
    const financed = price - downPayment;
    const monthlyRate = 0.0179; // ~1.79% a.m.
    const monthlyPayment = financed * (monthlyRate * Math.pow(1 + monthlyRate, installments)) / (Math.pow(1 + monthlyRate, installments) - 1);
    return {
      price,
      downPayment,
      financed,
      monthlyPayment,
      installments,
      totalPaid: downPayment + monthlyPayment * installments,
    };
  }, [selectedVehicle, downPaymentPercent, installments]);

  const handleSimulate = () => {
    if (selectedVehicle) setShowResult(true);
  };

  const handleReset = () => {
    setShowResult(false);
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedModel('');
    setDownPaymentPercent(20);
    setInstallments(48);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const whatsappMessage = selectedVehicle && calculation
    ? encodeURIComponent(
        `Olá! Tenho interesse em financiar um ${selectedBrand} ${selectedModel} ${selectedVehicle.year}.\n\nValor: ${formatCurrency(calculation.price)}\nEntrada: ${formatCurrency(calculation.downPayment)} (${downPaymentPercent}%)\nParcelas: ${installments}x de ${formatCurrency(calculation.monthlyPayment)}\n\nGostaria de falar com um especialista.`
      )
    : '';

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) handleReset(); }}>
      <DialogContent className="bg-[#0d1b30] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-xl">
            <Calculator className="h-6 w-6 text-[#4d9aff]" />
            Simulador de Financiamento
          </DialogTitle>
        </DialogHeader>

        {!showResult ? (
          <div className="space-y-5 pt-2">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Categoria</label>
              <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setSelectedBrand(''); setSelectedModel(''); }}>
                <SelectTrigger className="bg-[#141f35] border-white/10 text-white">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-[#141f35] border-white/10">
                  {vehicleCategories.map(c => (
                    <SelectItem key={c.name} value={c.name} className="text-white hover:bg-white/10">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Marca</label>
              <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedModel(''); }} disabled={!selectedCategory}>
                <SelectTrigger className="bg-[#141f35] border-white/10 text-white">
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent className="bg-[#141f35] border-white/10">
                  {brands.map(b => (
                    <SelectItem key={b.name} value={b.name} className="text-white hover:bg-white/10">{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Modelo</label>
              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                <SelectTrigger className="bg-[#141f35] border-white/10 text-white">
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent className="bg-[#141f35] border-white/10 max-h-60">
                  {models.map(m => (
                    <SelectItem key={m.name} value={m.name} className="text-white hover:bg-white/10">
                      {m.name} ({m.year}) - {formatCurrency(m.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedVehicle && (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Entrada</span>
                    <span className="text-[#4d9aff] font-bold">{downPaymentPercent}% — {formatCurrency(selectedVehicle.price * downPaymentPercent / 100)}</span>
                  </div>
                  <Slider
                    value={[downPaymentPercent]}
                    onValueChange={([v]) => setDownPaymentPercent(v)}
                    min={10}
                    max={70}
                    step={5}
                    className="[&_[role=slider]]:bg-[#0057FF] [&_[role=slider]]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Parcelas</span>
                    <span className="text-[#4d9aff] font-bold">{installments}x</span>
                  </div>
                  <Slider
                    value={[installments]}
                    onValueChange={([v]) => setInstallments(v)}
                    min={12}
                    max={72}
                    step={6}
                    className="[&_[role=slider]]:bg-[#0057FF] [&_[role=slider]]:border-0"
                  />
                </div>

                <Button
                  onClick={handleSimulate}
                  className="w-full bg-gradient-to-r from-[#0057FF] to-[#003DB8] text-white font-bold rounded-full py-6 text-base hover:scale-[1.02] transition-transform"
                >
                  Simular Financiamento <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        ) : calculation && selectedVehicle ? (
          <div className="space-y-5 pt-2">
            <div className="bg-[#141f35] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#0057FF]/20 rounded-xl flex items-center justify-center">
                  <Car className="h-6 w-6 text-[#4d9aff]" />
                </div>
                <div>
                  <p className="font-bold text-white">{selectedBrand} {selectedModel}</p>
                  <p className="text-sm text-slate-400">Ano {selectedVehicle.year}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0a1628] rounded-xl p-3">
                  <p className="text-xs text-slate-500">Valor do veículo</p>
                  <p className="font-bold text-white">{formatCurrency(calculation.price)}</p>
                </div>
                <div className="bg-[#0a1628] rounded-xl p-3">
                  <p className="text-xs text-slate-500">Entrada ({downPaymentPercent}%)</p>
                  <p className="font-bold text-green-400">{formatCurrency(calculation.downPayment)}</p>
                </div>
                <div className="bg-[#0a1628] rounded-xl p-3">
                  <p className="text-xs text-slate-500">Valor financiado</p>
                  <p className="font-bold text-white">{formatCurrency(calculation.financed)}</p>
                </div>
                <div className="bg-[#0a1628] rounded-xl p-3">
                  <p className="text-xs text-slate-500">Total pago</p>
                  <p className="font-bold text-slate-300">{formatCurrency(calculation.totalPaid)}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#0057FF]/20 to-[#003DB8]/20 border border-[#0057FF]/30 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-400">Parcela estimada</p>
                <p className="text-3xl font-extrabold text-[#4d9aff]">
                  {calculation.installments}x de {formatCurrency(calculation.monthlyPayment)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Taxa de 1,79% a.m. (simulação)</p>
              </div>
            </div>

            <Button
              onClick={() => window.open(`https://wa.me/5500000000000?text=${whatsappMessage}`, '_blank')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-6 text-base hover:scale-[1.02] transition-transform"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar com um especialista
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowResult(false)}
              className="w-full border-white/10 text-slate-300 hover:bg-white/5 rounded-full"
            >
              ← Voltar e editar simulação
            </Button>

            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full border-white/10 text-slate-500 hover:bg-white/5 rounded-full"
            >
              Nova simulação do zero
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default FinancingCalculatorModal;
