# DevPulse

A backend platform for software teams to report issue,bug, suggest feature

## Live URL

https://assignment-2-five-gold.vercel.app

## Features

- Secure user registration and login using JWT authentication
- Role-based authorization system
- Password hashing using bcrypt
- Authorized user can create issue
- Sort issues by newest and oldest
- Filter issues by type and status
- Update issue with permission control
- Only maintainer can DELETE issue

## Tech Stack

- Typescript
- Express
- JWT
- bcrypt
- PostgreSQL
- tsup
- pg
- cors
- dotenv

## Setup steps

### 1. Clone the repository

- `git clone https://github.com/nipaayasha05/devPulse-backend`

### 2. Move to project directory

- `cd devPulse-backend`

### 3. Install dependencies

- `npm install`

### 4. Create `.env` file

- ```env
  - PORT=3000
  - DATABASE_URL=your_postgresql_database_url
  - JWT_SECRET=your_secret_key
  ```

### 5. Run the project

- `npm run dev`

## API endpoints

### Authentication

- User registration
  - POST /api/auth/signup
- User login
  - POST /api/auth/login

### Issues

- Create issue (only authorized user)
  - POST /api/issues
- Get all issues
  - GET /api/issues
- Get single issue
  - GET /api/issues/:id
- Update issue (maintainer (any issue) or contributor (own issue, only if status is open))
  - PATCH /api/issues/:id
- Delete issue (only maintainer can DELETE issue)
  - DELETE /api/issues/:id

## Database schema

### Users table

- id (SERIAL PRIMARY KEY)
- name (VARCHAR(75) NOT NULL)
- email (VARCHAR(75) UNIQUE NOT NULL)
- password (TEXT NOT NULL)
- role (VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')))
- created_at (TIMESTAMP DEFAULT NOW())
- updated_at (TIMESTAMP DEFAULT NOW())

### Issues table

- id (SERIAL PRIMARY KEY)
- title (VARCHAR(150) NOT NULL)
- description (TEXT NOT NULL)
- type (VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')))
- status (VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')))
- reporter_id (INT NOT NULL)
- created_at (TIMESTAMP DEFAULT NOW())
- updated_at (TIMESTAMP DEFAULT NOW())
