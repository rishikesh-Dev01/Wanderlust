# Wanderlust Frontend

This folder contains all **frontend** code (EJS templates + static assets).

```
frontend/
├── views/
│   ├── layouts/boilerplate.ejs
│   ├── listings/ (index, show, new, edit)
│   ├── Users/ (login, signup)
│   ├── includes/ (navbar, footer, flash)
│   └── error.ejs
└── public/
    ├── css/ (style.css, rating.css)
    └── js/ (script.js, map.js)
```

- Served by `backend/src/app.js` via:
  ```js
  app.set('views', path.join(__dirname, '../../frontend/views'));
  app.use(express.static(path.join(__dirname, '../../frontend/public')));
  ```
- No build step required (server-rendered EJS). For future SPA (React/Vite), add build tooling here.
