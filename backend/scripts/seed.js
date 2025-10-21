/* eslint-disable no-console */
const dotenv = require('dotenv');
const { sequelize, User, Badge, Template, ProfileLink } = require('../src/models');
const { hashPassword } = require('../src/utils/password');

dotenv.config();

const createUserWithProfile = async ({
  email,
  password,
  username,
  displayName,
  bio,
  role,
  location,
  badges = [],
  links = [],
  template,
  socialDiscord
}) => {
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email,
    passwordHash,
    username,
    displayName,
    bio,
    role,
    location,
    socialDiscord
  });

  for (const link of links) {
    await ProfileLink.create({ ...link, userId: user.id });
  }

  if (template) {
    await user.update({ templateId: template.id });
  }

  if (badges.length) {
    await user.addBadges(badges);
  }

  return user;
};

const run = async () => {
  await sequelize.sync({ force: true });

  const verifiedBadge = await Badge.create({
    name: 'verified',
    description: 'Verified Guns profile',
    iconUrl: 'https://cdn.gunsremake.local/badges/verified.svg',
    color: '#00E0FF'
  });
  const premiumBadge = await Badge.create({
    name: 'premium',
    description: 'Premium supporter',
    iconUrl: 'https://cdn.gunsremake.local/badges/premium.svg',
    color: '#FF8A65',
    isPremium: true
  });

  const midnightTemplate = await Template.create({
    name: 'Midnight Pulse',
    description: 'Dark neon gradients and glow',
    data: {
      accentColor: '#9a6cff',
      textColor: '#ffffff',
      backgroundGradient: ['#14042c', '#1f0a3f'],
      glowIntensity: 0.8
    },
    isPublic: true
  });

  await createUserWithProfile({
    email: 'admin@gunsremake.local',
    password: 'ChangeMe123!',
    username: 'admin',
    displayName: 'guns admin',
    bio: 'System administrator for guns remake.',
    role: 'admin',
    location: 'guns HQ',
    badges: [verifiedBadge, premiumBadge],
    links: [
      { title: 'Community Discord', url: 'https://discord.gg/guns', order: 1, icon: 'discord' },
      { title: 'Status Page', url: 'https://status.gunsremake.local', order: 2, icon: 'status' }
    ],
    template: midnightTemplate,
    socialDiscord: 'gunsadmin'
  });

  await createUserWithProfile({
    email: 'swift@gunsremake.local',
    password: 'ChangeMe123!',
    username: 'swift',
    displayName: 'swift',
    bio: 'speedrunner, building the future of guns.lol clones',
    role: 'user',
    location: 'guns HQ',
    badges: [verifiedBadge],
    links: [
      { title: 'Portfolio', url: 'https://swift.dev', order: 1, icon: 'globe' },
      { title: 'Soundcloud', url: 'https://soundcloud.com/swift', order: 2, icon: 'music' }
    ],
    template: midnightTemplate,
    socialDiscord: 'swift#0001'
  });

  await createUserWithProfile({
    email: 'hris@gunsremake.local',
    password: 'ChangeMe123!',
    username: 'hris',
    displayName: 'hris',
    bio: 'full-stack designer crafting premium skins.',
    role: 'user',
    location: 'guns HQ',
    badges: [premiumBadge],
    links: [
      { title: 'Shop', url: 'https://hris.shop', order: 1, icon: 'cart' },
      { title: 'Instagram', url: 'https://instagram.com/hris', order: 2, icon: 'instagram' }
    ],
    template: midnightTemplate,
    socialDiscord: 'hris#0001'
  });

  await createUserWithProfile({
    email: 'moh@gunsremake.local',
    password: 'ChangeMe123!',
    username: 'moh',
    displayName: 'moh',
    bio: 'analytics master keeping the dashboards fresh.',
    role: 'user',
    location: 'guns HQ',
    badges: [],
    links: [
      { title: 'Twitter', url: 'https://twitter.com/moh', order: 1, icon: 'twitter' },
      { title: 'YouTube', url: 'https://youtube.com/@moh', order: 2, icon: 'youtube' }
    ],
    template: midnightTemplate,
    socialDiscord: 'moh#0001'
  });

  console.log('Seed data created. Admin login: admin@gunsremake.local / ChangeMe123!');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
