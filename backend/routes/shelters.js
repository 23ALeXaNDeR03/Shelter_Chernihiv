const express = require('express');
const router = express.Router();
const { Shelter } = require('../models');

// Отримання всіх укриттів
router.get('/', async (req, res) => {
  try {
    const shelters = await Shelter.findAll();
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Додавання нового укриття
router.post('/', async (req, res) => {
  try {
    const newShelter = await Shelter.create(req.body);
    res.status(201).json(newShelter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
