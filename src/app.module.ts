import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobApplicationModule } from './module/job-application/job-application.module';
import { CityModule } from './module/shared/location/city/city.module';
import { DistrictModule } from './module/shared/location/district/district.module';
import { LocationModule } from './module/shared/location/location.module';
import { ProfessionalModule } from './module/professional/professional.module';
import { SpecialtyModule } from './module/shared/specialties/specialties.module';
import { AdminModule } from './module/users/admin/admin.module';
import { ClientsModule } from './module/users/clients/clients.module';
import { CompanyModule } from './module/users/company/company.module';
import { UsersModule } from './module/users/users.module';
import { UsersService } from './module/users/users.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AdminAuthModule } from './module/users/admin/admin-auth/admin-auth.module';
import { EmailController } from './module/shared/Email/email.controller';
import { UploadModule } from './module/shared/upload/upload.module';
import { DesiredPositionModule } from './module/shared/desired-position/desired-position.module';
import { GenderModule } from './module/shared/gender/gender.module';
import { MaritalStatusModule } from './module/shared/marital-status/marital-status.module';
import { HighestDegreeModule } from './module/shared/highest-degree/highest-degree.module';
import { CourseModule } from './module/shared/course/course.module';
import { LanguageModule } from './module/shared/language/language.module';
import { SkillModule } from './module/shared/skill/skill.module';
import { AuthModule } from './module/shared/auth/auth.module';
import { DashboardModule } from './module/dashboard/dashboard.module';

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
    UploadModule,
    DesiredPositionModule,
    GenderModule,
    MaritalStatusModule,
    HighestDegreeModule,
    CourseModule,
    LanguageModule,
    SkillModule,
    DashboardModule,
  ],
  controllers: [AppController, EmailController],
  providers: [AppService, JobApplicationModule, UsersService],
})
export class AppModule {

}
