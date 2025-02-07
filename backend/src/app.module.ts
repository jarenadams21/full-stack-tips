import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailerService } from './emailer/emailer.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EmailerService],
})
export class AppModule {}
