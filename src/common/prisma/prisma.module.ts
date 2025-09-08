
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global() 
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- EXPORTAR para outros módulos
})
export class PrismaModule {}
