import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailerService } from './emailer/emailer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/test-email')
  testEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.emailService.sendEmail(
      sendEmailDto.recipients,
      sendEmailDto.subject,
      sendEmailDto.templateName,
    );
  }
}
