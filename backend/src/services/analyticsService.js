const dayjs = require('dayjs');
const { ProfileAnalytics, ProfileLink } = require('../models');

const incrementView = async (userId, metadata = {}) => {
  const today = dayjs().format('YYYY-MM-DD');
  const [record] = await ProfileAnalytics.findOrCreate({
    where: { userId, metricDate: today, linkId: null },
    defaults: { views: 0, clicks: 0 }
  });

  record.views += 1;
  record.metadata = { ...record.metadata, ...metadata };
  await record.save();
};

const incrementClick = async (userId, linkId, metadata = {}) => {
  const today = dayjs().format('YYYY-MM-DD');
  const [record] = await ProfileAnalytics.findOrCreate({
    where: { userId, metricDate: today, linkId },
    defaults: { views: 0, clicks: 0 }
  });

  record.clicks += 1;
  record.metadata = { ...record.metadata, ...metadata };
  await record.save();

  await ProfileLink.increment('clicks', { where: { id: linkId } });
};

const getAnalyticsSummary = async (userId) => {
  const records = await ProfileAnalytics.findAll({
    where: { userId },
    order: [['metricDate', 'DESC']],
    limit: 30
  });

  const totals = records.reduce(
    (acc, record) => {
      acc.views += record.views;
      acc.clicks += record.clicks;
      return acc;
    },
    { views: 0, clicks: 0 }
  );

  return {
    totals,
    records
  };
};

module.exports = {
  incrementView,
  incrementClick,
  getAnalyticsSummary
};
