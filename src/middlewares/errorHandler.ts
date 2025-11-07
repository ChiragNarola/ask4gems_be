import { NextFunction, Request, Response } from 'express';
import { extractRequestMetadata } from '../utils/extractRequestMetadata';
import { AppSettings, Environment } from '../utils/config';
import { BaseHttpError } from '../models/errors/baseHttpError';
import Logger from '../utils/logger';
import { sendError } from '../utils/response';
import { queueEmail } from '../utils/email';

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isProduction = AppSettings.environment === Environment.Production;

  let message = 'Server error: Failed to process your request.';
  let data: any = null;
  let statusCode = 500;
  const reqMetadata = extractRequestMetadata(req);

  if (err instanceof BaseHttpError) {
    statusCode = err.statusCode;
    message = err.message;
    data = err.data;
    Logger.warn(`${err.name}: ${err.message}`, { ...data, requestMetadata: reqMetadata });
  }
  else {
    if (!isProduction) {
      message = err.message || message;
      data = {
        ...data,
        stack: err.stack,
        requestMetadata: reqMetadata,
      };
    }

    Logger.error(`Unhandled Error: ${err.message ?? ""}`, data);
    if (AppSettings.errorEmailSendTo.length > 0) {
      queueEmail({
        body: buildErrorEmailBody(err, reqMetadata),
        subject: `VVS Error [${AppSettings.environment}]`,
        to: AppSettings.errorEmailSendTo,
      });
    }
  }

  res.status(statusCode);
  sendError(res, message, data);
}

function buildErrorEmailBody(error?: any, requestMetadata?: any): string {
  const formatSection = (title: string, content?: string, pre: boolean = false): string => {
    if (!content) return '';
    return `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 16px; color:#dc3545;"><b>${title}</b></div>
        <div style="background-color: rgb(251,251,251); font-size: 13px; padding: 10px; word-break: break-word; margin-top: 4px; border-radius: 4px;">
          ${pre ? `<pre style="white-space: pre-wrap; margin: 0;">${content}</pre>` : content}
        </div>
      </div>
    `;
  };

  const jsonToPretty = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const renderKeyValueTable = (data: Record<string, any> | undefined): string => {
    if (!data || typeof data !== 'object') return '';
    return `
      <table style="width: 100%; font-size: 13px;">
        ${Object.entries(data).map(
      ([key, value]) => `
          <tr>
            <td style="font-weight: bold; vertical-align: top; padding-right: 10px;">${key}</td>
            <td>${typeof value === 'object' ? jsonToPretty(value) : String(value)}</td>
          </tr>
        `
    ).join('')}
      </table>
    `;
  };

  const renderHeaderList = (headers: { key: string; value: string | string[] | undefined }[] | undefined): string => {
    if (!headers || !Array.isArray(headers)) return '';
    return `
      <table style="width: 100%; font-size: 13px;">
        ${headers.map(
      h => `
          <tr>
            <td style="font-weight: bold; vertical-align: top; padding-right: 10px; width: 150px;">${h.key}</td>
            <td>${Array.isArray(h.value) ? h.value.join(', ') : h.value ?? ''}</td>
          </tr>
        `
    ).join('')}
      </table>
    `;
  };

  return `
    <html>
      <body style="background-color: rgb(239,239,239); padding: 16px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 700px; margin: auto; padding: 20px; background: white; border: 1px solid #dc3545; border-radius: 4px;">
          ${formatSection('DateTime (UTC)', new Date().toISOString())}
          ${formatSection('Error Message', error?.message || '')}
          ${formatSection('Stack Trace', error?.stack, true)}
          ${formatSection('Request URL', requestMetadata.url)}
          ${formatSection('Query Params', jsonToPretty(requestMetadata.queryParams), true)}
          ${formatSection('Request Body', jsonToPretty(requestMetadata.json), true)}
          ${formatSection('Files', jsonToPretty(requestMetadata.files), true)}
          ${formatSection('Client Info', requestMetadata['user-agent'])}
          ${formatSection('User', renderKeyValueTable(requestMetadata.user))}
          ${formatSection('Headers', renderHeaderList(requestMetadata.headers))}
        </div>
      </body>
    </html>
  `;
}
