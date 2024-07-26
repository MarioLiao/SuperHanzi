import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { models } from '../db/models/index.js';

const { CharacterData } = models;
const router = express.Router();

// Get characters using offset pagination
router.get('/characters', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    let offset = parseInt(req.query.page, 10) * limit;
    const characters = await CharacterData.findAll({
      offset,
      limit,
      attributes: ['id', 'character', 'pinyin', 'english', 'isPremium'],
      order: [
        ['isPremium', 'DESC'],
        ['id', 'ASC'],
      ],
    });
    return res.json({ characters });
  } catch (error) {
    console.error('Error fetching characters:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the amount of characters we have
router.get('/totalCharacters', authenticateToken, async (req, res) => {
  try {
    const characters = await CharacterData.findAll({
      attributes: ['id', 'character', 'pinyin', 'english', 'isPremium'],
    });
    return res.json({ length: characters.length });
  } catch (error) {
    console.error('Error fetching total characters:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
