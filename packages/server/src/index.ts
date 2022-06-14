import express, { Application } from "express";
import { ApolloServer, Config, gql } from "apollo-server-express";
import schema from "./graphql/schema";
import casual from "casual";
import cors from 'cors';  

let productsIds: string[] = [];
let usersIds: string[] = [];

const mocks = {
  User: () => ({
    id: () => {
      let uuid = casual.uuid;
      usersIds.push(uuid);
      return uuid;
    },
    firstName: casual.first_name,
    lastName: casual.last_name,
    bio: casual.text,
    email: casual.email,
    username: casual.username,
    password: casual.password,
    image: "https://picsum.photos/seed/picsum/200/300",
    coverImage: "https://picsum.photos/seed/picsum/200/300",
    productsCount: () => casual.integer(0),
  }),
  Product: () => ({
    id: () => {
      let uuid = casual.uuid;
      productsIds.push(uuid);
      return uuid;
    },
    text: casual.text,
    image: "https://picsum.photos/seed/picsum/200/300",
    author: casual.random_element(usersIds),
    ordersCount: () => casual.integer(0),
    createdAt: () => casual.date(),
  }),
  Order: () => ({
    id: casual.uuid,
    productId: casual.random_element(productsIds),
    orderedBy: casual.random_element(usersIds),
    createdAt: () => casual.date(),
  }),
  Query: () => ({
    getUsers: () => [...new Array(casual.integer(10, 100))],
    getProducts: () => [...new Array(casual.integer(10, 100))],
    getOrders: () => [...new Array(casual.integer(10, 100))],
    getProductsByUserId: () => [...new Array(casual.integer(10, 100))],
    getOrdersByUserId: () => [...new Array(casual.integer(10, 100))],
    searchProducts: () => [...new Array(casual.integer(10, 100))],
    searchUsers: () => [...new Array(casual.integer(10, 100))],
  }),
};

async function startApolloServer() {
  const PORT = 8080;
  const app: Application = express();
  app.use(cors());
  const server: ApolloServer = new ApolloServer({
    schema,
    mocks,
    mockEntireSchema: false,
  });
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
  });
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startApolloServer();
