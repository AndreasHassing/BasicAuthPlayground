# Basic Auth Playground: NodeJS

See the main [`../README.md`](../README.md) for general information.

This playground is built in JavaScript using NodeJS as a runtime.

The following features were built over the duration of a late evening and two glasses of water:

- `Basic` authentication challenge.
- Persistent authentication (using in-memory session cookie).
- Production-grade hashing of passwords, using `Argon2i` (also has a drop-in implementation of `bcrypt`, which is worse than `Argon2`, apparently).

I had planned to move the hashed passwords to a DB, but that seemed trivial and boring, so I skipped that in this playground.

## Instructions

1. Install packages:

   ```powershell
   npm install
   ```

1. Create `.env` file in the [`./nodejs`](./) folder and add a line with: `PEPPER="<value from below command>"`

   ```powershell
   npm run pepper
   ```

1. Modify [`./basic-authentication-middleware.js`](./basic-authentication-middleware.js) to your liking (add/remove users).

   1. To add a new user with username "`myusername`", modify `KnownUserCredentials`:
      ```javascript
      ["myusername"]: {
        passwordHash: "<string retrieved from hash function>",
      }
      ```
   1. To hash a password, run:

      ```powershell
      npm run hash -- argon "my password"
      ```

      - Can also use `bcrypt` instead of `argon`, but `argon` is recommended. See the main [`../README.md`](../README.md) for details.

1. Start the server

   ```powershell
   npm start
   ```
