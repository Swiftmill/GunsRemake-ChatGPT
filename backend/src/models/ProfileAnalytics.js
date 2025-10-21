const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProfileAnalytics = sequelize.define('ProfileAnalytics', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    metricDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    linkId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  });

  return ProfileAnalytics;
};
