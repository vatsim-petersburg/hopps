# 🐇 Hopps (yes, like Judy Hopps)
###### And she is a rabbit, you know
[Idea behind Hopps](#idea-behind-hopps) | [Examples](#examples) | [Contributing](#contributing) | [Credits](#credits) | [License](#license)

Hopps is a **heavily opinionated wrapper** around [amqplib](https://www.npmjs.com/package/amqplib) for Node.js.

It abstracts away the repetitive setup and message-handling boilerplate when working with RabbitMQ,
while keeping the API minimal, explicit, and type-safe.

Hopps provides a structured convention for declaring inbound and outbound queues,
automatic consumer registration, and reply correlation handling —
ideal for event-driven microservices and RPC-style messaging.

## Installation
```shell
npm install hopps
# or
pnpm add hopps
# or
yarn add hopps
```

## Idea behind Hopps
Hopps enforces strict conventions designed to keep your messaging code predictable and clean.

Some design opinions include:
- **Type-driven queue definitions** — every queue name is declared upfront
- **Automatic queue assertion** — no need to call assertQueue() manually
- **Built-in DRT (Direct Reply-To) pattern support** for request-response flows
- **Consumer error isolation** — failed consumers are nack’d safely, without crashing the process
- **Minimal surface API** — just `sendToQueue` and (optionally) `sendAndWaitForReply`

Hopps is designed for developers who _already know_ how RabbitMQ works,
but don’t want to write the same setup code every time.

### Recommended setup
- Don't forget to target `es2017` or higher for top-level await to work
- Use **durable queues** (already enforced by default)
- Combine with your **own reconnection logic** if RabbitMQ restarts

## Examples
### Basic usage
```typescript
import hopps, { Queue } from 'hopps';

type QuxPayload = { mom: string };
const quxQuzHandler: Queue<QuxPayload> = {
    name: 'qux.quz',
    consumer: (msg) => {
        console.log('consumed', msg.content.mom);
    }
}

const amqp = await hopps({
  rabbitMqUrl: 'amqp://localhost',
  inboundQueues: [quxQuzHandler],
  outboundQueues: ['foo.bar.baz', 'baz.bar.foo']
});

type FooPayload = { hi: string };
amqp.sendToQueue<FooPayload>(amqp.outbound.FOO_BAR_BAZ, { hi: 'mom' });
```

### Direct Reply-To (DRT)
```typescript
import hopps from 'hopps';

const amqp = await hopps({
  rabbitMqUrl: 'amqp://localhost',
  outboundQueues: ['foo.bar.baz', 'baz.bar.foo'],
  consumeDRT: true  
});

type Payload = { hi: string };
type Response = { mom: string };
const { mom } = await amqp.sendAndWaitForReply<Payload, Response>(amqp.outbound.FOO_BAR_BAZ, { hi: 'mom' });
```

## Contributing
If you have suggestions for how Hopps could be improved, 
or want to report a bug, open an issue! We'd love all and any contributions.

- 💬 Open an issue or discussion before major changes — the API is intentionally minimal
- 🔍 Follow the established style: explicit naming, no hidden magic

## Credits
- **[amqplib](https://www.npmjs.com/package/amqplib)** — the core RabbitMQ library
- **[RabbitMQ](https://www.rabbitmq.com/) team** — for the excellent message broker

## License
Copyright 2025 Denis Zhmurenko

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.