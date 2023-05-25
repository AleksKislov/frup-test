# test

This project is a Node.js application that uses TypeScript, RabbitMQ, and MongoDB to perform certain tasks.

## Installation

Before running the application, make sure you have Node.js and npm installed on your machine.

1. Clone this repository to your local machine.
2. Navigate to the project's root directory.
3. Run the following command to install the dependencies:

```
npm install
```

## Configuration

The application requires some configuration settings to connect to RabbitMQ and MongoDB. You can set these settings by creating a `.env` file in the project's root directory and specifying the `DB_URI` and `MQ_URI` variables, for instance:

```
DB_URI=mongodb://localhost:27017/test?retryWrites=true&w=majority
MQ_URI=amqp://localhost:5672
```

Use the following docker command to start RabbitMQ:

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management
```

## Building the Application

To build the application and compile TypeScript files into JavaScript, run the following command:

```
npm run build
```

The compiled JavaScript files will be generated in the `dist` directory.

## Starting the Applications

The project consists of two applications: `app` and `sync`. You can start each application using the following commands:

- To start the `app` application in production mode, run:

```
npm run app
```

- To start the `sync` application in production mode, run:

```
npm run sync
```

- To start the `sync` application in production mode with full reindexing, run:

```
npm run reindex
```

- To start the `app` application in development mode (with automatic restart on file changes), run:

```
npm run dev
```

- To start the `sync` application in development mode, run:

```
npm run dev2
```

- To start the `sync` application in development mode with full reindexing, run:

```
npm run devf
```
