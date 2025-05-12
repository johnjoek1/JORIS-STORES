const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  language: { type: String, default: 'en', enum: ['en', 'fr', 'es'] },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
});

const orderProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [orderProductSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'paid', 'shipped', 'delivered'],
  },
  createdAt: { type: Date, default: Date.now },
});

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'shipped', 'delivered'],
  },
  trackingNumber: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
  Delivery: mongoose.model('Delivery', deliverySchema),
};