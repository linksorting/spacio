import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

const port = Number(process.env.PORT || 4000);
const appId = process.env.APP_ID || 'designer-pro-local';
const appName = process.env.APP_NAME || 'Designer Pro';
const authRequired = (process.env.AUTH_REQUIRED || 'false').toLowerCase() === 'true';
const tokenExpiresIn = process.env.TOKEN_EXPIRES_IN || '12h';
const jwtSecret = process.env.JWT_SECRET || 'change-me-in-production';
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

const fallbackUsers = [
  {
    id: '1',
    email: 'admin@designerpro.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    registered: true
  }
];

const parseUsers = () => {
  const rawUsers = process.env.USERS_JSON;
  if (!rawUsers) {
    return fallbackUsers;
  }

  try {
    const parsedUsers = JSON.parse(rawUsers);
    if (!Array.isArray(parsedUsers) || parsedUsers.length === 0) {
      return fallbackUsers;
    }
    return parsedUsers;
  } catch (error) {
    console.warn('Invalid USERS_JSON value; using fallback user list.');
    return fallbackUsers;
  }
};

const users = parseUsers();

const safeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  registered: user.registered !== false
});

const isUserRegistered = (user) => user?.registered !== false;

const buildAuthRequiredError = () => ({
  message: 'Authentication required',
  extra_data: {
    reason: 'auth_required'
  }
});

const buildUserNotRegisteredError = () => ({
  message: 'User not registered for this app',
  extra_data: {
    reason: 'user_not_registered'
  }
});

const getBearerToken = (authHeader = '') => {
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7).trim();
};

const getCurrentUser = (request) => {
  const token = getBearerToken(request.headers.authorization || '');
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    return users.find((user) => user.id === payload.sub) || null;
  } catch (error) {
    return null;
  }
};

app.use(cors({
  origin: frontendOrigin === '*' ? true : frontendOrigin
}));
app.use(express.json());

app.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    service: 'designer-pro-backend'
  });
});

app.get('/api/apps/public/prod/public-settings/by-id/:requestedAppId', (request, response) => {
  if (request.params.requestedAppId !== appId) {
    return response.status(404).json({
      message: 'Application not found'
    });
  }

  const currentUser = getCurrentUser(request);

  if (authRequired && !currentUser) {
    return response.status(403).json(buildAuthRequiredError());
  }

  if (currentUser && !isUserRegistered(currentUser)) {
    return response.status(403).json(buildUserNotRegisteredError());
  }

  return response.json({
    id: appId,
    public_settings: {
      app_name: appName,
      auth_required: authRequired
    }
  });
});

app.post('/api/auth/login', (request, response) => {
  const { email, password } = request.body || {};
  if (!email || !password) {
    return response.status(400).json({
      message: 'Email and password are required'
    });
  }

  const user = users.find((candidate) => (
    candidate.email.toLowerCase() === String(email).toLowerCase()
  ));

  if (!user || user.password !== password) {
    return response.status(401).json({
      message: 'Invalid email or password'
    });
  }

  if (!isUserRegistered(user)) {
    return response.status(403).json(buildUserNotRegisteredError());
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    jwtSecret,
    {
      expiresIn: tokenExpiresIn
    }
  );

  return response.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in: tokenExpiresIn,
    user: safeUser(user)
  });
});

app.get('/api/auth/me', (request, response) => {
  const currentUser = getCurrentUser(request);
  if (!currentUser) {
    return response.status(401).json({
      message: 'Unauthorized'
    });
  }

  if (!isUserRegistered(currentUser)) {
    return response.status(403).json(buildUserNotRegisteredError());
  }

  return response.json(safeUser(currentUser));
});

app.post('/api/auth/logout', (request, response) => {
  response.status(204).send();
});

app.use((request, response) => {
  response.status(404).json({
    message: 'Route not found'
  });
});

app.listen(port, () => {
  console.log(`Designer Pro backend listening on http://localhost:${port}`);
});
