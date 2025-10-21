const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assetRoutes = require('./routes/assetRoutes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || true,
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/admin', adminRoutes);
app.use('/assets', assetRoutes);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected error' });
});

const init = async () => {
  await sequelize.sync();
};

module.exports = {
  app,
  init
};
