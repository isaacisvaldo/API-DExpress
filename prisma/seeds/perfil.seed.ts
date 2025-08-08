// Define a interface para o objeto de perfil.
export interface Profile {
  id: string;
  name: string;
  label: string;
  description: string;
  permissions: string[]; 
}


export const profilesData: Profile[] = [
  {
    id: "profile_admin",
    name: "GENERAL_ADMIN",
    label: "Administrador Geral",
    description: "Acesso total ao sistema com a meta-permissão de 'Acesso Total'.",
    permissions: [
      "FULL_ACCESS", 
    ],
  },
  {
    id: "profile_operations",
    name: "OPERATIONS_MANAGER",
    label: "Gestor de Operações",
    description: "Gerencia a operação diária de usuários e profissionais, e visualiza relatórios.",
    permissions: [
      "users.view",
      "users.create",
      "users.update",
      "clients.view",
      "clients.create",
      "clients.update",
      "companies.view",
      "companies.create",
      "companies.update",
      "professionals.view",
      "professionals.approve",
      "professionals.update",
      "applications.view",
      "applications.approve",
      "applications.reject",
      "applications.updateStatus",
      "reports.view",
    ],
  },
  {
    id: "profile_hr_coordinator",
    name: "HR_COORDINATOR",
    label: "Coordenador de RH",
    description: "Gerencia o ciclo de vida dos profissionais e usuários.",
    permissions: [
      "users.view",
      "users.create",
      "users.update",
      "professionals.view",
      "professionals.approve",
      "professionals.update",
    ],
  },
  {
    id: "profile_quality_supervisor",
    name: "QUALITY_SUPERVISOR",
    label: "Supervisor de Qualidade",
    description: "Monitora e avalia a qualidade do serviço através de relatórios e dados de clientes.",
    permissions: [
      "clients.view",
      "companies.view",
      "reports.view",
    ],
  },
  {
    id: "profile_customer_assistant",
    name: "CUSTOMER_ASSISTANT",
    label: "Assistente de Cliente",
    description: "Oferece suporte ao cliente, visualizando informações de clientes e empresas.",
    permissions: [
      "clients.view",
      "companies.view",
      "reports.view",
    ],
  },
  {
    id: "profile_financial",
    name: "FINANCIAL",
    label: "Financeiro",
    description: "Gerencia pagamentos, faturas e relatórios financeiros.",
    permissions: [
      "payments.view",
      "payments.process",
      "invoices.view",
      "invoices.generate",
      "reports.view",
      "audit.logs.view",
    ],
  },
  {
    id: "profile_internal_auditor",
    name: "INTERNAL_AUDITOR",
    label: "Auditor Interno",
    description: "Realiza auditorias e verifica logs de segurança e relatórios.",
    permissions: [
      "reports.view",
      "audit.logs.view",
    ],
  },
];
