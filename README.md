# server-to-client
 A social network ran by an SQLite server and used by React Native clients.
 
 Supposed to be a social network where users can upload quotes that relates to books, but havent implemented post upload system yet.
 
 Features user registration and login, with a view on profiles. 
## Using
 Client side uses `react-navigation` and `tailwind-rn` while server side uses `express` and `better-sqlite3`
## Features
- User registration with countries
- User login using hashed passwords
- User profile setup and update
- Profile view
### TODO
- Add date of birth to `client/UserProfile.js`
- Post upload system
- Profile search system
- Maybe book system in the future
## How To Run
 Run `npm install` in both the client folder and the server folder.
 Server side:
  Run server/index.js using node
 Client side:
  Run React Native using expo
  `node start`
