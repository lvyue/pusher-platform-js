# pusher-platform.js

This is the official Pusher Platform client library for web browsers. Use it to build SDKs for services running on Pusher Platform / Elements infrastructure.

## Installation

We assume you use yarn/npm in your development workflow. You can grab it from the npm/yarn repository:

```bash
yarn add 'pusher-platform-js'
```

The latest working version will always be published there. 

If you like to live dangerously, you can check in the Releases tab on Github for the latest release, or clone a local version and refer to it using a relative path. 

## Usage and Features

### Importing

We assume you use Webpack or something similar:

Currently there are two ways to import it - either import the whole thing:

```javascript
import PusherPlatform from `pusher-platform`;

let app = new PusherPlatfrm.App(...);
```

Or import individual components:
Currently you can access:
- App
- BaseClient
- Subscription
- ResumableSubscription

```javascript
import { App, ResumableSubscription } from `pusher-platform`;

let app = new App(...);
```

### App

__note: App will be renamed soon, most likely to Instance__

This is the main entry point - represents a single Elements app.
Initialise with an `AppOptions` object that contains at least the `serviceId`.

AppOptions: 
```typescript
    serviceId: string; // Mandatory
    cluster?: string; // Defaults to "api-ceres.pusherplatform.io"
    encrypted?: boolean;

    client?: BaseClient; // You can provide custom implementation - this will probably be deprecated in the future
    tokenProvider?: TokenProvider; // You can provide custom implementation
    logger?: Logger; // You can provide custom implementation. Defaults to DefaultLogger
```

It has 3 methods of interest:

- `request(options: RequestOptions)`

For regular HTTP requests. Relays to BaseClient. Returns `Promise<any`.

RequestOptions:
```typescript
export interface RequestOptions {
  method: string;
  path: string;
  tokenProvider?: TokenProvider;
  jwt?: string;
  headers?: Headers;
  body?: any;
  retryStrategy?: RetryStrategy;
}
```

- `subscribe(options: SubscribeOptions)`

A subscription to events. Creates a SUBSCRIBE call using baseclient. Returns `Subscription`

- `resumableSubscribe(options: ResumableSubscribeOptions)`

Like a subscription, but allows you to specify a `lastEventId` that will return you all items from this ID. Example - Feeds. Returns `ResumableSubscription`

This is almost identical to Subscribe with the `lastEventId` and `retryStrategy`. By default it will use `ExponentialBackoffRetryStrategy`.

### BaseClient

This makes all the requests and executes them. They are [standard XHR objects](https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest). 
It also creates XHRs that are used to create instances of `Subscription` and `ResumableSubscription`

### Subscription

SubscribeOptions:
```typescript
export interface SubscribeOptions {
    path: string;
    tokenProvider?: TokenProvider;
    jwt?: string;
    lastEventId?: string;
    onOpen?: () => void;
    onEvent?: (event: Event) => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
    logger: Logger;
}
```

There are standard callbacks for different subscription events `onOpen`, `onEvent`, `onEnd`, and `onError`. 

Use `unsubscribe(err?: Error)` to close this subscription. It will either callback `onEnd` or `onError` depending on whether or not the `Error` object is passed to it as argument.

### ResumableSubscription

ResumableSubscribeOptions:
```typescript
export interface ResumableSubscribeOptions {
    path: string;
    lastEventId?: string;
    tokenProvider?: TokenProvider;
    onOpening?: () => void;
    onOpen?: () => void;
    onEvent?: (event: Event) => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
    retryStrategy?: RetryStrategy;
    logger?: Logger;
}
```

Works the same as Subscription with the optional `retryStrategy` and `lastEventId`.

### TokenProvider

This will probably change.

### RetryStrategy

__Note: currently this is not exported in the top-level.__

This is a simple add-on to your error handling that hooks onto the `onError` callbacks of a `Subscription`. If the `Error` object is deemed retryable it will retry. Returns a Promise of Error

`attemptRetry(error: Error): Promise<Error>;`

We currently provide one implementation: `ExponentialBackoffRetryStrategy` that naively retries a given number of times.

Configuration:

```typescript
    limit: number = 6;
    initialBackoffMilis: number = 1000;
    maxBackoffMilis: number = 30000;
    logger: Logger = DefaultLogger;
```

### Logger

It logs things. 
```typescript
export interface Logger {
    verbose(message: string, error?: Error);
    debug(message: string, error?: Error);
    info(message: string, error?: Error);
    warn(message: string, error?: Error);
    error(message: string, error?: Error);
}
```

Default implementation logs to console. You initiate it with a treshold for verbosity to filter log messages.

## Building

```bash
yarn install
yarn build  # creates target/pusher-platform.js and target/index.d.ts
```

This will create `target/pusher-platform.js` as the main library and `target/index.d.ts` as the typings file.

### Testing

We have 2 types of tests - unit and integration.

Use `yarn test-legacy` and `yarn test-jest` for unit tests

Integration testing is trickier as it requires a testing service to be running. Currently it runs locally on your machine but this will eventually be deployed behind the Elements bridge.

The repository for it is here: https://github.com/pusher/platform-lib-tester, and it requires a working Go installation.
Then hopefully just run from the main directory of that test library:

```bash
glide install
./scripts/build
./scripts/run
```

Then run tests (from this dir): `yarn test-integration`.
This will run tests and watch the `src/` and `test/` dirs to rebuild every time a file is changed. Good for development.

Once we have some sort of CI setup we'll be able to run just `yarn test` to get everything going and run just once.

## I need moar halp!

Ping someone in @pusher/sigsdk. Maybe @zmarkan.


