import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Car, User, MapPin, Briefcase, Building, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FichaData {
  id: string;
  veiculo_marca: string;
  veiculo_modelo: string;
  veiculo_ano: number;
  veiculo_cor: string;
  valor_veiculo: number;
  valor_entrada: number;
  parcelas: number;
  valor_parcela: number;
  nome_completo: string;
  cpf: string;
  nome_mae: string;
  data_nascimento: string;
  status: string;
  expira_em: string;
}

const bancosBrasileiros = [
  'Banco do Brasil', 'Caixa Econômica', 'Itaú', 'Bradesco', 'Santander',
  'Nubank', 'Inter', 'C6 Bank', 'PicPay', 'Mercado Pago', 'PagBank',
  'Sicredi', 'Sicoob', 'Banrisul', 'BRB', 'Safra', 'BTG Pactual'
];

const estadosBrasileiros = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
];

export default function FichaCadastral() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ficha, setFicha] = useState<FichaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  const [formData, setFormData] = useState({
    rg: '',
    nome_pai: '',
    estado_civil: '',
    telefone: '',
    telefone_alternativo: '',
    email: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    referencia_nome: '',
    referencia_telefone: '',
    referencia_parentesco: '',
    bancos_possui: [] as string[],
    banco_preferido: '',
    tipo_conta: '',
    empresa_nome: '',
    empresa_cnpj: '',
    cargo: '',
    tempo_servico: '',
    renda_mensal: '',
    tipo_contrato: '',
    tipo_documento: 'CNH'
  });

  const [documentoFrente, setDocumentoFrente] = useState<File | null>(null);
  const [documentoVerso, setDocumentoVerso] = useState<File | null>(null);
  const [uploadingFrente, setUploadingFrente] = useState(false);
  const [uploadingVerso, setUploadingVerso] = useState(false);
  const [documentosEnviados, setDocumentosEnviados] = useState({ frente: false, verso: false });

  useEffect(() => {
    if (token) {
      fetchFicha();
    }
  }, [token]);

  const fetchFicha = async () => {
    try {
      const response = await supabase.functions.invoke('ficha-cadastral', {
        body: null,
        headers: {},
      });
      
      // Use fetch directly for public access
      const res = await fetch(
        `https://fjyeqltwvlhexgncudpz.supabase.co/functions/v1/ficha-cadastral?action=get&token=${token}`
      );
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.expired) {
          setError('Este link expirou. Solicite um novo link ao vendedor.');
        } else {
          setError(data.error || 'Ficha não encontrada');
        }
        return;
      }

      setFicha(data.ficha);
      
      if (data.ficha.status === 'completo') {
        setCompleted(true);
      }
    } catch (err) {
      console.error('Error fetching ficha:', err);
      setError('Erro ao carregar ficha cadastral');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBancoToggle = (banco: string) => {
    setFormData(prev => ({
      ...prev,
      bancos_possui: prev.bancos_possui.includes(banco)
        ? prev.bancos_possui.filter(b => b !== banco)
        : [...prev.bancos_possui, banco]
    }));
  };

  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const handleUploadDocument = async (tipo: 'frente' | 'verso', file: File) => {
    if (tipo === 'frente') {
      setUploadingFrente(true);
    } else {
      setUploadingVerso(true);
    }

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('token', token!);
      formDataUpload.append('tipo', tipo);

      const res = await fetch(
        `https://fjyeqltwvlhexgncudpz.supabase.co/functions/v1/ficha-cadastral?action=upload`,
        {
          method: 'POST',
          body: formDataUpload
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setDocumentosEnviados(prev => ({ ...prev, [tipo]: true }));
      toast.success(`Documento ${tipo === 'frente' ? 'frente' : 'verso'} enviado com sucesso!`);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar documento');
    } finally {
      if (tipo === 'frente') {
        setUploadingFrente(false);
      } else {
        setUploadingVerso(false);
      }
    }
  };

  const handleSubmitStep = async () => {
    setSubmitting(true);

    try {
      let updateData: any = {};
      let newStatus = 'pendente';

      if (step === 1) {
        updateData = {
          rg: formData.rg,
          nome_pai: formData.nome_pai,
          estado_civil: formData.estado_civil,
          telefone: formData.telefone,
          telefone_alternativo: formData.telefone_alternativo,
          email: formData.email
        };
      } else if (step === 2) {
        updateData = {
          cep: formData.cep,
          endereco: formData.endereco,
          numero: formData.numero,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          estado: formData.estado,
          referencia_nome: formData.referencia_nome,
          referencia_telefone: formData.referencia_telefone,
          referencia_parentesco: formData.referencia_parentesco
        };
      } else if (step === 3) {
        updateData = {
          bancos_possui: formData.bancos_possui,
          banco_preferido: formData.banco_preferido,
          tipo_conta: formData.tipo_conta,
          empresa_nome: formData.empresa_nome,
          empresa_cnpj: formData.empresa_cnpj,
          cargo: formData.cargo,
          tempo_servico: formData.tempo_servico,
          renda_mensal: parseFloat(formData.renda_mensal) || 0,
          tipo_contrato: formData.tipo_contrato,
          status: 'documentos_pendentes'
        };
        newStatus = 'documentos_pendentes';
      } else if (step === 4) {
        if (!documentosEnviados.frente || !documentosEnviados.verso) {
          toast.error('Por favor, envie os dois lados do documento');
          setSubmitting(false);
          return;
        }
        updateData = {
          tipo_documento: formData.tipo_documento,
          status: 'completo',
          preenchido_em: new Date().toISOString()
        };
        newStatus = 'completo';
      }

      const res = await fetch(
        `https://fjyeqltwvlhexgncudpz.supabase.co/functions/v1/ficha-cadastral?action=update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, data: updateData })
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }

      if (step < 4) {
        setStep(step + 1);
        toast.success('Dados salvos com sucesso!');
      } else {
        setCompleted(true);
        toast.success('Ficha cadastral concluída com sucesso!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar dados');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Erro</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Ficha Cadastral Concluída!</h2>
            <p className="text-muted-foreground mb-4">
              Seus dados foram enviados com sucesso. Em breve entraremos em contato para dar continuidade ao seu financiamento.
            </p>
            <div className="bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium">{ficha?.veiculo_marca} {ficha?.veiculo_modelo} {ficha?.veiculo_ano}</p>
              <p className="text-muted-foreground">
                {ficha?.parcelas}x de {formatCurrency(ficha?.valor_parcela || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with vehicle info */}
        <Card className="mb-6 bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Car className="h-12 w-12" />
              <div>
                <h1 className="text-xl font-bold">Ficha Cadastral - Financiamento</h1>
                <p className="opacity-90">
                  {ficha?.veiculo_marca} {ficha?.veiculo_modelo} {ficha?.veiculo_ano} - {ficha?.veiculo_cor}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="opacity-75">Valor do Veículo</p>
                <p className="font-bold">{formatCurrency(ficha?.valor_veiculo || 0)}</p>
              </div>
              <div>
                <p className="opacity-75">Entrada</p>
                <p className="font-bold">{formatCurrency(ficha?.valor_entrada || 0)}</p>
              </div>
              <div>
                <p className="opacity-75">Parcelas</p>
                <p className="font-bold">{ficha?.parcelas}x de {formatCurrency(ficha?.valor_parcela || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-16 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Data */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input value={ficha?.nome_completo || ''} disabled className="bg-muted" />
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input value={ficha?.cpf || ''} disabled className="bg-muted" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input value={ficha?.data_nascimento || ''} disabled className="bg-muted" />
                </div>
                <div>
                  <Label>RG *</Label>
                  <Input 
                    value={formData.rg} 
                    onChange={(e) => handleInputChange('rg', e.target.value)}
                    placeholder="Digite seu RG"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Mãe</Label>
                  <Input value={ficha?.nome_mae || ''} disabled className="bg-muted" />
                </div>
                <div>
                  <Label>Nome do Pai *</Label>
                  <Input 
                    value={formData.nome_pai} 
                    onChange={(e) => handleInputChange('nome_pai', e.target.value)}
                    placeholder="Nome completo do pai"
                  />
                </div>
              </div>

              <div>
                <Label>Estado Civil *</Label>
                <Select value={formData.estado_civil} onValueChange={(v) => handleInputChange('estado_civil', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="uniao_estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone Principal *</Label>
                  <Input 
                    value={formData.telefone} 
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <Label>Telefone Alternativo</Label>
                  <Input 
                    value={formData.telefone_alternativo} 
                    onChange={(e) => handleInputChange('telefone_alternativo', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <Label>E-mail *</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <Button onClick={handleSubmitStep} disabled={submitting} className="w-full">
                {submitting ? 'Salvando...' : 'Continuar'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Address and Reference */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço e Referência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>CEP *</Label>
                  <Input 
                    value={formData.cep} 
                    onChange={(e) => {
                      handleInputChange('cep', e.target.value);
                      if (e.target.value.replace(/\D/g, '').length === 8) {
                        buscarCep(e.target.value);
                      }
                    }}
                    placeholder="00000-000"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Endereço *</Label>
                  <Input 
                    value={formData.endereco} 
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    placeholder="Rua, Avenida..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Número *</Label>
                  <Input 
                    value={formData.numero} 
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Complemento</Label>
                  <Input 
                    value={formData.complemento} 
                    onChange={(e) => handleInputChange('complemento', e.target.value)}
                    placeholder="Apto, Bloco..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Bairro *</Label>
                  <Input 
                    value={formData.bairro} 
                    onChange={(e) => handleInputChange('bairro', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Cidade *</Label>
                  <Input 
                    value={formData.cidade} 
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Estado *</Label>
                  <Select value={formData.estado} onValueChange={(v) => handleInputChange('estado', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosBrasileiros.map(uf => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3">Contato de Referência</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nome da Referência *</Label>
                    <Input 
                      value={formData.referencia_nome} 
                      onChange={(e) => handleInputChange('referencia_nome', e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label>Telefone da Referência *</Label>
                    <Input 
                      value={formData.referencia_telefone} 
                      onChange={(e) => handleInputChange('referencia_telefone', e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Grau de Parentesco *</Label>
                  <Select value={formData.referencia_parentesco} onValueChange={(v) => handleInputChange('referencia_parentesco', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pai_mae">Pai/Mãe</SelectItem>
                      <SelectItem value="irmao">Irmão(ã)</SelectItem>
                      <SelectItem value="conjuge">Cônjuge</SelectItem>
                      <SelectItem value="filho">Filho(a)</SelectItem>
                      <SelectItem value="amigo">Amigo(a)</SelectItem>
                      <SelectItem value="colega_trabalho">Colega de Trabalho</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handleSubmitStep} disabled={submitting} className="flex-1">
                  {submitting ? 'Salvando...' : 'Continuar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Bank and Work Info */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Dados Bancários e Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Bancos que você possui conta *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {bancosBrasileiros.map(banco => (
                    <div key={banco} className="flex items-center space-x-2">
                      <Checkbox 
                        id={banco}
                        checked={formData.bancos_possui.includes(banco)}
                        onCheckedChange={() => handleBancoToggle(banco)}
                      />
                      <label htmlFor={banco} className="text-sm">{banco}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Banco Preferido para Depósito *</Label>
                  <Select value={formData.banco_preferido} onValueChange={(v) => handleInputChange('banco_preferido', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.bancos_possui.map(banco => (
                        <SelectItem key={banco} value={banco}>{banco}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo de Conta *</Label>
                  <Select value={formData.tipo_conta} onValueChange={(v) => handleInputChange('tipo_conta', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corrente">Conta Corrente</SelectItem>
                      <SelectItem value="poupanca">Conta Poupança</SelectItem>
                      <SelectItem value="salario">Conta Salário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Informações Profissionais
                </h3>

                <div>
                  <Label>Tipo de Contrato *</Label>
                  <Select value={formData.tipo_contrato} onValueChange={(v) => handleInputChange('tipo_contrato', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ / MEI</SelectItem>
                      <SelectItem value="autonomo">Autônomo</SelectItem>
                      <SelectItem value="aposentado">Aposentado</SelectItem>
                      <SelectItem value="servidor">Servidor Público</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Nome da Empresa *</Label>
                    <Input 
                      value={formData.empresa_nome} 
                      onChange={(e) => handleInputChange('empresa_nome', e.target.value)}
                      placeholder="Razão social ou nome fantasia"
                    />
                  </div>
                  <div>
                    <Label>CNPJ da Empresa</Label>
                    <Input 
                      value={formData.empresa_cnpj} 
                      onChange={(e) => handleInputChange('empresa_cnpj', e.target.value)}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Cargo / Função *</Label>
                    <Input 
                      value={formData.cargo} 
                      onChange={(e) => handleInputChange('cargo', e.target.value)}
                      placeholder="Seu cargo atual"
                    />
                  </div>
                  <div>
                    <Label>Tempo de Serviço *</Label>
                    <Select value={formData.tempo_servico} onValueChange={(v) => handleInputChange('tempo_servico', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="menos_6_meses">Menos de 6 meses</SelectItem>
                        <SelectItem value="6_meses_1_ano">6 meses a 1 ano</SelectItem>
                        <SelectItem value="1_2_anos">1 a 2 anos</SelectItem>
                        <SelectItem value="2_5_anos">2 a 5 anos</SelectItem>
                        <SelectItem value="mais_5_anos">Mais de 5 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Renda Mensal *</Label>
                  <Input 
                    type="number"
                    value={formData.renda_mensal} 
                    onChange={(e) => handleInputChange('renda_mensal', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handleSubmitStep} disabled={submitting} className="flex-1">
                  {submitting ? 'Salvando...' : 'Continuar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Envio de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tipo de Documento *</Label>
                <Select value={formData.tipo_documento} onValueChange={(v) => handleInputChange('tipo_documento', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNH">CNH (Carteira de Motorista)</SelectItem>
                    <SelectItem value="RG">RG (Identidade)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-2">
                    {formData.tipo_documento} - FRENTE
                  </p>
                  {documentosEnviados.frente ? (
                    <div className="text-green-500 flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Enviado
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="doc-frente"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDocumentoFrente(file);
                            handleUploadDocument('frente', file);
                          }
                        }}
                      />
                      <label htmlFor="doc-frente">
                        <Button variant="outline" size="sm" asChild disabled={uploadingFrente}>
                          <span>{uploadingFrente ? 'Enviando...' : 'Selecionar Arquivo'}</span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>

                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-2">
                    {formData.tipo_documento} - VERSO
                  </p>
                  {documentosEnviados.verso ? (
                    <div className="text-green-500 flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Enviado
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="doc-verso"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDocumentoVerso(file);
                            handleUploadDocument('verso', file);
                          }
                        }}
                      />
                      <label htmlFor="doc-verso">
                        <Button variant="outline" size="sm" asChild disabled={uploadingVerso}>
                          <span>{uploadingVerso ? 'Enviando...' : 'Selecionar Arquivo'}</span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Tire uma foto nítida do documento, sem reflexos ou cortes.
                Formatos aceitos: JPG, PNG ou PDF (máx. 5MB)
              </p>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Voltar
                </Button>
                <Button 
                  onClick={handleSubmitStep} 
                  disabled={submitting || !documentosEnviados.frente || !documentosEnviados.verso} 
                  className="flex-1"
                >
                  {submitting ? 'Finalizando...' : 'Finalizar Cadastro'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}