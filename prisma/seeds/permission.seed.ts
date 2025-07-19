export const internalPermissions = [
  // Gestão de Usuários
  'users.view',
  'users.create',
  'users.update',
  'users.delete',

  // Gestão de Clientes e Empresas
  'clients.view',
  'clients.create',
  'clients.update',
  'clients.delete',
  'companies.view',
  'companies.create',
  'companies.update',
  'companies.delete',

  // Gestão de Profissionais
  'professionals.view',
  'professionals.approve',
  'professionals.update',
  'professionals.delete',

  // Gestão de Candidaturas
  'applications.view',
  'applications.approve',
  'applications.reject',
  'applications.updateStatus',

  // Gestão Financeira
  'payments.view',
  'payments.process',
  'invoices.view',
  'invoices.generate',

  // Relatórios e Auditoria
  'reports.view',
  'audit.logs.view',

  // Configurações do Sistema
  'settings.view',
  'settings.update',
];
