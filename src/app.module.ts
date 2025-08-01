import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { JobApplicationModule } from './module/job-application/job-application.module';
import { CityModule } from './module/location/city/city.module';
import { DistrictModule } from './module/location/district/district.module';
import { LocationModule } from './module/location/location.module';
import { ProfessionalModule } from './module/professional/professional.module';
import { SpecialtyModule } from './module/specialties/specialties.module';
import { AdminModule } from './module/users/admin/admin.module';
import { ClientsModule } from './module/users/clients/clients.module';
import { CompanyModule } from './module/users/company/company.module';
import { UsersModule } from './module/users/users.module';
import { UsersService } from './module/users/users.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AdminAuthModule } from './module/users/admin/admin-auth/admin-auth.module';
import { AdminSeeder } from 'prisma/seeds/admin.seeder';
import { EmailController } from './module/Email/email.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
MailerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    transport: {
      host: config.get<string>('MAIL_HOST'),
      port: config.get<number>('MAIL_PORT'),
      secure: config.get<string>('MAIL_SECURE') === 'true', 
      auth: {
        user: config.get<string>('MAIL_USER'),
        pass: config.get<string>('MAIL_PASS'),
      },
    },
    defaults: {
      from: `"Suporte DExpress" <${config.get<string>('MAIL_USER')}>`,
    },
  }),
}),

    AuthModule,
    ProfessionalModule,
    CityModule,
    DistrictModule,
    LocationModule,
    SpecialtyModule,
    JobApplicationModule,
    ClientsModule,
    CompanyModule,
    AdminModule,
    UsersModule,
    AdminAuthModule,
    PrismaModule,
  ],
  controllers: [AppController, EmailController],
  providers: [AppService, JobApplicationModule, UsersService,AdminSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly adminSeeder: AdminSeeder) {}

  async onModuleInit() {
    await this.adminSeeder.seed();
  }
}
