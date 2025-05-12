

const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Upload

  type User {
    id: ID!
    name: String!
    email: String!
    language: String
    role: String
  }

  type Token {
    token: String!
    user: User!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    imageUrl: String!
    category: String!
    stock: Int!
  }

  type OrderProduct {
    product: Product!
    quantity: Int!
  }

  type Order {
    id: ID!
    user: User!
    products: [OrderProduct!]!
    total: Float!
    status: String!
    createdAt: String!
  }

  type Delivery {
    id: ID!
    order: Order!
    status: String!
    trackingNumber: String
    updatedAt: String!
  }

  input OrderProductInput {
    productId: ID!
    quantity: Int!
  }

  type Query {
    me: User
    products: [Product!]!
    product(id: ID!): Product
    orders: [Order!]!
    order(id: ID!): Order
    delivery(orderId: ID!): Delivery
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, language: String, isAdmin: Boolean, adminSecret: String): Token!
    login(email: String!, password: String!): Token!
    createProduct(
      name: String!
      description: String!
      price: Float!
      image: Upload!
      category: String!
      stock: Int!
    ): Product!
    createOrder(products: [OrderProductInput!]!): Order!
    createPaymentIntent(orderId: ID!): PaymentIntent!
    updateDeliveryStatus(orderId: ID!, status: String!, trackingNumber: String): Delivery!
  }

  type PaymentIntent {
    clientSecret: String!
  }

  type Subscription {
    deliveryUpdated(orderId: ID!): Delivery!
  }
`;




































































/**

const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    language: String
    role: String
  }

  type Token {
    token: String!
    user: User!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    imageUrl: String!
    category: String!
    stock: Int!
  }

  type OrderProduct {
    product: Product!
    quantity: Int!
  }

  type Order {
    id: ID!
    user: User!
    products: [OrderProduct!]!
    total: Float!
    status: String!
    createdAt: String!
  }

  type Delivery {
    id: ID!
    order: Order!
    status: String!
    trackingNumber: String
    updatedAt: String!
  }

  input OrderProductInput {
    productId: ID!
    quantity: Int!
  }

  type Query {
    me: User
    products: [Product!]!
    product(id: ID!): Product
    orders: [Order!]!
    order(id: ID!): Order
    delivery(orderId: ID!): Delivery
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, language: String, isAdmin: Boolean, adminSecret: String): Token!
    login(email: String!, password: String!): Token!
    createProduct(
      name: String!
      description: String!
      price: Float!
      image: Upload!
      category: String!
      stock: Int!
    ): Product!
    createOrder(products: [OrderProductInput!]!): Order!
    createPaymentIntent(orderId: ID!): PaymentIntent!
    updateDeliveryStatus(orderId: ID!, status: String!, trackingNumber: String): Delivery!
  }

  type PaymentIntent {
    clientSecret: String!
  }

  type Subscription {
    deliveryUpdated(orderId: ID!): Delivery!
  }
`;
**/















































