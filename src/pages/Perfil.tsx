
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Camera, Mail, Phone, Lock, Key, User } from 'lucide-react';

const Perfil = () => {
  const [userData, setUserData] = useState({
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    avatar: ''
  });

  const [isEditing, setIsEditing] = useState({
    nome: false,
    email: false,
    telefone: false
  });

  const [newValues, setNewValues] = useState({
    nome: userData.nome,
    email: userData.email,
    telefone: userData.telefone
  });

  const handleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    if (isEditing[field]) {
      // Salvar as alterações
      setUserData(prev => ({
        ...prev,
        [field]: newValues[field]
      }));
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} atualizado com sucesso!`);
    }
  };

  const handleInputChange = (field: keyof typeof newValues, value: string) => {
    setNewValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = () => {
    toast.info('Redirecionando para alteração de senha...');
    // Aqui você implementaria a lógica para mudança de senha
  };

  const handleChangePIN = () => {
    toast.info('Redirecionando para alteração de PIN...');
    // Aqui você implementaria a lógica para mudança de PIN
  };

  const handleAvatarChange = () => {
    toast.info('Funcionalidade de upload de foto em desenvolvimento');
    // Aqui você implementaria o upload de foto
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">Meu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="text-2xl">
                  {userData.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={handleAvatarChange}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Clique no ícone para alterar sua foto</p>
          </div>

          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Informações Pessoais</h3>
            
            {/* Nome */}
            <div className="flex items-center space-x-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="nome">Nome Completo</Label>
                {isEditing.nome ? (
                  <Input
                    id="nome"
                    value={newValues.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{userData.nome}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('nome')}
              >
                {isEditing.nome ? 'Salvar' : 'Editar'}
              </Button>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="email">E-mail</Label>
                {isEditing.email ? (
                  <Input
                    id="email"
                    type="email"
                    value={newValues.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{userData.email}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('email')}
              >
                {isEditing.email ? 'Salvar' : 'Editar'}
              </Button>
            </div>

            {/* Telefone */}
            <div className="flex items-center space-x-4">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <Label htmlFor="telefone">Telefone</Label>
                {isEditing.telefone ? (
                  <Input
                    id="telefone"
                    value={newValues.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-foreground font-medium mt-1">{userData.telefone}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit('telefone')}
              >
                {isEditing.telefone ? 'Salvar' : 'Editar'}
              </Button>
            </div>
          </div>

          {/* Segurança */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-foreground mb-4">Segurança</h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleChangePassword}
              >
                <Lock className="w-5 h-5 mr-3" />
                Alterar Senha
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleChangePIN}
              >
                <Key className="w-5 h-5 mr-3" />
                Alterar PIN de Transação
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
