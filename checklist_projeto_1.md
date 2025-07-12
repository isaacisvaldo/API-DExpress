## ✅ Checklist de Funcionalidades da Aplicação

### 🔗 Base de Dados (Modelos e Relacionamentos)
- [x] Criar modelo `JobApplication` com todos os campos definidos
- [x] Criar modelo `Professional` com campos derivados da candidatura
- [x] Criar modelos de `City`, `District` e `Location` com relações
- [x] Criar enum `JobApplicationStatus`
- [x] Criar enum `DesiredPosition`
- [x] Criar enum `GeneralAvailability`, `ExperienceLevel`, `Weekday`
- [x] Criar modelo `Specialty` com relação com `Professional`
- [x] Criar modelo `Availability` com horários e dias
- [x] Adicionar campo `status` em `JobApplication`
- [x] Configurar relacionamento entre `Location` e `Professional`/`JobApplication`

### 👨‍💼 Gestão de Candidatura (`JobApplication`)
- [ ] Criar DTO de criação (`CreateJobApplicationDto`)
- [ ] Criar DTO de atualização (`UpdateJobApplicationDto`)
- [ ] Criar controller com rotas:
  - [ ] `POST /job-application` – Criar candidatura
  - [ ] `GET /job-application` – Listar candidaturas
  - [ ] `GET /job-application/:id` – Buscar candidatura por ID
  - [ ] `PATCH /job-application/:id` – Atualizar candidatura
  - [ ] `DELETE /job-application/:id` – Remover candidatura
- [ ] Adicionar filtro por status de candidatura
- [ ] Adicionar validações com `class-validator`
- [ ] Testar persistência da localização no momento do cadastro

### 👩‍🔧 Gestão de Profissionais (`Professional`)
- [ ] Criar rota de criação de profissional a partir de uma candidatura aprovada
- [ ] Migrar dados relevantes da `JobApplication` para `Professional`
- [ ] Definir `availabilityType`, `experienceLevel`, `specialties` e `availability` no profissional
- [ ] Criar endpoints:
  - [ ] `POST /professionals` – Criar profissional
  - [ ] `GET /professionals` – Listar profissionais com filtros
  - [ ] `POST /professionals/availability` – Adicionar disponibilidade
- [ ] Validar os dados com DTO e Swagger
- [ ] Relacionar profissional com localização

### 📍 Localização
- [ ] Criar seed para:
  - [ ] Cidades (`City`)
  - [ ] Distritos (`District`)
  - [ ] Localizações (`Location`)
- [ ] Associar localização ao cadastrar profissional ou candidatura
- [ ] Permitir filtragem por cidade e distrito

### 📚 Especialidades e Disponibilidade
- [ ] Criar seed para `Specialty`
- [ ] Permitir múltiplas especialidades ao cadastrar profissional
- [ ] Definir `Availability` com `weekday`, `startTime`, `endTime`

### ✉️ Notificações por E-mail
- [ ] Reaproveitar API de envio de e-mails existente
- [ ] Enviar notificação ao candidato quando for aprovado
- [ ] Incluir nome, cargo aprovado e data estimada de início no e-mail

### ⚙️ Miscellaneous / Outros
- [ ] Adicionar Swagger para todas as rotas (com exemplos)
- [ ] Adicionar validações e mensagens amigáveis em todos os DTOs
- [ ] Adicionar logs de sucesso/erro ao executar seeds
- [ ] Criar scripts de seed com:
  - [ ] Cidade e Distritos (ex: Luanda)
  - [ ] Especialidades
- [ ] Testar todos os fluxos principais no Postman