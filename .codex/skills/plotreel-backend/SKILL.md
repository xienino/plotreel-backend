---
name: plotreel-backend
description: Work on the Plotreel backend Node.js/Express project. Use when implementing or reviewing API routes, controllers, Joi validators, middleware, MongoDB configuration, response/error handling, local run commands, or frontend integration endpoints in the plotreel-backend repository.
---

# Plotreel Backend

## Core Workflow

1. Start by reading the touched route, controller, validator, and middleware files instead of guessing from names.
2. Preserve the existing CommonJS + Express style: `require`, `module.exports`, `express.Router()`, and controller functions exported as `exports.name = async (req, res, next) => { ... }`.
3. Keep endpoint changes aligned across `routes/`, `controllers/`, optional `validators/`, and `routes/index.js` or `app.js` mounts when a new module is introduced.
4. Return responses through `res.json({ code, data, resMsg })`; the response middleware normalizes missing fields.
5. Put thrown/async errors through `next(error)` so `middlewares/error.middleware.js` owns the error shape.
6. Prefer small, endpoint-focused edits. Avoid broad refactors unless the user asks for project cleanup.

## Project Map

- Entry point: `server.js` listens on `127.0.0.1:${config.port}`; default port is `47845`.
- App setup: `app.js` connects MongoDB, installs JSON/body parsing, morgan, CORS, response middleware, route mounts, and final error middleware.
- Route mounts:
  - `/pnt/api/upgrade` -> `routes/upgrade.route.js`
  - `/videomaker/aihost` -> `routes/aihost.route.js`
- Config: `config/index.js` loads `.env.${NODE_ENV || 'dev'}`.
- Validation: `middlewares/validate.middleware.js` validates `req.body` with Joi and returns HTTP 400 with `{ code: 400, data: {}, resMsg: [...] }`.
- Auth: `middlewares/auth.middleware.js` expects `Authorization: Bearer <token>`, but the global auth mount in `app.js` is currently commented out.

For endpoint details, response examples, and local commands, read `references/project-guide.md` when the task touches API behavior or setup.

## Implementation Patterns

When adding a POST endpoint to an existing module:

```js
// routes/example.route.js
const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example.controller');
const validate = require('../middlewares/validate.middleware');
const exampleValidator = require('../validators/example.validator');

router.post('/path', validate(exampleValidator), exampleController.methodName);

module.exports = router;
```

```js
// controllers/example.controller.js
exports.methodName = async (req, res, next) => {
  try {
    const data = { resData: {} };
    return res.json({ code: 200, data, resMsg: ['success'] });
  } catch (error) {
    next(error);
  }
};
```

Only add `validate(...)` when the endpoint actually needs request-body validation, or when the surrounding module already uses it consistently.

## Verification

- Use `npm run dev` for local development (`NODE_ENV=dev nodemon server.js`).
- Use `npm start` for a plain Node start.
- Check endpoint examples in `test.http` when validating manually.
- If running the server fails because `MONGO_URI` is absent or MongoDB is unavailable, report that clearly instead of masking the startup failure.
