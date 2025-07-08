const express = require('express');
const router = express.Router();
const StaticPage = require('../models/StaticPage');

// Get page by name
router.get('/:page_name', async (req, res) => {
  try {
    const page = await StaticPage.findOne({ where: { page_name: req.params.page_name } });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update page (admin only, add auth later)
router.post('/', async (req, res) => {
  const { page_name, content } = req.body;
  try {
    let page = await StaticPage.findOne({ where: { page_name } });
    if (page) {
      page.content = content;
      page.last_updated = new Date();
      await page.save();
      return res.json(page);
    } else {
      page = await StaticPage.create({ page_name, content, last_updated: new Date() });
      return res.status(201).json(page);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
