/**
 * Enum que define todas as permissões internas da aplicação.
 * Usar um enum torna as permissões fortemente tipadas, evitando erros de digitação.
 */
export enum PermissionType {
  // Gestão de Usuários
  UsersView = 'users.view',
  UsersCreate = 'users.create',
  UsersUpdate = 'users.update',
  UsersDelete = 'users.delete',

  // Gestão de Clientes e Empresas
  ClientsView = 'clients.view',
  ClientsCreate = 'clients.create',
  ClientsUpdate = 'clients.update',
  ClientsDelete = 'clients.delete',
  CompaniesView = 'companies.view',
  CompaniesCreate = 'companies.create',
  CompaniesUpdate = 'companies.update',
  CompaniesDelete = 'companies.delete',

  // Gestão de Profissionais
  ProfessionalsView = 'professionals.view',
  ProfessionalsApprove = 'professionals.approve',
  ProfessionalsUpdate = 'professionals.update',
  ProfessionalsDelete = 'professionals.delete',

  // Gestão de Candidaturas
  ApplicationsView = 'applications.view',
  ApplicationsApprove = 'applications.approve',
  ApplicationsReject = 'applications.reject',
  ApplicationsUpdateStatus = 'applications.updateStatus',

  // Gestão Financeira
  PaymentsView = 'payments.view',
  PaymentsProcess = 'payments.process',
  InvoicesView = 'invoices.view',
  InvoicesGenerate = 'invoices.generate',

  // Relatórios e Auditoria
  ReportsView = 'reports.view',
  AuditLogsView = 'audit.logs.view',

  // Configurações do Sistema
  SettingsView = 'settings.view',
  SettingsUpdate = 'settings.update',
  
  // Acesso total (meta permissão)
  FullAccess = 'full.access',
}
