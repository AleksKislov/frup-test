# test

This project is a Node.js application that uses TypeScript and MongoDB (with change stream) to perform certain tasks.

## Installation

Before running the application, make sure you have Node.js and npm installed on your machine.

1. Clone this repository to your local machine.
2. Navigate to the project's root directory.
3. Run the following command to install the dependencies:

```
npm install
```

## Configuration

The application requires some configuration settings to connect to MongoDB. You can set these settings by creating a `.env` file in the project's root directory and specifying the `DB_URI` variables, for instance:

```
DB_URI=mongodb://127.0.0.1:27017/mongo?directConnection=true
```

Application uses MongoDB change streams, which are available for replica sets and sharded clusters. It's easier to use MongoDB Atlas for that matter. But if you want to set replica set locally use the following docker-compose file:

```
version: "3.4"

services:
  mongodb:
    image: mongo
    hostname: mongodb
    restart: always
    container_name: mongodb
    ports:
      - 27017:27017
    networks:
      - mongo-network
    healthcheck:
      test: test $$(echo "rs.initiate().ok || rs.status().ok" | mongo -u mongo -p mongo --quiet) -eq 1
      interval: 10s
      start_period: 30s
    command: ["--replSet", "dbrs", "--bind_ip_all"]

networks:
  mongo-network:
    driver: bridge
```

and the mongosh command for the mongodb inside that container:

```
var config = {
  _id: "dbrs",
  version: 1,
  members: [
    {
      _id: 1,
      host: "mongodb:27017",
      priority: 2,
    },
  ],
};
rs.initiate(config, { force: true });
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
