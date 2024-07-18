import express from 'express';
import { models } from '../db/models/index.js';

const { CharacterData } = models;
const router = express.Router();

// Get characters using offset pagination
router.get('/characters', async (req, res) => {
  const limit = req.query.limit;
  const offset = req.query.page * limit;
  const characters = await CharacterData.findAll({
    offset,
    limit,
    attributes: ['id', 'character', 'pinyin', 'english'],
  });
  return res.json({ characters });
});

// Get the amount of characters we have
router.get('/totalCharacters', async (req, res) => {
  const characters = await CharacterData.findAll({
    attributes: ['id', 'character', 'pinyin', 'english'],
  });
  return res.json({ length: characters.length });
});

export default router;
