import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { ClientModule } from './client/client.module';
import { ProductModule } from './product/product.module';
import { ServiceModule } from './service/service.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    UsersModule,
    EmployeesModule,
    ClientModule,
    ProductModule,
    ServiceModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
