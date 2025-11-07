import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { AppSettings } from './config';
import { IEmailOptions } from '../models/emailOptions';
import Logger from './logger';

const emailQueue: IEmailOptions[] = [];
let isProcessing = false;

export function queueEmail(options: IEmailOptions): void {
    if (!options || !options.to || !options.subject || !options.body) {
        Logger.warn('Email not queued: missing required fields', { ...options });
        return;
    }

    emailQueue.push(options);
    processQueue();
}

function processQueue() {
    if (isProcessing || emailQueue.length === 0) return;

    isProcessing = true;
    const emailOptions = emailQueue.shift();
    if (!emailOptions) {
        isProcessing = false;
        return;
    }

    queueEmailInternal(emailOptions)
        .catch(err => {
            Logger.error('Failed to send email', { error: err, ...emailOptions });
        })
        .finally(() => {
            isProcessing = false;
            setImmediate(processQueue); // continue processing
        });
}

async function queueEmailInternal(options: IEmailOptions): Promise<void> {
    const { to, subject, body, cc, bcc, attachments = [] } = options;

    const mailAttachments = attachments
        ?.filter(file => fs.existsSync(file) && fs.statSync(file).isFile())
        .map(file => ({ filename: path.basename(file), path: file }));

    const transporter = nodemailer.createTransport({
        host: AppSettings.emailConfig.host,
        port: AppSettings.emailConfig.port,
        secure: false,
        auth: {
            user: AppSettings.emailConfig.user,
            pass: AppSettings.emailConfig.password,
        },
    });

    await transporter.sendMail({
        from: `"NoReply" <${AppSettings.emailConfig.user}>`,
        to,
        cc,
        bcc,
        subject,
        html: body,
        attachments: mailAttachments,
    });

    Logger.info('Email sent', { email: options });

    // Delete temp files
    for (const a of mailAttachments || []) {
        try {
            fs.unlinkSync(a.path);
        } catch (err) {
            Logger.warn(`Failed to delete temp attachment: ${a.path}`);
        }
    }
}

// ✅ Gracefully wait for email queue to drain
export async function shutdownEmailQueue(): Promise<void> {
    return new Promise((resolve) => {
        const checkQueue = () => {
            if (!isProcessing && emailQueue.length === 0) {
                return resolve();
            }
            setTimeout(checkQueue, 100);
        };

        checkQueue();
    });
}
