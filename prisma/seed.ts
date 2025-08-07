import { PrismaClient } from '@prisma/client';
import { districtNames } from './seeds/distritos.seed';
import { specialtyNames } from './seeds/Specialty.seed';
import { desiredPositionData } from './seeds/DesiredPosition.seed';
import { genderData } from './seeds/Gender.seed';
import { maritalStatusData } from './seeds/MaritalStatus.seed';
import { highestDegreeData } from './seeds/HighestDegree.seed';
import { courseData } from './seeds/Course.seed';
import { languageData } from './seeds/Language.seed';
import { skillData } from './seeds/Skill.seed';

import * as bcrypt from 'bcrypt';
import { sectorNames } from './seeds/Sector.seed';

const prisma = new PrismaClient();

async function main() {
  // --- SEED: CIDADE E DISTRITOS ---
  const luanda = await prisma.city.upsert({
    where: { name: 'Luanda' },
    update: {},
    create: { name: 'Luanda' },
  });

  const districtMap: Record<string, string> = {};
  for (const name of districtNames) {
    const district = await prisma.district.upsert({
      where: { name_cityId: { name, cityId: luanda.id } },
      update: {},
      create: { name, cityId: luanda.id },
    });
    districtMap[name] = district.id;
  }
  console.log('✅ Cidade "Luanda" e distritos criados com sucesso!');

  // --- SEED: ESPECIALIDADES ---
  const specialtyMap: Record<string, string> = {};
  for (const name of specialtyNames) {
    const specialty = await prisma.specialty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    specialtyMap[name] = specialty.id;
  }
  console.log('✅ Especialidades criadas com sucesso!');

  // --- SEED: SETORES DE EMPRESA ---
  const sectorMap: Record<string, string> = {};
  for (const name of sectorNames) {
    const sector = await prisma.sector.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    sectorMap[name] = sector.id;
  }
  console.log('✅ Setores de empresa criados com sucesso!');

  // --- SEED: POSIÇÕES DESEJADAS ---
  const desiredPositionMap: Record<string, string> = {};
  for (const data of desiredPositionData) {
    const position = await prisma.desiredPosition.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    desiredPositionMap[data.name] = position.id;
  }
  console.log('✅ Posições Desejadas criadas com sucesso!');

  // --- SEED: GÊNEROS ---
  const genderMap: Record<string, string> = {};
  for (const data of genderData) {
    const gender = await prisma.gender.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    genderMap[data.name] = gender.id;
  }
  console.log('✅ Gêneros criados com sucesso!');

  // --- SEED: ESTADOS CIVIS ---
  const maritalStatusMap: Record<string, string> = {};
  for (const data of maritalStatusData) {
    const status = await prisma.maritalStatus.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    maritalStatusMap[data.name] = status.id;
  }
  console.log('✅ Estados Civis criados com sucesso!');

  // --- SEED: GRAUS ACADÊMICOS ---
  const highestDegreeMap: Record<string, string> = {};
  for (const data of highestDegreeData) {
    const degree = await prisma.highestDegree.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    highestDegreeMap[data.name] = degree.id;
  }
  console.log('✅ Graus Acadêmicos criados com sucesso!');

  // --- SEED: CURSOS ---
  const courseMap: Record<string, string> = {};
  for (const data of courseData) {
    const course = await prisma.course.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    courseMap[data.name] = course.id;
  }
  console.log('✅ Cursos criados com sucesso!');

  // --- SEED: IDIOMAS ---
  const languageMap: Record<string, string> = {};
  for (const data of languageData) {
    const language = await prisma.language.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    languageMap[data.name] = language.id;
  }
  console.log('✅ Idiomas criados com sucesso!');

  // --- SEED: HABILIDADES ---
  const skillMap: Record<string, string> = {};
  for (const data of skillData) {
    const skill = await prisma.skill.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    skillMap[data.name] = skill.id;
  }
  console.log('✅ Habilidades criadas com sucesso!');

  // --- SEED: DISPONIBILIDADE GERAL ---
  const availabilityMap: Record<string, string> = {};
  for (const data of generalAvailabilityData) {
    const availability = await prisma.generalAvailability.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    availabilityMap[data.name] = availability.id;
  }
  console.log('✅ Tipos de disponibilidade geral criados com sucesso!');

  // --- SEED: NÍVEIS DE EXPERIÊNCIA ---
  const experienceLevelMap: Record<string, string> = {};
  for (const data of experienceLevelData) {
    const level = await prisma.experienceLevel.upsert({
      where: { name: data.name },
      update: {},
      create: data,
    });
    experienceLevelMap[data.name] = level.id;
  }
  console.log('✅ Níveis de experiência criados com sucesso!');

  // --- SEED: ADMIN PADRÃO ---
  const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@dexpress.com').trim();
  const defaultPassword = (process.env.DEFAULT_ADMIN_PASS || 'Admin123!').trim();

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: defaultEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await prisma.adminUser.create({
      data: {
        name: 'Super Admin',
        numberphone: '900000000',
        identityNumber: '0000000000',
        genderId: genderMap['MALE'],
        birthDate: new Date('1990-01-01'),
        email: defaultEmail,
        password: hashedPassword,
        role: 'GENERAL_ADMIN',
        permissions: {
          create: [{ name: 'FULL_ACCESS' }],
        },
      },
    });

    console.log(`✅ Admin padrão criado: ${defaultEmail} / ${defaultPassword}`);
  } else {
    console.log(`ℹ️ Admin padrão já existe: ${defaultEmail}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro na seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
