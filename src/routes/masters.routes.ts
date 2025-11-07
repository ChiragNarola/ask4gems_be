import { Router } from 'express';
import { list, getById, create, update, remove } from '../controllers/masters.controller';
import { authorize } from '../middlewares/authorize';
import { requireRole } from '../middlewares/requireRole';

/**
 * @swagger
 * tags:
 *   - name: Masters
 *     description: Generic API for managing master data (e.g. countries, categories, etc.)
 *
 * /masters/{entity}:
 *   get:
 *     summary: Get list of records for a master entity
 *     tags: [Masters]
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the master entity (e.g. countries, categories)
 *     responses:
 *       200:
 *         description: List of records retrieved successfully
 *       400:
 *         description: Invalid entity
 *
 *   post:
 *     summary: Create a new record for a master entity (Admin only)
 *     tags: [Masters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the master entity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Example Item
 *               description: Description text
 *     responses:
 *       201:
 *         description: Record created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *
 * /masters/{entity}/{id}:
 *   get:
 *     summary: Get a specific record by ID for a master entity
 *     tags: [Masters]
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the master entity
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the record
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 *       404:
 *         description: Record not found
 *
 *   put:
 *     summary: Update an existing record by ID (Admin only)
 *     tags: [Masters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Updated Name
 *               description: Updated Description
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Record not found
 *
 *   delete:
 *     summary: Delete a record by ID (Admin only)
 *     tags: [Masters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Record not found
 */

const router = Router({ mergeParams: true });

// Public list and get
router.get('/:entity', list);
router.get('/:entity/:id', getById);

// Admin-only modifications
router.post('/:entity', authorize, requireRole('Admin'), create);
router.put('/:entity/:id', authorize, requireRole('Admin'), update);
router.delete('/:entity/:id', authorize, requireRole('Admin'), remove);

export default router;