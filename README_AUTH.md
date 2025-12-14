PokeDex Tracker - Modified for Username+Password Login (Local MySQL)

What I added:
- server/ (Express + MySQL + JWT auth)
- src/api/* client for auth and pokedex
- src/context/AuthContext.js to manage auth and pokedex sync
- src/pages/Login.js and src/pages/Register.js
- src/components/ProtectedRoute.js
- App.js updated to include routes
- server/init_db.sql to create database and tables

How to run (local development with MAMP/MySQL):
1. In MAMP (or your MySQL), create database by running `server/init_db.sql`.
2. Configure `.env` in `server/`:
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=pokedb
   JWT_SECRET=algumsegredo
3. Install server deps:
   cd server
   npm install
4. Start server:
   node server.js
5. Start frontend:
   In project root, run `npm install` (if not done) and `npm start`.

Notes:
- The AuthContext stores token and user in localStorage, and syncs pokedex on login.
- The toggleCaught function updates local cache and pushes individual updates to server.
