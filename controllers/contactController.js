const ContactInfo = require('../models/ContactInfo');
const emailService = require('../config/emailService');
const { contactAcknowledgmentTemplate, contactNotificationTemplate } = require('../utils/emailTemplates');

const ADMIN_EMAIL = 'patelpal.93130@gmail.com';

// @desc    Get contact info
// @route   GET /api/admin/contact
// @access  Public
const getContactInfo = async (req, res) => {
  try {
    const contact = await ContactInfo.findOne({ isActive: true });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact info (for admin management)
// @route   GET /api/admin/contact/all
// @access  Private (Admin/Shopkeeper)
const getAllContactInfo = async (req, res) => {
  try {
    const contacts = await ContactInfo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create contact info
// @route   POST /api/admin/contact
// @access  Private (Admin/Shopkeeper)
const createContact = async (req, res) => {
  try {
    const { email, phone, address } = req.body;
    
    const contact = await ContactInfo.create({
      email,
      phone,
      address,
      isActive: false // New contacts start as inactive
    });
    
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact info
// @route   PUT /api/admin/contact/:id
// @access  Private (Admin/Shopkeeper)
const updateContact = async (req, res) => {
  try {
    const { email, phone, address } = req.body;
    
    const contact = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      { email, phone, address },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact info not found' });
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact info
// @route   DELETE /api/admin/contact/:id
// @access  Private (Admin/Shopkeeper)
const deleteContact = async (req, res) => {
  try {
    const contact = await ContactInfo.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact info not found' });
    }
    
    res.json({ success: true, message: 'Contact info deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set active contact info
// @route   PUT /api/admin/contact/:id/activate
// @access  Private (Admin/Shopkeeper)
const setActiveContact = async (req, res) => {
  try {
    // Deactivate all contacts
    await ContactInfo.updateMany({}, { isActive: false });
    
    // Activate the selected contact
    const contact = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact info not found' });
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update contact info (legacy)
// @route   POST /api/admin/contact
// @access  Private (Admin/Shopkeeper)
const createOrUpdateContact = async (req, res) => {
  try {
    const { email, phone, address } = req.body;
    
    // Deactivate existing contact info
    await ContactInfo.updateMany({}, { isActive: false });
    
    // Create new contact info
    const contact = await ContactInfo.create({
      email,
      phone,
      address,
      isActive: true
    });
    
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit contact form (sends emails to user + admin)
// @route   POST /api/admin/contact/submit
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    // Send acknowledgment email to the user
    try {
      const ackEmail = contactAcknowledgmentTemplate(name);
      await emailService.sendEmail({
        to: email,
        subject: ackEmail.subject,
        text: ackEmail.text,
        html: ackEmail.html
      });
    } catch (emailErr) {
      console.error('Failed to send acknowledgment email:', emailErr);
    }

    // Send notification email to admin
    try {
      const notifEmail = contactNotificationTemplate({ name, email, message });
      await emailService.sendEmail({
        to: ADMIN_EMAIL,
        subject: notifEmail.subject,
        text: notifEmail.text,
        html: notifEmail.html
      });
    } catch (emailErr) {
      console.error('Failed to send admin notification email:', emailErr);
    }

    res.status(200).json({ success: true, message: 'Your message has been sent successfully. We will get back to you soon!' });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};

module.exports = { 
  getContactInfo, 
  getAllContactInfo,
  createContact,
  updateContact,
  deleteContact,
  setActiveContact,
  createOrUpdateContact,
  submitContactForm
};
