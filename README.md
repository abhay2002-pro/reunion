
# Social Media Platform

The project is the backend of a social media platform. The APIs support features like getting a user profile, follow a user, upload a post, delete a post, like a post, unlike a liked post, and comment on a post.


## Features

- Authenticate a user
- Follow a user
- Unfollow a user
- Create a post
- Delete a post
- Add comment to a post
- Like a post
- Unlike a post


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI`

`JWT_SECRET`

`BASE_URL` - Base url of where the backend is hosted

`SAMPLE_TOKEN` - JWT token for authenticated users

## Methods to run

### 1) Run using NPM

Clone the project

```bash
  git clone https://github.com/abhay2002-pro/reunion_assignment.git
```

Go to the project directory

```bash
  cd reunion_assignment
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

### 2) Run using Docker

Clone the project

```bash
  git clone https://github.com/abhay2002-pro/reunion_assignment.git
```

Go to the project directory

```bash
  cd reunion_assignment
```

Run the application

```bash
  docker compose up
```


## Tech Stack

**Server:** Node, Express

**Database:** Mongo DB

**Tests:** Chai and Mocha
