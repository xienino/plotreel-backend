➜  plotreel-backend git:(main) ✗ npm run dev
npm warn config production Use `--omit=dev` instead.

> plotreel-backend@1.0.0 dev
> NODE_ENV=dev nodemon server.js

[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Server running at http://127.0.0.1:47845 in dev mode
MySQL connection error: Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
    at Sequence._packetToError (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/protocol/sequences/Sequence.js:47:14)
    at Handshake.ErrorPacket (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/protocol/sequences/Handshake.js:123:18)
    at Protocol._parsePacket (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/protocol/Protocol.js:291:23)
    at Parser._parsePacket (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/protocol/Parser.js:433:10)
    at Parser.write (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/protocol/Parser.js:43:10)
    at Protocol.write (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/protocol/Protocol.js:38:16)
    at Socket.`<anonymous>` (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/Connection.js:88:28)
    at Socket.`<anonymous>` (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/Connection.js:526:10)
    at Socket.emit (node:events:507:28)

| at addChunk (node:internal/streams/readable:559:12)                                                                 |
| ------------------------------------------------------------------------------------------------------------------- |
| at Protocol._enqueue (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/protocol/Protocol.js:144:48)  |
| at Protocol.handshake (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/protocol/Protocol.js:51:23)  |
| at Connection.connect (/Users/xieyumeng/coding/plotreel-backend/node_modules/mysql/lib/Connection.js:116:18)        |
| at connectDB (/Users/xieyumeng/coding/plotreel-backend/config/db.js:7:6)                                            |
| at Object.`<anonymous>` (/Users/xieyumeng/coding/plotreel-backend/app.js:14:1)                                    |
| at Module._compile (node:internal/modules/cjs/loader:1734:14)                                                       |
| at Object..js (node:internal/modules/cjs/loader:1899:10)                                                            |
| at Module.load (node:internal/modules/cjs/loader:1469:32)                                                           |
| at Function._load (node:internal/modules/cjs/loader:1286:12)                                                        |
| at TracingChannel.traceSync (node:diagnostics_channel:322:14) {                                                     |
| code: 'ER_NOT_SUPPORTED_AUTH_MODE',                                                                                 |
| errno: 1251,                                                                                                        |
| sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client', |
| sqlState: '08004',                                                                                                  |
| fatal: true                                                                                                         |
| }                                                                                                                   |
| MySQL is unavailable in dev mode; server will keep running, but database queries may fail.                          |
