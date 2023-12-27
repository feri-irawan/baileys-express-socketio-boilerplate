# Baileys + Express + Socket.IO + TypeScript

Selamat datang di repositori [baileys-express-socketio-boilerplate](https://github.com/feri-irawan/baileys-express-socketio-boilerplate), mulai dibuat pada 24 Oktober 2023 sekitar pukul 9 malam.

> Lihat proyek serupa: [WhatsApp-Web.js + Express + Socket.io + TypeScript Boilerplate](https://github.com/feri-irawan/wwebjs-express-socketio-boilerplate)

Repositori ini merupakan proyek yang menggabungkan teknologi [Baileys](https://github.com/WhiskeySockets/Baileys), [Express](https://github.com/expressjs/express), [Socket.IO](https://github.com/socketio/socket.io), dan [TypeScript](https://github.com/microsoft/TypeScript). Baileys digunakan untuk berinteraksi dengan WhatsApp Web, Express untuk pembuatan server, Socket.IO untuk komunikasi real-time, dan TypeScript untuk pengembangan berbasis tipe.

## Petunjuk Penggunaan

1. **Instalasi**

   ```
   git clone git@github.com:feri-irawan/baileys-express-socketio-boilerplate.git
   yarn
   ```

2. **Menjalankan Aplikasi**
   ```
   yarn dev
   ```

## Konfigurasi

Pastikan untuk mengonfigurasi file `wa.config.ts` dengan benar sebelum menjalankan aplikasi.

```ts
export default {
  sessionName: 'my-session',
}
```

## Membuat perintah

Buat file command.js di folder `src/commands` dan import di `src/commands/index.ts`, contoh:

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

## Membuat Route

Buat file route.js di folder `src/routes` dan import di `src/routes/index.ts`, contoh:

```ts
// src/routes/ping.ts
import { Route } from '@/lib/server'
import { sock, status } from '@/lib/wa'

export const pingRoute: Route = {
  path: '/ping',
  method: 'GET',
  handler: async (req, res) => {
    if (status === 'open') {
      const [receiver] = await sock.onWhatsApp('123456789') // 123456789 adalah nomor kontak

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

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan buat _pull request_ dan ikuti panduan kontribusi.

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT.

Terima kasih, semoga bermanfaat. Jangan ragu untuk melaporkan masalah atau memberikan saran.
