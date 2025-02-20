const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (pool) => {
    const router = express.Router();

    // Get all emergency contacts for a user
    router.get('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const user_id = decoded.nameid || decoded.sub;

            const { rows } = await pool.query(
                'SELECT "Id", "Name", "Email", "Phone", "Relationship", "UserId", "CreatedAt", "UpDatedAt" FROM "EmergencyContacts" WHERE "UserId" = $1 ORDER BY "CreatedAt" DESC',
                [user_id]
            );
            res.json(rows);
        } catch (error) {
            console.error('Error fetching emergency contacts:', error);
            res.status(500).json({ error: 'Failed to fetch emergency contacts' });
        }
    });

    // Create new emergency contact
    router.post('/', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const user_id = decoded.nameid || decoded.sub;
            const { name, phone, email, relationship } = req.body;

            const { rows } = await pool.query(
                'INSERT INTO "EmergencyContacts" ("Name", "Phone", "Email", "Relationship", "UserId") VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, phone, email, relationship, user_id]
            );
            res.status(201).json(rows[0]);
        } catch (error) {
            console.error('Error creating emergency contact:', error);
            res.status(500).json({ error: 'Failed to create emergency contact' });
        }
    });

    // Update emergency contact
    router.put('/:id', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const user_id = decoded.nameid || decoded.sub;
            const { id } = req.params;
            const { name, phone, email, relationship } = req.body;

            const { rows } = await pool.query(
                'UPDATE "EmergencyContacts" SET "Name" = $1, "Phone" = $2, "Email" = $3, "Relationship" = $4, "UpDatedAt" = CURRENT_TIMESTAMP WHERE "Id" = $5 AND "UserId" = $6 RETURNING *',
                [name, phone, email, relationship, id, user_id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error updating emergency contact:', error);
            res.status(500).json({ error: 'Failed to update emergency contact' });
        }
    });

    // Delete emergency contact
    router.delete('/:id', async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token);
            const user_id = decoded.nameid || decoded.sub;
            const { id } = req.params;

            const { rowCount } = await pool.query(
                'DELETE FROM "EmergencyContacts" WHERE "Id" = $1 AND "UserId" = $2',
                [id, user_id]
            );

            if (rowCount === 0) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json({ message: 'Contact deleted successfully' });
        } catch (error) {
            console.error('Error deleting emergency contact:', error);
            res.status(500).json({ error: 'Failed to delete emergency contact' });
        }
    });

    return router;
};