export interface IEmailOptions {
    to: string | string[];
    subject: string;
    body: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: string[]; // Can be file paths or raw base64 strings
}