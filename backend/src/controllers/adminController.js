const { z } = require('zod');
const { User, Badge, Template, ProfileAnalytics, ProfileLink } = require('../models');
const analyticsService = require('../services/analyticsService');

const badgeSchema = z.object({
  name: z.string().min(2).max(64),
  description: z.string().max(255).optional(),
  iconUrl: z.string().url().optional(),
  color: z.string().optional(),
  isPremium: z.boolean().optional()
});

const templateSchema = z.object({
  name: z.string().min(2).max(64),
  description: z.string().max(500).optional(),
  data: z.record(z.any()),
  isPublic: z.boolean().optional(),
  isPremium: z.boolean().optional()
});

const listUsers = async (_req, res) => {
  const users = await User.findAll({
    include: ['badges', 'links', 'template']
  });
  return res.json(users);
};

const listBadges = async (_req, res) => {
  const badges = await Badge.findAll();
  return res.json(badges);
};

const updateUserRole = async (req, res) => {
  const schema = z.object({ role: z.enum(['user', 'admin']) });
  try {
    const payload = schema.parse(req.body);
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ role: payload.role });
    return res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to update user' });
  }
};

const createBadge = async (req, res) => {
  try {
    const payload = badgeSchema.parse(req.body);
    const badge = await Badge.create(payload);
    return res.status(201).json(badge);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to create badge' });
  }
};

const updateBadge = async (req, res) => {
  try {
    const payload = badgeSchema.partial().parse(req.body);
    const badge = await Badge.findByPk(req.params.badgeId);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }
    await badge.update(payload);
    return res.json(badge);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to update badge' });
  }
};

const deleteBadge = async (req, res) => {
  const badge = await Badge.findByPk(req.params.badgeId);
  if (!badge) {
    return res.status(404).json({ message: 'Badge not found' });
  }
  await badge.destroy();
  return res.status(204).send();
};

const assignBadge = async (req, res) => {
  const schema = z.object({ note: z.string().optional() });
  try {
    const payload = schema.parse(req.body);
    const user = await User.findByPk(req.params.userId);
    const badge = await Badge.findByPk(req.params.badgeId);
    if (!user || !badge) {
      return res.status(404).json({ message: 'User or badge not found' });
    }
    await user.addBadge(badge, { through: { note: payload.note } });
    return res.json({ message: 'Badge assigned' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to assign badge' });
  }
};

const removeBadge = async (req, res) => {
  const user = await User.findByPk(req.params.userId);
  const badge = await Badge.findByPk(req.params.badgeId);
  if (!user || !badge) {
    return res.status(404).json({ message: 'User or badge not found' });
  }
  await user.removeBadge(badge);
  return res.json({ message: 'Badge removed' });
};

const createTemplate = async (req, res) => {
  try {
    const payload = templateSchema.parse(req.body);
    const template = await Template.create({ ...payload, createdBy: req.user.id });
    return res.status(201).json(template);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to create template' });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const payload = templateSchema.partial().parse(req.body);
    const template = await Template.findByPk(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    await template.update(payload);
    return res.json(template);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to update template' });
  }
};

const listTemplates = async (_req, res) => {
  const templates = await Template.findAll();
  return res.json(templates);
};

const deleteTemplate = async (req, res) => {
  const template = await Template.findByPk(req.params.templateId);
  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }
  await template.destroy();
  return res.status(204).send();
};

const getAnalytics = async (req, res) => {
  const { userId } = req.params;
  const summary = await analyticsService.getAnalyticsSummary(userId);
  return res.json(summary);
};

const getOverview = async (_req, res) => {
  const totalUsers = await User.count();
  const totalBadges = await Badge.count();
  const totalLinks = await ProfileLink.count();
  const recentViews = await ProfileAnalytics.sum('views', { where: {} });
  const recentClicks = await ProfileAnalytics.sum('clicks', { where: {} });

  return res.json({
    totals: {
      users: totalUsers,
      badges: totalBadges,
      links: totalLinks,
      views: recentViews || 0,
      clicks: recentClicks || 0
    }
  });
};

module.exports = {
  listUsers,
  listBadges,
  updateUserRole,
  createBadge,
  updateBadge,
  deleteBadge,
  assignBadge,
  removeBadge,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  listTemplates,
  getAnalytics,
  getOverview
};
