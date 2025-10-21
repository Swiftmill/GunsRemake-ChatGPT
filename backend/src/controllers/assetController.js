const { Asset } = require('../models');
const { getPublicUrl } = require('../services/storageService');

const listAssets = async (req, res) => {
  const assets = await Asset.findAll({ where: { userId: req.user.id } });
  return res.json(assets);
};

const uploadAsset = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const asset = await Asset.create({
    userId: req.user.id,
    key: req.file.filename,
    url: getPublicUrl(req.file.filename),
    type: req.file.mimetype.startsWith('video') ? 'video' : req.file.mimetype.startsWith('audio') ? 'audio' : 'image',
    size: req.file.size,
    metadata: {
      originalName: req.file.originalname
    }
  });

  return res.status(201).json(asset);
};

const deleteAsset = async (req, res) => {
  const asset = await Asset.findOne({ where: { id: req.params.assetId, userId: req.user.id } });
  if (!asset) {
    return res.status(404).json({ message: 'Asset not found' });
  }
  await asset.destroy();
  return res.status(204).send();
};

module.exports = {
  listAssets,
  uploadAsset,
  deleteAsset
};
