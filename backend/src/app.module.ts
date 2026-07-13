// src/app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ComplaintModule } from './complaint/complaint.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ComplaintModule,
    UploadModule,
    ServeStaticModule.forRoot({
      // Serve the uploads folder. In production the compiled JS resides in the dist folder,
      // so we resolve the path relative to the compiled file location.
      rootPath: join(__dirname, '..', 'uploads'),
      // The API is hosted under the '/4180' sub‑path, so static files must be served from
      // that same prefix to match the URLs returned by the upload controller.
      serveRoot: '/4180/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
