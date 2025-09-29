import { Global, Module } from '@nestjs/common';
import { AuditLogService } from './auditLog.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuditLogController } from './auditLog.controller';

@Global()
@Module({
  providers: [PrismaService, AuditLogService],
  controllers: [AuditLogController],
  exports: [AuditLogService], 
})
export class AuditLogModule {}
