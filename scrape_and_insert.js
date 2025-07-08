// f:/HTTaxSolutions/Immigration/server/scrape_and_insert.js
require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.wegreened.com';
const API_URL = 'http://localhost:3000/api/static-pages'; // Adjust port if needed

// List of page paths to scrape (add more as needed)
const pages = [
  '/',
  '/Our-Firm',
  '/About-the-Firm',
  '/Our-Attorneys-and-Staff',
  '/Why-Choose-Our-Team',
  '/Services',
  '/NIW',
  '/NIW-for-Entrepreneurs',
  '/EB1A',
  '/EB1B',
  '/PERM',
  '/I-485-Green-Card-Application',
  '/I-485-Adjustment-of-Status',
  '/I-140-and-I-485-Concurrent-Filing',
  '/Immigrant-Visa-Processing',
  '/Non-Immigration-Visas',
  '/H1B-Visa',
  '/L1-Visa',
  '/O1-O3-Visa',
  '/J1-Visa-and-Waiver',
  '/E1-E2-Visa',
  '/Legal-Fees',
  '/Free-Evaluation',
  '/Legal-Fees-of-Our-Services',
  '/Knowledge-Center',
  '/FAQ',
  '/Latest-Information',
  '/Current-Visa-Bulletin',
  '/Our-Approvals',
  '/Our-Success-Stories',
  '/Latest-NIW-EB1-O1-Approvals',
  '/Client-Testimonials',
  '/ContactUs',
];

async function scrapeAndInsert() {
  for (const path of pages) {
    const url = BASE_URL + path;
    const pageName = path === '/' ? 'home' : path.replace(/^\//, '').replace(/-/g, '_');
    try {
      const { data: html } = await axios.get(url);
      const $ = cheerio.load(html);
      // You may need to adjust the selector to get the main content
      const content = $('#main, .main, #content, .content').html() || $('body').html();
      if (!content) {
        console.log(`No content found for ${url}`);
        continue;
      }
      // Insert into backend
      await axios.post(API_URL, {
        page_name: pageName,
        content,
      });
      console.log(`Inserted: ${pageName}`);
    } catch (err) {
      console.error(`Failed for ${url}:`, err.message);
    }
  }
}

scrapeAndInsert();