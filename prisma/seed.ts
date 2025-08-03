import { PrismaClient } from '@prisma/client';
import { districtNames } from './seeds/distritos.seed';
import { specialtyNames } from './seeds/Specialty.seed';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Cria a cidade Luanda
  const luanda = await prisma.city.upsert({
    where: { name: 'Luanda' },
    update: {},
    create: { name: 'Luanda' },
  });

  // Cria os distritos de Luanda
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

  // Cria as especialidades
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

  // Cria o admin padrão
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
        gender: 'MALE',
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
    console.error('❌ Erro na seed de Luanda:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
