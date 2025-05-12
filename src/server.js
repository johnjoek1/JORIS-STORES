

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const http = require('http');
const { Server } = require('socket.io');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./config/db');
const userAuth = require('./middleware/userAuth');
const i18nMiddleware = require('./middleware/i18n');
const setupSocket = require('./sockets');

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  // Middleware
  app.use(i18nMiddleware);
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Support file uploads

  // Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      let user = null;
      // Log operationName for debugging
      const operationName = req.body.operationName;
      console.log('Operation Name:', operationName);
      // Skip userAuth for register and login mutations
      if (operationName !== 'RegisterUser' && operationName !== 'LoginUser') {
        try {
          user = await userAuth(req); // Call userAuth as a promise
        } catch (error) {
          console.log('Context Auth Error:', error.message);
          // Apollo will handle the error in resolvers
        }
      }
      return { user, i18n: req.i18n };
    },
    uploads: false, // Disable built-in upload handling
  });
  await server.start();
  server.applyMiddleware({ app });

  // Socket.io
  setupSocket(io);

  // Connect to MongoDB
  await connectDB();

  // Start server
  httpServer.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();











































/**

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const http = require('http');
const { Server } = require('socket.io');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./config/db');
const userAuth = require('./middleware/userAuth');
const i18nMiddleware = require('./middleware/i18n');
const setupSocket = require('./sockets');

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  // Middleware
  app.use(i18nMiddleware);
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Support file uploads

  // Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      let user = null;
      // Skip userAuth for register and login mutations
      const operationName = req.body.operationName;
      if (operationName !== 'register' && operationName !== 'login') {
        await new Promise((resolve, reject) => {
          userAuth(req, {}, (err) => {
            if (err) reject(err);
            resolve();
          });
        });
        user = req.user;
      }
      return { user, i18n: req.i18n };
    },
    uploads: false, // Disable built-in upload handling
  });
  await server.start();
  server.applyMiddleware({ app });

  // Socket.io
  setupSocket(io);

  // Connect to MongoDB
  await connectDB();

  // Start server
  httpServer.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();

**/

























































/**

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const http = require('http');
const { Server } = require('socket.io');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./config/db');
const userAuth = require('./middleware/userAuth');
const i18nMiddleware = require('./middleware/i18n');
const setupSocket = require('./sockets');

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  // Middleware
  app.use(userAuth); // Apply user authentication globally
  app.use(i18nMiddleware);
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Support file uploads

  // Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: req.user, i18n: req.i18n }),
    uploads: false, // Disable built-in upload handling
  });
  await server.start();
  server.applyMiddleware({ app });

  // Socket.io
  setupSocket(io);

  // Connect to MongoDB
  await connectDB();

  // Start server
  httpServer.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();

**/

























































