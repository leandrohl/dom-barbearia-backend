import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { ClientModule } from './client/client.module';
import { ProductModule } from './product/product.module';
import { ServiceModule } from './service/service.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION,
      host: process.env.TYPEORM_HOST,
      port: process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    } as TypeOrmModuleOptions),
    UsersModule,
    EmployeesModule,
    ClientModule,
    ProductModule,
    ServiceModule,
    ProfileModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
