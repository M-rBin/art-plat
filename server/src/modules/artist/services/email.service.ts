import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  nodeEnv: string;
}

/**
 * 艺术家邮件通知服务
 *
 * 仅负责邮件渲染与发送；注册确认 token 的生成、存储和校验由认证服务处理。
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter?: Transporter;

  constructor(private readonly configService: ConfigService) {}

  /**
   * 发送注册确认邮件
   *
   * 开发环境或未配置 SMTP 时降级为日志输出确认链接，便于本地联调。
   */
  async sendVerificationEmail(email: string, verifyUrl: string): Promise<void> {
    const config = this.getSmtpConfig();

    if (this.shouldSkipSmtp(config)) {
      this.logger.log(`非生产环境跳过真实邮件发送，收件人=${email}，确认链接=${this.maskVerifyUrl(verifyUrl)}`);
      return;
    }

    try {
      await this.getTransporter(config).sendMail({
        from: config.from,
        to: email,
        subject: '巴黎臻藏 — 请确认您的邮箱',
        text: this.renderText(verifyUrl),
        html: this.renderHtml(verifyUrl),
      });
      this.logger.log(`注册确认邮件已发送，收件人=${email}`);
    } catch (error) {
      this.logger.error(`注册确认邮件发送失败，收件人=${email}`, error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }

  private getTransporter(config: SmtpConfig): Transporter {
    if (!this.transporter) {
      this.transporter = createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });
    }

    return this.transporter;
  }

  private getSmtpConfig(): SmtpConfig {
    return {
      host: this.configService.get<string>('SMTP_HOST', '').trim(),
      port: Number(this.configService.get<number>('SMTP_PORT', 587)),
      user: this.configService.get<string>('SMTP_USER', '').trim(),
      pass: this.configService.get<string>('SMTP_PASS', ''),
      from: this.configService.get<string>('SMTP_FROM', 'noreply@zhen.art').trim(),
      nodeEnv: this.configService.get<string>('NODE_ENV', 'development'),
    };
  }

  private shouldSkipSmtp(config: SmtpConfig): boolean {
    if (config.nodeEnv === 'production' && !config.host) {
      throw new Error('生产环境 SMTP_HOST 未配置，邮件服务不可用');
    }
    return config.nodeEnv !== 'production' && !config.host;
  }

  private renderText(verifyUrl: string): string {
    return [
      '您好，',
      '',
      '请点击以下链接完成巴黎臻藏艺术家平台邮箱确认：',
      verifyUrl,
      '',
      '该链接 24 小时内有效。如非本人操作，请忽略本邮件。',
      '',
      '巴黎臻藏',
    ].join('\n');
  }

  private renderHtml(verifyUrl: string): string {
    const safeVerifyUrl = this.escapeHtml(verifyUrl);
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; color: #1A1A1A;">
        <h2 style="margin: 0 0 16px;">巴黎臻藏邮箱确认</h2>
        <p>您好，</p>
        <p>请点击下方按钮完成巴黎臻藏艺术家平台邮箱确认：</p>
        <p>
          <a href="${safeVerifyUrl}" style="display: inline-block; padding: 10px 18px; background: #C0392B; color: #fff; text-decoration: none; border-radius: 6px;">
            确认邮箱
          </a>
        </p>
        <p>该链接 24 小时内有效。如非本人操作，请忽略本邮件。</p>
        <p style="color: #7F8C8D;">巴黎臻藏</p>
      </div>
    `;
  }

  private maskVerifyUrl(verifyUrl: string): string {
    return verifyUrl.replace(/([?&]token=)[^&]+/i, '$1***');
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
