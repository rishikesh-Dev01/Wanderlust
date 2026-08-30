# Wanderlust Backend

This folder contains all **backend** code.

```
backend/
├── server.js          # entry point (loads .env, starts server)
├── schema.js          # Joi validation
├── package.json
├── .env               # env vars (MONGO_URI, SECRET, MAP_TOKEN, CLOUD_...)
└── src/
    ├── app.js         # Express app, session, passport, routers, views/static config
    ├── DB/db.js
    ├── cloudConfig.js
    ├── middleware.js
    ├── Controllers/ (listings, reviews, users)
    ├── Models/ (listings.models, review.model, user.model)
    ├── routers/ (listing, review, user)
    ├── Utils/ (wrapAsync, ExpressError)
    └── Init/ (data.js, index.js)
```

## Run

From project root:
```bash
npm run dev          # runs backend via npm --prefix backend
```

Or from `backend/`:
```bash
npm install
npm run dev          # nodemon server.js -> http://localhost:8080
node src/Init/index.js  # seed DB
```

Frontend views are at `../frontend/views` and static at `../frontend/public` (configured in `src/app.js`).
