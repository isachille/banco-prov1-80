
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountBalance } from './AccountBalance';
import { QuickActions } from './QuickActions';
import { RecentTransactions } from './RecentTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Calculator, FileText, PiggyBank, TrendingUp } from 'lucide-react';

export const BankingDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Account Balance */}
      <AccountBalance />
      
      {/* Quick Actions */}
      <QuickActions />

      {/* Gift Cards Section */}
      <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Gift className="mr-2 h-5 w-5" />
            Gift Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-pink-100 text-sm mb-3">
            Presenteie quem você ama com gift cards
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/gift-cards')}
            className="bg-white/20 hover:bg-white/30 text-white border-none"
          >
            Ver Gift Cards
          </Button>
        </CardContent>
      </Card>

      {/* Financing Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">Financiamento Veicular</h3>
        
        <div className="grid grid-cols-1 gap-3">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
            onClick={() => navigate('/simulacao')}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                  <Calculator className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Simular Financiamento</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Simule seu financiamento veicular
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
            onClick={() => navigate('/propostas')}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Minhas Propostas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Histórico de propostas de financiamento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Investment Section */}
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
          onClick={() => navigate('/cofrinho')}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg mb-2 inline-block">
                <PiggyBank className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Cofrinho</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Economize para objetivos
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
          onClick={() => navigate('/investimentos')}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg mb-2 inline-block">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Investimentos</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Faça seu dinheiro render
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
};
