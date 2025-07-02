
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, Folder, File } from 'lucide-react';

const AdminArquivos = () => {
  const arquivos = [
    { id: '1', nome: 'relatorio_janeiro.pdf', tipo: 'PDF', tamanho: '2.4 MB', data: '2024-01-15' },
    { id: '2', nome: 'comprovante_001.xml', tipo: 'XML', tamanho: '156 KB', data: '2024-01-14' },
    { id: '3', nome: 'extrato_dezembro.csv', tipo: 'CSV', tamanho: '890 KB', data: '2024-01-13' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Arquivos</h1>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Arquivo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Arquivos</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <File className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">PDFs</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <FileText className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">XMLs</p>
                <p className="text-2xl font-bold">38</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Espaço Usado</p>
                <p className="text-2xl font-bold">2.8 GB</p>
              </div>
              <Folder className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arquivos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Nome</th>
                  <th className="text-left p-4 font-medium">Tipo</th>
                  <th className="text-left p-4 font-medium">Tamanho</th>
                  <th className="text-left p-4 font-medium">Data</th>
                  <th className="text-left p-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {arquivos.map((arquivo) => (
                  <tr key={arquivo.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {arquivo.nome}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {arquivo.tipo}
                      </span>
                    </td>
                    <td className="p-4">{arquivo.tamanho}</td>
                    <td className="p-4">{arquivo.data}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">Ver</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminArquivos;
