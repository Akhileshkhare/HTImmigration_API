const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ImmigrationEvaluation = require('../models/ImmigrationEvaluation');
const Document = require('../models/Document');

const router = express.Router();

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Save evaluation form
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    // Save evaluation
    const evaluation = await ImmigrationEvaluation.create({
      full_name: `${data.first_name} ${data.last_name}`,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.date_of_birth || null,
      gender: data.gender || '',
      country_of_birth: data.birth_country,
      country_of_citizenship: data.country_of_citizenship || '',
      country_of_residence: data.country_of_residence || '',
      current_visa_status: data.visa_status,
      highest_degree: data.degrees?.[0]?.type || '',
      major_field: data.degrees?.[0]?.major || '',
      university: data.degrees?.[0]?.university || '',
      graduation_year: data.degrees?.[0]?.year || '',
      occupation: data.occupation || '',
      employer: data.employer || '',
      years_experience: data.years_experience || '',
      job_duties: data.job_duties || '',
      immigration_category: (data.category || []).join(','),
      us_relatives: data.us_relatives || '',
      previous_visa_denials: data.previous_visa_denials || '',
      additional_info: JSON.stringify(data),
      created_at: new Date(),
      title: data.title || '',
      title_other: data.title_other || '',
      visa_status_other: data.visa_status_other || '',
      visa_expiration_date: data.visa_expiration_date || '',
      field_esi: data.field_esi || '',
      field_esi_other: data.field_esi_other || '',
      degrees: data.degrees || [],
      degreesInProgress: data.degreesInProgress || [],
      employment_status: data.employment_status || '',
      citation_profiles: data.citation_profiles || '',
      citation_number: data.citation_number || '',
      publication: data.publication || '',
      published_year: data.published_year || '',
      no_publications: data.no_publications || false,
      review_number: data.review_number || '',
      confirm_thank_you_email: data.confirm_thank_you_email || false,
      owns_patents: data.owns_patents || '',
      patents: data.patents || '',
      funding_received: data.funding_received || '',
      fundingDetails: data.fundingDetails || '',
      ongoing_project: data.ongoing_project || '',
      ongoing_project_note: data.ongoing_project_note || '',
      related_field_work: data.related_field_work || '',
      hears_form: data.hears_form || [],
      read_notice: data.read_notice || false,
      additional_comments: data.additional_comments || '',
    });
    // Save document if file uploaded
    let document = null;
    if (req.file) {
      document = await Document.create({
        user_id: null, // Set if you have user auth
        file_name: req.file.originalname,
        file_path: `/uploads/${req.file.filename}`,
        uploaded_by: data.email,
        uploaded_at: new Date(),
        is_archived: false,
        evaluation_id: evaluation.id,
      });
    }
    res.json({ success: true, evaluation, document });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all evaluations
router.get('/all', async (req, res) => {
  try {
    const evaluations = await ImmigrationEvaluation.findAll({ order: [['created_at', 'DESC']] });
    res.json({ evaluations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete evaluation by id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await ImmigrationEvaluation.destroy({ where: { id } });
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve uploaded files with error handling
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/uploads', req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist
      return res.status(404).json({ error: 'File not found' });
    }
    res.sendFile(filePath);
  });
});

// Get documents by evaluation_id
router.get('/documents/:evaluation_id', async (req, res) => {
  try {
    const evaluation_id = req.params.evaluation_id;
    const documents = await Document.findAll({ where: { evaluation_id } });
    res.json({ documents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
