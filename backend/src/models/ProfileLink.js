const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProfileLink = sequelize.define('ProfileLink', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    icon: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return ProfileLink;
};
