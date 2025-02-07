import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  SendRawEmailCommand,
  SendRawEmailCommandInput,
  SESClient,
} from '@aws-sdk/client-ses';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import MailComposer = require('nodemailer/lib/mail-composer');
import * as dotenv from 'dotenv';
import { assert } from 'console';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

@Injectable()
export class EmailerService {
  private readonly logger = new Logger(EmailerService.name, {
    timestamp: true,
  });
  private readonly SESClient: SESClient;
  private readonly fromEmail: string;

  constructor() {
    assert(process.env.AWS_SES_ACCESS_KEY_ID !== undefined, 'placeholder');
    assert(process.env.AWS_SES_SECRET_ACCESS_KEY !== undefined, 'placeholder');
    assert(process.env.AWS_SES_SENDER_EMAIL !== undefined, 'placeholder');

    this.SESClient = new SESClient({
      credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_SES_REGION,
    });
    this.fromEmail = process.env.AWS_SES_SENDER_EMAIL!;
  }

  async sendEmail(recipients: string[], subject: string, templateName: string) {
    const templateBody = this.loadEmailTemplate(templateName);
    if (templateBody === null) {
      throw new BadRequestException(
        `Requested template ${templateName} does not exist`,
      );
    }

    // todo: fill in template with content

    const command = await this.sendEmailCommand(
      recipients,
      subject,
      templateBody,
    );

    const result = await this.SESClient.send(command);

    this.logger.log(result);
  }

  private loadEmailTemplate(templateName: string): string | null {
    const filePath = path.join(__dirname, 'templates', templateName);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    return fs.readFileSync(filePath, 'utf-8');
  }

  private async sendEmailCommand(
    recipients: string[],
    subject: string,
    bodyHTML: string | Buffer,
  ) {
    const mailerData = {
      from: this.fromEmail,
      to: recipients,
      subject: subject,
      html: bodyHTML,
    };

    const rawData = await new MailComposer(mailerData).compile().build();

    const commandInput: SendRawEmailCommandInput = {
      Source: this.fromEmail,
      // This will send a single email out to all recipients, collectively
      // i.e. all recipients will be able to see everyone else
      Destinations: recipients,
      RawMessage: {
        Data: rawData,
      },
    };

    return new SendRawEmailCommand(commandInput);
  }
}
