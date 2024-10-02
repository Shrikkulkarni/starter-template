
let stripe;

if (typeof window === 'undefined') {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

export default stripe;
