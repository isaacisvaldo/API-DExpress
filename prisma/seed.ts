// prisma/seed-luanda-districts.ts
import { PrismaClient } from '@prisma/client';
import { districtNames } from './seeds/distritos.seed';
import { specialtyNames } from './seeds/Specialty.seed';

const prisma = new PrismaClient();

async function main() {
  // Cria a cidade Luanda
  const luanda = await prisma.city.upsert({
    where: { name: 'Luanda' },
    update: {},
    create: { name: 'Luanda' },
  });

  // Cria os distritos
  const districtMap: Record<string, string> = {};
  for (const name of districtNames) {
    const district = await prisma.district.upsert({
      where: { name_cityId: { name, cityId: luanda.id } },
      update: {},
      create: {
        name,
        cityId: luanda.id,
      },
    });
    districtMap[name] = district.id;
  }
  console.log('✅ Cidade Luanda e distritos criados com sucesso!');

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
}

main()
  .catch((e) => {
    console.error('❌ Erro na seed de Luanda:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
