import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../models/errors/notFoundError';
import { BadRequestError } from '../models/errors/badRequestError';
import { AuthenticatedRequest } from '../middlewares/authorize';

type MasterEntity =
  | 'gem-types'
  | 'shapes'
  | 'colors'
  | 'clarities'
  | 'cut-polishes'
  | 'saturations'
  | 'treatments'
  | 'cutting-styles'
  | 'effects'
  | 'transparencies'
  | 'textures'
  | 'fluorescences'
  | 'origins'
  | 'appellations'
  | 'countries'
  | 'buy-types'
  | 'lab-reports';

const entityToModel: Record<MasterEntity, keyof typeof prisma> = {
  'gem-types': 'gemType',
  shapes: 'shape',
  colors: 'color',
  clarities: 'clarity',
  'cut-polishes': 'cutPolish',
  saturations: 'saturation',
  treatments: 'treatment',
  'cutting-styles': 'cuttingStyle',
  effects: 'effect',
  transparencies: 'transparency',
  textures: 'texture',
  fluorescences: 'fluorescence',
  origins: 'origin',
  appellations: 'appellation',
  countries: 'country',
  'buy-types': 'buyType',
  'lab-reports': 'labReport',
};

function getModel(entity: string) {
  const key = entity as MasterEntity;
  const modelKey = entityToModel[key];
  if (!modelKey) {
    throw new BadRequestError('Unknown master entity');
  }

  //Safe cast instead of @ts-expect-error
  return (prisma as any)[modelKey];
}

export const list = catchAsync(async (req: Request, res: Response) => {
  const model = getModel(req.params.entity);
  const items = await model.findMany({
    where: { isDeleted: false },
    orderBy: { name: 'asc' },
  });
  return sendSuccess(res, items);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const model = getModel(req.params.entity);
  const id = Number(req.params.id);
  const item = await model.findUnique({ where: { id } });
  if (!item || item.isDeleted) throw new NotFoundError('Not found');
  return sendSuccess(res, item);
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const model = getModel(req.params.entity);
  const { name } = req.body as { name: string };
  if (!name || typeof name !== 'string') throw new BadRequestError('Name is required');
  const userId = parseInt((req as AuthenticatedRequest).user.userId, 10);
  const created = await model.create({ data: { name, createdBy: userId } });
  return sendSuccess(res, created);
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const model = getModel(req.params.entity);
  const id = Number(req.params.id);
  const { name } = req.body as { name?: string };
  const existing = await model.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFoundError('Not found');
  const userId = parseInt((req as AuthenticatedRequest).user.userId, 10);
  const updated = await model.update({
    where: { id },
    data: { name: name ?? existing.name, updatedBy: userId },
  });
  return sendSuccess(res, updated);
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const model = getModel(req.params.entity);
  const id = Number(req.params.id);
  const existing = await model.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFoundError('Not found');
  const userId = parseInt((req as AuthenticatedRequest).user.userId, 10);
  const deleted = await model.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
  });
  return sendSuccess(res, deleted);
});
