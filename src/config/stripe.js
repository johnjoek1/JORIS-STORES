
/**  
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
**/


const Stripe = require('stripe');
  console.log('STRIPE_SECRET_KEY in stripe.js:', process.env.STRIPE_SECRET_KEY ? 'Loaded' : 'Undefined');
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  module.exports = stripe;


