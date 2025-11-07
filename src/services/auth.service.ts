import { prisma } from '../utils/prisma';
import { AppSettings } from '../utils/config';
import { queueEmail } from '../utils/email';
import { BadRequestError } from '../models/errors/badRequestError';
import { UnauthorizedError } from '../models/errors/unauthorizedError';
import { ForbiddenAccessError } from '../models/errors/forbiddenAccessError';
import { generateLoginToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName?: string;
  phone?: string;
  countryId?: number;
};

export function validatePasswordPolicy(password: string): void {
  const rules = [
    { re: /.{8,}/, msg: 'Minimum 8 characters' },
    { re: /[A-Z]/, msg: 'At least 1 uppercase letter' },
    { re: /[a-z]/, msg: 'At least 1 lowercase letter' },
    { re: /[0-9]/, msg: 'At least 1 digit' },
    { re: /[!@#$%^&*\-_.+=?]/, msg: 'At least 1 special character' },
  ];
  const failed = rules.filter(r => !r.re.test(password));
  if (failed.length) {
    throw new BadRequestError('Password does not meet policy: ' + failed.map(f => f.msg).join(', '));
  }
}

export async function register(input: RegisterInput) {
  const { email, password, firstName, lastName, companyName, phone, countryId } = input;
  validatePasswordPolicy(password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new BadRequestError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomUUID();

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      companyName: companyName || null,
      phone: phone || null,
      countryId: countryId ?? null,
      emailVerified: false,
      verificationToken,
      isActive: true,
    },
  });

  const verifyUrl = `${AppSettings.loginUrl}?verify=${encodeURIComponent(verificationToken)}`;
  queueEmail({
    to: email,
    subject: 'Verify your email',
    body: `
      <p>Hi ${firstName},</p>
      <p>Thanks for registering. Please verify your email to activate your account.</p>
      <p><a href="${verifyUrl}">Verify my email</a></p>
      <p>If the link doesn't work, copy and paste this URL into your browser:</p>
      <p>${verifyUrl}</p>
    `,
  });

  return { id: user.id, email: user.email, emailVerified: user.emailVerified };
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) throw new BadRequestError('Invalid verification token');

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null },
  });

  return { success: true };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  console.log('Found user:', user);
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const now = new Date();
  if (user.lockoutUntil && user.lockoutUntil > now) {
    throw new ForbiddenAccessError('Account locked due to multiple failed login attempts. Try again later.');
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  console.log('Password match:', ok);
  if (!ok) {
    const failedAttempts = (user.failedLoginAttempts ?? 0) + 1;
    const updates: any = { failedLoginAttempts: failedAttempts };
    if (failedAttempts >= 5) {
      updates.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      updates.failedLoginAttempts = 0;
    }
    await prisma.user.update({ where: { id: user.id }, data: updates });
    throw new UnauthorizedError('Invalid credentials');
  }

  if (!user.emailVerified) {
    throw new ForbiddenAccessError('Email not verified');
  }
  if (!user.isActive) {
    throw new ForbiddenAccessError('Account is inactive');
  }

  await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockoutUntil: null } });

  const tokenPayload = {
    userId: String(user.id),
    email: user.email,
    role: user.userType as any,
    stamp: '',
  };
  const generated = generateLoginToken(tokenPayload);
  return { token: generated.token, validTo: generated.validTo };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { success: true }; // do not reveal

  const token = crypto.randomUUID();
  const expiry = new Date(Date.now() + 15 * 60 * 1000);
  await prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: token, passwordResetExpiry: expiry } });

  const resetUrl = `${AppSettings.resetPasswordUrl}?token=${encodeURIComponent(token)}`;
  queueEmail({
    to: email,
    subject: 'Reset your password',
    body: `
      <p>Hi ${user.firstName},</p>
      <p>We received a password reset request for your account.</p>
      <p><a href="${resetUrl}">Reset my password</a></p>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return { success: true };
}

export async function resetPassword(token: string, newPassword: string) {
  validatePasswordPolicy(newPassword);
  const user = await prisma.user.findFirst({ where: { passwordResetToken: token } });
  if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
    throw new BadRequestError('Invalid or expired token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordResetToken: null, passwordResetExpiry: null },
  });

  return { success: true };
}


