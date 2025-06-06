const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    const router = express.Router();

    // Middleware to verify JWT token from .NET backend
    const verifyToken = (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.decode(token);
            
            // Get the correct ID claim from the token
            const userId = decoded.uid;
            if (!userId) {
                return res.status(401).json({ error: 'Invalid token claims' });
            }

            req.userId = userId;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ error: 'Invalid token' });
        }
    };

    // Get memos for a user
    router.get('/', verifyToken, async (req, res) => {
        try {
            const { rows } = await pool.query(
                'SELECT "Id", "Text", "Done", "UserId", "CreatedAt", "UpDatedAt" FROM "Memos" WHERE "UserId" = $1 ORDER BY "CreatedAt" DESC',
                [req.userId]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching memos:', error);
            res.status(500).json({ error: 'Failed to fetch memos' });
        }
    });

    // Create new memo
    router.post('/', verifyToken, async (req, res) => {
        try {
            const { memo } = req.body;
            if (!memo) {
                return res.status(400).json({ error: 'Memo content is required' });
            }

            const { rows } = await pool.query(
                'INSERT INTO "Memos" ("Text", "UserId", "Done", "CreatedAt", "UpDatedAt") VALUES ($1, $2, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
                [memo, req.userId]
            );
            res.status(201).json(rows[0]);
        } catch (error) {
            console.error('Error creating memo:', error);
            res.status(500).json({ error: 'Failed to create memo' });
        }
    });

    // Update memo
    router.put('/:id', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const { memo } = req.body;

            const { rows } = await pool.query(
                'UPDATE "Memos" SET "Text" = $1, "UpDatedAt" = CURRENT_TIMESTAMP WHERE "Id" = $2 AND "UserId" = $3 RETURNING *',
                [memo, id, req.userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error updating memo:', error);
            res.status(500).json({ error: 'Failed to update memo' });
        }
    });

    // Update memo done status
    router.put('/:id/done', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const { done } = req.body;

            const { rows } = await pool.query(
                'UPDATE "Memos" SET "Done" = $1, "UpDatedAt" = CURRENT_TIMESTAMP WHERE "Id" = $2 AND "UserId" = $3 RETURNING *',
                [done, id, req.userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error updating memo done state:', error);
            res.status(500).json({ error: 'Failed to update memo status' });
        }
    });

    // Delete memo
    router.delete('/:id', verifyToken, async (req, res) => {
        try {
            const { id } = req.params;
            const { rowCount } = await pool.query(
                'DELETE FROM "Memos" WHERE "Id" = $1 AND "UserId" = $2',
                [id, req.userId]
            );

            if (rowCount === 0) {
                return res.status(404).json({ error: 'Memo not found' });
            }
            res.json({ message: 'Memo deleted successfully' });
        } catch (error) {
            console.error('Error deleting memo:', error);
            res.status(500).json({ error: 'Failed to delete memo' });
        }
    });

    // Get count of undone memos
    router.get('/undone/count', verifyToken, async (req, res) => {
        try {
            const { rows } = await pool.query(
                'SELECT COUNT(*) as count FROM "Memos" WHERE "UserId" = $1 AND "Done" = false',
                [req.userId]
            );
            res.json({ count: parseInt(rows[0].count) });
        } catch (error) {
            console.error('Error fetching undone memos count:', error);
            res.status(500).json({ error: 'Failed to fetch undone memos count' });
        }
    });

    return router;
};