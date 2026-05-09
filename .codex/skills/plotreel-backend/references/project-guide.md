# Plotreel Backend Project Guide

## Runtime

- Stack: Node.js, Express 4, CommonJS modules, Joi, Mongoose, JWT, morgan, cors, dotenv.
- Default server address: `http://127.0.0.1:47845`.
- Config file selection: `config/index.js` reads `.env.${NODE_ENV || 'dev'}`.
- Common scripts:
  - `npm run dev`: `NODE_ENV=dev nodemon server.js`
  - `npm start`: `node server.js`
  - `npm run test`: `NODE_ENV=test nodemon server.js`

## Response Shape

All JSON responses should conform to:

```json
{
  "code": 200,
  "data": {},
  "resMsg": []
}
```

`middlewares/response.middleware.js` wraps `res.json` and defaults missing fields:

- `code`: `payload.code ?? 200`
- `data`: `payload.data ?? {}`
- `resMsg`: `payload.resMsg ?? []`

Existing success responses often use `resMsg: ['success']`; preserve that unless the user requests a response-contract change.

## Error Handling

Controllers should use this shape:

```js
exports.action = async (req, res, next) => {
  try {
    return res.json({ code: 200, data: { resData: {} }, resMsg: ['success'] });
  } catch (error) {
    next(error);
  }
};
```

`middlewares/error.middleware.js` returns:

```js
res.status(err.status || 500).json({
  code: err.code || 500,
  data: {},
  resMsg: [err.message || 'Internal Server Error']
});
```

## Current Endpoints

### POST `/pnt/api/upgrade/last`

- Mounted from `app.js` via `app.use('/pnt/api/upgrade', routes.upgrade)`.
- Route file: `routes/upgrade.route.js`.
- Controller: `controllers/upgrade.controller.js`, `checkLast`.
- Current response data:

```json
{
  "resData": {
    "remark": true,
    "upgradeType": false
  }
}
```

### POST `/videomaker/aihost/getMtk`

- Mounted from `app.js` via `app.use('/videomaker/aihost', routes.aihost)`.
- Route file: `routes/aihost.route.js`.
- Controller: `controllers/aihost.controller.js`, `getMtk`.
- Current response data:

```json
{
  "resData": {
    "password": "example-password",
    "account": "example-account",
    "mtk": "1111example-mtk"
  }
}
```

## Validation

- Validators live in `validators/*.validator.js`.
- Use Joi schemas and export the schema object.
- The shared validation middleware currently validates only `req.body`.
- For no-parameter endpoints, existing validators export `Joi.object({})`.

Example:

```js
const Joi = require('joi');

module.exports = Joi.object({
  id: Joi.string().required()
});
```

Then wire it into the route:

```js
router.post('/path', validate(schema), controller.action);
```

## Auth And CORS

- CORS origin comes from `FRONTEND_ORIGIN`, defaulting to `http://localhost:3000`.
- `auth.middleware.js` validates `Authorization: Bearer <token>` using `TOKEN_SECRET`.
- The global auth line in `app.js` is currently commented:

```js
// app.use('/pnt/api', authMiddleware);
```

Do not enable authentication broadly unless the user explicitly asks or the endpoint requirement calls for it.

## Manual Request Examples

Use `test.http` as the local scratch file for endpoint checks. Existing examples include:

```http
POST http://127.0.0.1:47845/videomaker/aihost/getMtk
Content-Type: application/json
Authorization: Bearer test-token

{}
```

```http
POST http://127.0.0.1:47845/pnt/api/upgrade/last
Content-Type: application/json
Authorization: Bearer test-token

{}
```

## Local Cautions

- `app.js` calls `connectDB()` at app initialization; running the server requires a valid `MONGO_URI`.
- `controllers/upgrade.controller.js` currently contains a bare `debugger` statement. Treat it as existing project state; remove it only when doing cleanup or when it affects the requested task.
- This directory may not be a git repository. Check `git status` before relying on git workflows.
