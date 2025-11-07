import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middlewares/authorize';
import { NotFoundError } from '../models/errors/notFoundError';

function stripBuyerContact(gr: any) {
  if (!gr) return gr;
  const { buyer, ...rest } = gr;
  // Remove buyer contact details from the main payload
  return {
    ...rest,
    buyer: buyer ? { id: buyer.id, firstName: buyer.firstName, lastName: buyer.lastName } : null,
  };
}

export const listPublic = catchAsync(async (_req: Request, res: Response) => {
  const items = await prisma.gemRequest.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      gemType: true,
      buyer: true,
    },
  });

  const sanitized = items.map(stripBuyerContact);
  return sendSuccess(res, sanitized);
});

export const getPublic = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = await prisma.gemRequest.findUnique({
    where: { id },
    include: { gemType: true, buyer: true },
  });
  if (!item) throw new NotFoundError('Request not found');
  return sendSuccess(res, stripBuyerContact(item));
});

export const getBuyerContact = catchAsync(async (req: Request, res: Response) => {
  const _user = (req as AuthenticatedRequest).user;
  const id = Number(req.params.id);
  const item = await prisma.gemRequest.findUnique({
    where: { id },
    include: { buyer: { include: { country: true } } },
  });
  if (!item) throw new NotFoundError('Request not found');

  if (!item.buyer) return sendSuccess(res, null);
  const buyer = item.buyer;
  return sendSuccess(res, {
    id: buyer.id,
    firstName: buyer.firstName,
    lastName: buyer.lastName,
    email: buyer.email,
    phone: buyer.phone,
    companyName: buyer.companyName,
    country: buyer.country?.name ?? null,
  });
});


