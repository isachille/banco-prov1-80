import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  FileText, 
  Search, 
  Eye, 
  Download, 
  Copy, 
  ExternalLink,
  User,
  MapPin,
  Briefcase,
  Building,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import MobileLayout from '@/components/MobileLayout';

interface Ficha {
  id: string;
  token_acesso: string;
  expira_em: string;
  status: string;
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
  rg: string;
  data_nascimento: string;
  nome_mae: string;
  nome_pai: string;
  estado_civil: string;
  telefone: string;
  telefone_alternativo: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia_nome: string;
  referencia_telefone: string;
  referencia_parentesco: string;
  bancos_possui: string[];
  banco_preferido: string;
  tipo_conta: string;
  empresa_nome: string;
  empresa_cnpj: string;
  cargo: string;
  tempo_servico: string;
  renda_mensal: number;
  tipo_contrato: string;
  tipo_documento: string;
  documento_frente_url: string;
  documento_verso_url: string;
  created_at: string;
  preenchido_em: string;
}

export default function FichasAdmin() {
  const navigate = useNavigate();
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFicha, setSelectedFicha] = useState<Ficha | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchFichas();
  }, []);

  const fetchFichas = async () => {
    try {
      const { data, error } = await supabase
        .from('fichas_cadastrais')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFichas((data as unknown as Ficha[]) || []);
    } catch (err) {
      console.error('Error fetching fichas:', err);
      toast.error('Erro ao carregar fichas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      'pendente': { variant: 'secondary', label: 'Pendente' },
      'preenchido': { variant: 'outline', label: 'Preenchido' },
      'documentos_pendentes': { variant: 'default', label: 'Docs Pendentes' },
      'completo': { variant: 'default', label: 'Completo' },
      'expirado': { variant: 'destructive', label: 'Expirado' }
    };
    const config = variants[status] || variants['pendente'];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/ficha-cadastral/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado!');
  };

  const openLink = (token: string) => {
    const link = `${window.location.origin}/ficha-cadastral/${token}`;
    window.open(link, '_blank');
  };

  const downloadPDF = async (ficha: Ficha) => {
    const element = document.getElementById('ficha-pdf-content');
    if (!element) return;

    try {
      toast.loading('Gerando PDF...');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`ficha-cadastral-${ficha.cpf || ficha.id}.pdf`);
      
      toast.dismiss();
      toast.success('PDF gerado com sucesso!');
    } catch (err) {
      toast.dismiss();
      toast.error('Erro ao gerar PDF');
    }
  };

  const filteredFichas = fichas.filter(f => 
    f.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cpf?.includes(searchTerm) ||
    f.veiculo_modelo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const content = (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fichas Cadastrais</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CPF ou veículo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredFichas.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma ficha cadastral encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFichas.map((ficha) => (
                <TableRow key={ficha.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ficha.nome_completo || 'Aguardando'}</p>
                      <p className="text-sm text-muted-foreground">{ficha.cpf || '-'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{ficha.veiculo_marca} {ficha.veiculo_modelo}</p>
                    <p className="text-sm text-muted-foreground">{ficha.veiculo_ano}</p>
                  </TableCell>
                  <TableCell>{getStatusBadge(ficha.status)}</TableCell>
                  <TableCell>{formatDate(ficha.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyLink(ficha.token_acesso)}
                        title="Copiar link"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openLink(ficha.token_acesso)}
                        title="Abrir link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedFicha(ficha);
                          setShowDialog(true);
                        }}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {ficha.status === 'completo' && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedFicha(ficha);
                            setTimeout(() => downloadPDF(ficha), 100);
                          }}
                          title="Baixar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ficha Cadastral - {selectedFicha?.nome_completo}</DialogTitle>
          </DialogHeader>
          
          {selectedFicha && (
            <div id="ficha-pdf-content" className="space-y-6 p-4 bg-white text-black">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-xl font-bold">FICHA CADASTRAL - FINANCIAMENTO</h2>
                <p className="text-sm text-gray-600">
                  Gerado em: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Vehicle Info */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Dados do Veículo
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Marca/Modelo</p>
                    <p className="font-medium">{selectedFicha.veiculo_marca} {selectedFicha.veiculo_modelo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ano</p>
                    <p className="font-medium">{selectedFicha.veiculo_ano}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cor</p>
                    <p className="font-medium">{selectedFicha.veiculo_cor}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-medium">{formatCurrency(selectedFicha.valor_veiculo)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entrada</p>
                    <p className="font-medium">{formatCurrency(selectedFicha.valor_entrada)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parcelas</p>
                    <p className="font-medium">{selectedFicha.parcelas}x de {formatCurrency(selectedFicha.valor_parcela)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Info */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{selectedFicha.nome_completo || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CPF</p>
                    <p className="font-medium">{selectedFicha.cpf || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RG</p>
                    <p className="font-medium">{selectedFicha.rg || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">{formatDate(selectedFicha.data_nascimento)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nome da Mãe</p>
                    <p className="font-medium">{selectedFicha.nome_mae || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nome do Pai</p>
                    <p className="font-medium">{selectedFicha.nome_pai || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estado Civil</p>
                    <p className="font-medium">{selectedFicha.estado_civil || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefone</p>
                    <p className="font-medium">{selectedFicha.telefone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">E-mail</p>
                    <p className="font-medium">{selectedFicha.email || '-'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-medium">
                    {selectedFicha.endereco}, {selectedFicha.numero}
                    {selectedFicha.complemento && ` - ${selectedFicha.complemento}`}
                  </p>
                  <p>{selectedFicha.bairro} - {selectedFicha.cidade}/{selectedFicha.estado}</p>
                  <p>CEP: {selectedFicha.cep}</p>
                  
                  {selectedFicha.referencia_nome && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-muted-foreground">Referência</p>
                      <p className="font-medium">
                        {selectedFicha.referencia_nome} ({selectedFicha.referencia_parentesco}) - {selectedFicha.referencia_telefone}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Work Info */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Dados Profissionais
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tipo de Contrato</p>
                    <p className="font-medium">{selectedFicha.tipo_contrato || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Empresa</p>
                    <p className="font-medium">{selectedFicha.empresa_nome || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CNPJ</p>
                    <p className="font-medium">{selectedFicha.empresa_cnpj || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cargo</p>
                    <p className="font-medium">{selectedFicha.cargo || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tempo de Serviço</p>
                    <p className="font-medium">{selectedFicha.tempo_servico || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Renda Mensal</p>
                    <p className="font-medium">{formatCurrency(selectedFicha.renda_mensal)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Info */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Dados Bancários
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Bancos que possui</p>
                      <p className="font-medium">{selectedFicha.bancos_possui?.join(', ') || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Banco Preferido</p>
                      <p className="font-medium">{selectedFicha.banco_preferido || '-'} ({selectedFicha.tipo_conta || '-'})</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Status */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documentos Enviados
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {selectedFicha.documento_frente_url ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        <span>{selectedFicha.tipo_documento || 'Documento'} Frente</span>
                      </div>
                      {selectedFicha.documento_frente_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const { data } = await supabase.storage
                              .from('fichas-documentos')
                              .createSignedUrl(selectedFicha.documento_frente_url, 3600);
                            if (data?.signedUrl) {
                              window.open(data.signedUrl, '_blank');
                            } else {
                              toast.error('Erro ao baixar documento');
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {selectedFicha.documento_verso_url ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        <span>{selectedFicha.tipo_documento || 'Documento'} Verso</span>
                      </div>
                      {selectedFicha.documento_verso_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const { data } = await supabase.storage
                              .from('fichas-documentos')
                              .createSignedUrl(selectedFicha.documento_verso_url, 3600);
                            if (data?.signedUrl) {
                              window.open(data.signedUrl, '_blank');
                            } else {
                              toast.error('Erro ao baixar documento');
                            }
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Botão para baixar todos os documentos */}
                  {(selectedFicha.documento_frente_url || selectedFicha.documento_verso_url) && (
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={async () => {
                        toast.info('Baixando documentos...');
                        if (selectedFicha.documento_frente_url) {
                          const { data } = await supabase.storage
                            .from('fichas-documentos')
                            .createSignedUrl(selectedFicha.documento_frente_url, 3600);
                          if (data?.signedUrl) {
                            const link = document.createElement('a');
                            link.href = data.signedUrl;
                            link.download = `${selectedFicha.nome_completo || 'documento'}_frente`;
                            link.click();
                          }
                        }
                        if (selectedFicha.documento_verso_url) {
                          setTimeout(async () => {
                            const { data } = await supabase.storage
                              .from('fichas-documentos')
                              .createSignedUrl(selectedFicha.documento_verso_url, 3600);
                            if (data?.signedUrl) {
                              const link = document.createElement('a');
                              link.href = data.signedUrl;
                              link.download = `${selectedFicha.nome_completo || 'documento'}_verso`;
                              link.click();
                            }
                          }, 500);
                        }
                        toast.success('Documentos baixados!');
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Todos os Documentos
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 pt-4 border-t">
                <p>Ficha preenchida em: {selectedFicha.preenchido_em ? formatDate(selectedFicha.preenchido_em) : 'Aguardando preenchimento'}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Fechar
            </Button>
            {selectedFicha?.status === 'completo' && (
              <Button onClick={() => downloadPDF(selectedFicha)}>
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return <MobileLayout>{content}</MobileLayout>;
}