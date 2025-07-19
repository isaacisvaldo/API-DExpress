// src/seeder/admin.seeder.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@dexpress.com';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASS || 'Admin123!';
    
    const existingAdmin = await this.prisma.adminUser.findUnique({
      where: { email: defaultEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await this.prisma.adminUser.create({
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
            create: [
              { name: 'FULL_ACCESS' },
            ],
          },
        },
      });
      console.log(`✅ Admin padrão criado: ${defaultEmail} / ${defaultPassword}`);
    } else {
      console.log(`ℹ️ Admin padrão já existe: ${defaultEmail}`);
    }
  }
}
