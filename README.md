# Baileys + Express + Socket.IO + TypeScript

Welcome to the [baileys-express-socketio-boilerplate](https://github.com/feri-irawan/baileys-express-socketio-boilerplate) repository, initiated on October 24, 2023, around 9 PM.

This repository combines the technologies of [Baileys](https://github.com/WhiskeySockets/Baileys), [Express](https://github.com/expressjs/express), [Socket.IO](https://github.com/socketio/socket.io), and [TypeScript](https://github.com/microsoft/TypeScript). Baileys is used for interacting with WhatsApp Web, Express for server creation, Socket.IO for real-time communication, and TypeScript for type-based development.

## Usage Instructions
1. **Installation**
    ```
    yarn
    ```

2. **Running the Application**
    ```
    yarn dev
    ```

## Configuration
Make sure to configure the `wa.config.js` file correctly before running the application.

```javascript
/** @type {import('wa.config').Config} */
module.exports = {
    sessionName: 'my-session'
};
```

## Contribution
If you wish to contribute to this project, please create a pull request and follow the contribution guidelines.

## License
This project is licensed under the MIT license.

Thank you, and hope it proves useful. Feel free to report issues or provide suggestions.
