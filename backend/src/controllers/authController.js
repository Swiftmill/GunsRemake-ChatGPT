const axios = require('axios');
const { z } = require('zod');
const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(32),
  displayName: z.string().min(2).max(64)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const register = async (req, res) => {
  try {
    const payload = registerSchema.parse(req.body);
    const existing = await User.findOne({ where: { email: payload.email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const usernameExists = await User.findOne({ where: { username: payload.username } });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username not available' });
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await User.create({
      email: payload.email,
      passwordHash,
      username: payload.username,
      displayName: payload.displayName
    });

    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.status(201).json({
      user,
      token
    });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to register' });
  }
};

const login = async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await comparePassword(payload.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.json({
      user,
      token
    });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    return res.status(500).json({ message: 'Unable to login' });
  }
};

const logout = async (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out' });
};

const exchangeDiscordToken = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Missing Discord authorization code' });
  }

  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token: accessToken } = tokenResponse.data;
    const profileResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const discordProfile = profileResponse.data;
    const email = discordProfile.email;
    if (!email) {
      return res.status(400).json({ message: 'Discord email permission is required' });
    }

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        passwordHash: await hashPassword(`${discordProfile.id}:${Date.now()}`),
        username: discordProfile.username,
        displayName: discordProfile.global_name || discordProfile.username,
        socialDiscord: discordProfile.username
      });
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.json({
      user,
      token
    });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    return res.status(500).json({ message: 'Discord authentication failed' });
  }
};

module.exports = {
  register,
  login,
  logout,
  exchangeDiscordToken
};
