# Baileys + Express + Socket.IO + TypeScript

Welcome to the [baileys-express-socketio-boilerplate](https://github.com/feri-irawan/baileys-express-socketio-boilerplate) repository, started on October 24, 2023, around 9 PM.

> See similar project: [WhatsApp-Web.js + Express + Socket.io + TypeScript Boilerplate](https://github.com/feri-irawan/wwebjs-express-socketio-boilerplate)

This repository is a project that combines the technologies of [Baileys](https://github.com/WhiskeySockets/Baileys), [Express](https://github.com/expressjs/express), [Socket.IO](https://github.com/socketio/socket.io), and [TypeScript](https://github.com/microsoft/TypeScript). Baileys is used for interacting with WhatsApp Web, Express for server creation, Socket.IO for real-time communication, and TypeScript for type-based development.

## User Guide

1. **Installation**

   ```
   git clone git@github.com:feri-irawan/baileys-express-socketio-boilerplate.git
   yarn
   ```

2. **Running the Application**
   ```
   yarn dev
   ```

## Configuration

Make sure to configure the `wa.config.ts` file correctly before running the application.

```ts
export default {
  sessionName: 'my-session',
}
```

## Creating Commands

Create a `command.js` file in the `src/commands` folder and import it into `src/commands/index.ts`, for example:

```ts
// src/commands/ping.ts
import { Command } from '@/lib/wa'

export const pingCommand: Command = {
  name: 'ping',
  description: 'Ping!',
  handler: async ({ sock, message }) => {
    await sock.sendMessage(message.key.remoteJid!, { text: 'Pong!' })
  },
}
```

```ts
// src/commands/index.ts
import { Command } from '@/lib/wa'
import { pingCommand } from './ping'

export const commands: Command[] = [pingCommand]
```

## Creating Routes

Create a `route.js` file in the `src/routes` folder and import it into `src/routes/index.ts`, for example:

```ts
// src/routes/ping.ts
import { Route } from '@/lib/server'
import { sock, status } from '@/lib/wa'

export const pingRoute: Route = {
  path: '/ping',
  method: 'GET',
  handler: async (req, res) => {
    if (status === 'open') {
      const [receiver] = await sock.onWhatsApp('123456789') // 123456789 is the contact number

      if (receiver.exists) {
        await sock.sendMessage(receiver.jid, { text: 'Pong!' })
        res.send('Pong!')
      }

      return
    }

    res.status(500).send('Server is not open')
  },
}
```

```ts
// src/routes/index.ts
import { Route } from '@/lib/wa'
import { pingRoute } from './ping'

export const routes: Route[] = [pingRoute]
```

## Contribution

If you want to contribute to this project, please create a pull request and follow the contribution guidelines.

## License

This project is licensed under the MIT license.

Thank you, and hope it is useful. Feel free to report issues or provide suggestions.
