

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Product, Order, Delivery } = require('../models/models');
const { cloudinary } = require('../config/cloudinary');
const stripe = require('../config/stripe');
const { PubSub } = require('graphql-subscriptions');
const { GraphQLUpload } = require('graphql-upload');

const pubsub = new PubSub();
const DELIVERY_UPDATED = 'DELIVERY_UPDATED';

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    products: async () => await Product.find(),
    product: async (_, { id }) => await Product.findById(id),
    orders: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await Order.find({ user: user.id }).populate('user products.product');
    },
    order: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await Order.findOne({ _id: id, user: user.id }).populate('user products.product');
    },
    delivery: async (_, { orderId }) => await Delivery.findOne({ order: orderId }).populate('order'),
  },
  Mutation: {
    register: async (_, { name, email, password, language, isAdmin, adminSecret }) => {
      if (isAdmin && adminSecret !== process.env.ADMIN_SECRET) {
        throw new Error('Invalid admin secret');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        language,
        role: isAdmin ? 'admin' : 'user',
      });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },
    createProduct: async (_, { name, description, price, image, category, stock }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      const { createReadStream } = await image;
      const result = await new Promise((resolve, reject) => {
        createReadStream().pipe(
          cloudinary.uploader.upload_stream({ folder: 'clothing_store' }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          })
        );
      });
      return await Product.create({
        name,
        description,
        price,
        imageUrl: result.secure_url,
        category,
        stock,
      });
    },
    createOrder: async (_, { products }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      let total = 0;
      for (const { productId, quantity } of products) {
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) throw new Error('Invalid product or stock');
        total += product.price * quantity;
      }
      const order = await Order.create({
        user: user.id,
        products: products.map(({ productId, quantity }) => ({ product: productId, quantity })),
        total,
      });
      return await Order.findById(order.id).populate('user products.product');
    },
    createPaymentIntent: async (_, { orderId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const order = await Order.findOne({ _id: orderId, user: user.id });
      if (!order || order.status !== 'pending') throw new Error('Invalid order');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.total * 100, // Convert to cents
        currency: 'usd',
        metadata: { orderId: order.id },
      });
      await Order.findByIdAndUpdate(orderId, { status: 'paid' });
      return { clientSecret: paymentIntent.client_secret };
    },
    updateDeliveryStatus: async (_, { orderId, status, trackingNumber }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      let delivery = await Delivery.findOne({ order: orderId });
      if (!delivery) {
        delivery = await Delivery.create({ order: orderId, status, trackingNumber });
      } else {
        delivery = await Delivery.findOneAndUpdate(
          { order: orderId },
          { status, trackingNumber, updatedAt: new Date() },
          { new: true }
        );
      }
      pubsub.publish(DELIVERY_UPDATED, { deliveryUpdated: delivery });
      return delivery.populate('order');
    },
  },
  Subscription: {
    deliveryUpdated: {
      subscribe: (_, { orderId }) => pubsub.asyncIterator([DELIVERY_UPDATED]),
    },
  },
};

module.exports = resolvers;


























































/**

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Product, Order, Delivery } = require('../models/models');
const { cloudinary } = require('../config/cloudinary');
const stripe = require('../config/stripe');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();
const DELIVERY_UPDATED = 'DELIVERY_UPDATED';

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    products: async () => await Product.find(),
    product: async (_, { id }) => await Product.findById(id),
    orders: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await Order.find({ user: user.id }).populate('user products.product');
    },
    order: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await Order.findOne({ _id: id, user: user.id }).populate('user products.product');
    },
    delivery: async (_, { orderId }) => await Delivery.findOne({ order: orderId }).populate('order'),
  },
  Mutation: {
    register: async (_, { name, email, password, language, isAdmin, adminSecret }) => {
      if (isAdmin && adminSecret !== process.env.ADMIN_SECRET) {
        throw new Error('Invalid admin secret');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        language,
        role: isAdmin ? 'admin' : 'user',
      });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },
    createProduct: async (_, { name, description, price, image, category, stock }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      const { createReadStream } = await image;
      const result = await new Promise((resolve, reject) => {
        createReadStream().pipe(
          cloudinary.uploader.upload_stream({ folder: 'clothing_store' }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          })
        );
      });
      return await Product.create({
        name,
        description,
        price,
        imageUrl: result.secure_url,
        category,
        stock,
      });
    },
    createOrder: async (_, { products }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      let total = 0;
      for (const { productId, quantity } of products) {
        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) throw new Error('Invalid product or stock');
        total += product.price * quantity;
      }
      const order = await Order.create({
        user: user.id,
        products: products.map(({ productId, quantity }) => ({ product: productId, quantity })),
        total,
      });
      return await Order.findById(order.id).populate('user products.product');
    },
    createPaymentIntent: async (_, { orderId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const order = await Order.findOne({ _id: orderId, user: user.id });
      if (!order || order.status !== 'pending') throw new Error('Invalid order');
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.total * 100, // Convert to cents
        currency: 'usd',
        metadata: { orderId: order.id },
      });
      await Order.findByIdAndUpdate(orderId, { status: 'paid' });
      return { clientSecret: paymentIntent.client_secret };
    },
    updateDeliveryStatus: async (_, { orderId, status, trackingNumber }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      let delivery = await Delivery.findOne({ order: orderId });
      if (!delivery) {
        delivery = await Delivery.create({ order: orderId, status, trackingNumber });
      } else {
        delivery = await Delivery.findOneAndUpdate(
          { order: orderId },
          { status, trackingNumber, updatedAt: new Date() },
          { new: true }
        );
      }
      pubsub.publish(DELIVERY_UPDATED, { deliveryUpdated: delivery });
      return delivery.populate('order');
    },
  },
  Subscription: {
    deliveryUpdated: {
      subscribe: (_, { orderId }) => pubsub.asyncIterator([DELIVERY_UPDATED]),
    },
  },
};

module.exports = resolvers;

**/































































