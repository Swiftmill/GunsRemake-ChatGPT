const { z } = require('zod');
const { Op } = require('sequelize');
const { sequelize, User, ProfileLink, Badge, Template } = require('../models');
const analyticsService = require('../services/analyticsService');

const profileUpdateSchema = z.object({
  displayName: z.string().min(2).max(64),
  bio: z.string().max(600).optional(),
  location: z.string().max(120).optional(),
  socialDiscord: z.string().max(120).optional(),
  backgroundMediaUrl: z.string().url().optional(),
  backgroundMediaType: z.enum(['image', 'video']).optional(),
  musicUrl: z.string().url().optional(),
  musicAutoplay: z.boolean().optional(),
  musicLoop: z.boolean().optional(),
  profileOpacity: z.number().min(0).max(1).optional(),
  profileBlur: z.number().min(0).max(100).optional(),
  settings: z.record(z.any()).optional(),
  templateId: z.string().uuid().nullable().optional()
});

const linkSchema = z.object({
  title: z.string().min(1).max(64),
  url: z.string().url(),
  icon: z.string().max(128).optional(),
  category: z.string().max(64).optional(),
  order: z.number().int().optional(),
  isVisible: z.boolean().optional()
});

const getProfile = async (req, res) => {
  const profile = await User.findByPk(req.user.id, {
    include: [
      { model: ProfileLink, as: 'links', separate: true, order: [['order', 'ASC']] },
      { model: Badge, as: 'badges' },
      { model: Template, as: 'template' }
    ]
  });

  return res.json(profile);
};

const updateProfile = async (req, res) => {
  try {
    const payload = profileUpdateSchema.parse(req.body);

    if (payload.templateId) {
      const template = await Template.findByPk(payload.templateId);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
    }

    await req.user.update(payload);
    const updated = await User.findByPk(req.user.id, {
      include: [
        { model: ProfileLink, as: 'links', separate: true, order: [['order', 'ASC']] },
        { model: Badge, as: 'badges' },
        { model: Template, as: 'template' }
      ]
    });

    return res.json(updated);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to update profile' });
  }
};

const createLink = async (req, res) => {
  try {
    const payload = linkSchema.parse(req.body);
    const link = await ProfileLink.create({
      ...payload,
      userId: req.user.id,
      order: payload.order ?? Date.now()
    });
    return res.status(201).json(link);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to create link' });
  }
};

const updateLink = async (req, res) => {
  try {
    const payload = linkSchema.partial().parse(req.body);
    const link = await ProfileLink.findOne({ where: { id: req.params.linkId, userId: req.user.id } });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    await link.update(payload);
    return res.json(link);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to update link' });
  }
};

const reorderLinks = async (req, res) => {
  const orderSchema = z.array(z.object({ id: z.string().uuid(), order: z.number().int() }));
  try {
    const payload = orderSchema.parse(req.body);
    const transaction = await sequelize.transaction();
    try {
      await Promise.all(payload.map((item) => ProfileLink.update(
        { order: item.order },
        { where: { id: item.id, userId: req.user.id }, transaction }
      )));
      await transaction.commit();
      const links = await ProfileLink.findAll({ where: { userId: req.user.id }, order: [['order', 'ASC']] });
      return res.json(links);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to reorder links' });
  }
};

const deleteLink = async (req, res) => {
  const link = await ProfileLink.findOne({ where: { id: req.params.linkId, userId: req.user.id } });
  if (!link) {
    return res.status(404).json({ message: 'Link not found' });
  }
  await link.destroy();
  return res.status(204).send();
};

const getPublicProfile = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({
    where: { username },
    include: [
      { model: ProfileLink, as: 'links', where: { isVisible: true }, required: false, separate: true, order: [['order', 'ASC']] },
      { model: Badge, as: 'badges' },
      { model: Template, as: 'template' }
    ]
  });

  if (!user) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  await analyticsService.incrementView(user.id, { source: req.headers.referer });

  return res.json(user);
};


const listTemplates = async (req, res) => {
  const where = req.user ? { [Op.or]: [{ isPublic: true }, { createdBy: req.user.id }] } : { isPublic: true };
  const templates = await Template.findAll({
    where,
    order: [['createdAt', 'DESC']]
  });
  return res.json(templates);
};

const registerClick = async (req, res) => {
  const { username, linkId } = req.params;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  const link = await ProfileLink.findOne({ where: { id: linkId, userId: user.id } });
  if (!link) {
    return res.status(404).json({ message: 'Link not found' });
  }

  await analyticsService.incrementClick(user.id, link.id, { source: req.headers.referer });
  return res.json({ message: 'Click registered' });
};

module.exports = {
  getProfile,
  updateProfile,
  createLink,
  updateLink,
  reorderLinks,
  deleteLink,
  getPublicProfile,
  registerClick,
  listTemplates
};
