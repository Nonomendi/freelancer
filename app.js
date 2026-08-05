require('dotenv').config();

const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const site = require('./config/site');
const pageRoutes = require('./routes/pages');

const app = express();

// Vercel (and any reverse proxy) puts the real client IP in x-forwarded-for.
// Without this, req.ip is the proxy and per-IP rate limiting is meaningless.
app.set('trust proxy', true);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true, limit: '32kb' }));
app.use(express.json({ limit: '32kb' }));

app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0
  })
);

// Available to every template without being passed per-route.
app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.currentPath = req.path;
  res.locals.activeNav = null;
  res.locals.canonical = site.baseUrl + req.path;
  res.locals.bodyClass = '';
  next();
});

app.use('/', pageRoutes);

// 404 — must be registered after all real routes.
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page not found | Nolundi.dev',
    description: 'That page does not exist. Head back to the homepage or get in touch.',
    activeNav: null,
    noindex: true
  });
});

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity.
app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(500).render('pages/500', {
    title: 'Something went wrong | Nolundi.dev',
    description: 'An unexpected error occurred.',
    activeNav: null,
    noindex: true
  });
});

module.exports = app;
