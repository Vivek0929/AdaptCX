import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'adaptcx_default_jwt_secret_dev_2026_super_secure';

const generateToken = (businessId) => {
  return jwt.sign({ businessId }, JWT_SECRET, { expiresIn: '7d' });
};

const sanitizeBusiness = (business) => {
  if (!business) return null;
  const { password_hash, ...rest } = business;
  return rest;
};

export const signup = async (req, res) => {
  try {
    const { business_name, email, password, industry, product_description, brand_tone } = req.body;

    const existing = await db.getBusinessByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const business = await db.createBusiness({
      business_name,
      email,
      password_hash,
      industry,
      product_description,
      brand_tone
    });

    // Seed standard baseline content blocks so tenant starts with a great foundation
    const defaultBaseline = {
      hero_headline: `Intelligent Solutions Built for Modern ${business_name}`,
      hero_subheadline: `Accelerate your operations, streamline customer workflows, and scale efficiently with our purpose-built platform.`,
      feature_1: `Effortless workflow integration and seamless onboarding`,
      feature_2: `Real-time intelligence and automated reporting`,
      feature_3: `Enterprise-grade reliability and top-tier security`,
      cta_text: `Get Started for Free`,
      testimonial: `“Implementing this platform was a game changer for our team. We saw immediate efficiency gains across all departments.” — Alex Morgan, COO`
    };

    for (const [key, val] of Object.entries(defaultBaseline)) {
      await db.upsertContentBlock(business.id, key, val);
    }

    const token = generateToken(business.id);
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      business: sanitizeBusiness(business)
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error during signup.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await db.getBusinessByEmail(email);
    if (!business) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, business.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(business.id);
    return res.status(200).json({
      message: 'Login successful',
      token,
      business: sanitizeBusiness(business)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      business: sanitizeBusiness(req.business)
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ message: 'Internal server error fetching profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await db.updateBusiness(req.businessId, req.body);
    return res.status(200).json({
      message: 'Profile updated successfully',
      business: sanitizeBusiness(updated)
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ message: 'Internal server error updating profile.' });
  }
};
