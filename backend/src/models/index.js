const { sequelize } = require('../config/database');
const defineUser = require('./User');
const defineProfileLink = require('./ProfileLink');
const defineBadge = require('./Badge');
const defineUserBadge = require('./UserBadge');
const defineTemplate = require('./Template');
const defineAsset = require('./Asset');
const defineProfileAnalytics = require('./ProfileAnalytics');

const User = defineUser(sequelize);
const ProfileLink = defineProfileLink(sequelize);
const Badge = defineBadge(sequelize);
const UserBadge = defineUserBadge(sequelize);
const Template = defineTemplate(sequelize);
const Asset = defineAsset(sequelize);
const ProfileAnalytics = defineProfileAnalytics(sequelize);

User.hasMany(ProfileLink, { as: 'links', foreignKey: 'userId' });
ProfileLink.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Badge, { through: UserBadge, as: 'badges' });
Badge.belongsToMany(User, { through: UserBadge, as: 'users' });
UserBadge.belongsTo(User, { foreignKey: 'userId' });
UserBadge.belongsTo(Badge, { foreignKey: 'badgeId' });

User.belongsTo(Template, { as: 'template', foreignKey: 'templateId' });
Template.hasMany(User, { foreignKey: 'templateId' });
Template.belongsTo(User, { as: 'owner', foreignKey: 'createdBy' });

User.hasMany(Asset, { as: 'assets', foreignKey: 'userId' });
Asset.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ProfileAnalytics, { as: 'analytics', foreignKey: 'userId' });
ProfileAnalytics.belongsTo(User, { foreignKey: 'userId' });
ProfileAnalytics.belongsTo(ProfileLink, { foreignKey: 'linkId', as: 'link' });

module.exports = {
  sequelize,
  User,
  ProfileLink,
  Badge,
  UserBadge,
  Template,
  Asset,
  ProfileAnalytics
};
