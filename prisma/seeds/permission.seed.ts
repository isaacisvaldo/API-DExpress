export const internalPermissions = [
  // Gestão de Usuários
  { name: 'users.view', label: 'Visualizar Usuários' },
  { name: 'users.create', label: 'Criar Usuários' },
  { name: 'users.update', label: 'Atualizar Usuários' },
  { name: 'users.delete', label: 'Deletar Usuários' },

  // Gestão de Clientes e Empresas
  { name: 'clients.view', label: 'Visualizar Clientes' },
  { name: 'clients.create', label: 'Criar Clientes' },
  { name: 'clients.update', label: 'Atualizar Clientes' },
  { name: 'clients.delete', label: 'Deletar Clientes' },
  { name: 'companies.view', label: 'Visualizar Empresas' },
  { name: 'companies.create', label: 'Criar Empresas' },
  { name: 'companies.update', label: 'Atualizar Empresas' },
  { name: 'companies.delete', label: 'Deletar Empresas' },

  // Gestão de Profissionais
  { name: 'professionals.view', label: 'Visualizar Profissionais' },
  { name: 'professionals.approve', label: 'Aprovar Profissionais' },
  { name: 'professionals.update', label: 'Atualizar Profissionais' },
  { name: 'professionals.delete', label: 'Deletar Profissionais' },

  // Gestão de Candidaturas
  { name: 'applications.view', label: 'Visualizar Candidaturas' },
  { name: 'applications.approve', label: 'Aprovar Candidaturas' },
  { name: 'applications.reject', label: 'Rejeitar Candidaturas' },
  { name: 'applications.updateStatus', label: 'Atualizar Status de Candidatura' },

  // Gestão Financeira
  { name: 'payments.view', label: 'Visualizar Pagamentos' },
  { name: 'payments.process', label: 'Processar Pagamentos' },
  { name: 'invoices.view', label: 'Visualizar Faturas' },
  { name: 'invoices.generate', label: 'Gerar Faturas' },

  // Relatórios e Auditoria
  { name: 'reports.view', label: 'Visualizar Relatórios' },
  { name: 'audit.logs.view', label: 'Visualizar Logs de Auditoria' },

  // Configurações do Sistema
  { name: 'settings.view', label: 'Visualizar Configurações' },
  { name: 'settings.update', label: 'Atualizar Configurações' },
  
  // Acesso total (meta permissão)
  { name: 'FULL_ACCESS', label: 'Acesso Total' },
];