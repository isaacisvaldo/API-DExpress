import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfessionalModule } from './professional/professional.module';
import { CityModule } from './location/city/city.module';
import { DistrictModule } from './location/district/district.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [AuthModule, UsersModule, ProfessionalModule, CityModule, DistrictModule, LocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
