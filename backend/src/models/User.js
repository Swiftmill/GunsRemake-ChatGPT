const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true
    },
    displayName: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    backgroundMediaUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    backgroundMediaType: {
      type: DataTypes.ENUM('image', 'video'),
      defaultValue: 'image'
    },
    musicUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    musicAutoplay: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    musicLoop: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    profileOpacity: {
      type: DataTypes.FLOAT,
      defaultValue: 0.8
    },
    profileBlur: {
      type: DataTypes.FLOAT,
      defaultValue: 20
    },
    location: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    socialDiscord: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    profileStats: {
      type: DataTypes.JSONB,
      defaultValue: {
        views: 0,
        clicks: 0
      }
    }
  });

  return User;
};
