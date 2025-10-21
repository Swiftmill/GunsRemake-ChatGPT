const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserBadge = sequelize.define('UserBadge', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  return UserBadge;
};
