// prisma/seed-luanda-districts.ts
import { PrismaClient } from '@prisma/client';
import { districtNames } from './seeds/distritos.seed';

const prisma = new PrismaClient();

async function main() {
  // Cria a cidade Luanda
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
      create: {
        name,
        cityId: luanda.id,
      },
    });
    districtMap[name] = district.id;
  }
  console.log('✅ Cidade Luanda, distritos criadas com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro na seed de Luanda:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
