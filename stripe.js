import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

//import { logger } from 'meteor/andylash:basic-logger';
// import { ProgressMethodCollection } from 'meteor/andylash:progress-method';

Stripe = {};
Stripe.syncCall = function() {
  //logger.debug({ area: 'stripe', msg: 'Stripe has not been setup yet.' });
};


if (!Meteor.settings || !Meteor.settings.Stripe || !Meteor.settings.Stripe.secretKey) {
  //logger.error({ area: 'stripe', msg: "Secret key is not set in Meteor.settings" });
} else {
  //logger.debug({ area: 'stripe', msg: "Successfully configured" });
  Stripe = require('stripe')(Meteor.settings.Stripe.secretKey);
  Stripe.setApiVersion('2016-07-06');
  Stripe.syncCall = function( /* arguments */ ) {
    if (!Stripe) {
      //logger.debug({ area: 'stripe', msg: "Not configured, so returning undefined from stripe call" });
      return;
    }
    var argsArray = Array.prototype.slice.call(arguments);
    var apiObject = argsArray.shift();
    var methodName = argsArray.shift();

    var wrappedFunc = Meteor.wrapAsync(apiObject[methodName], apiObject);
    var returnObj;
    try {
      const name = `${apiObject.path()}.${methodName}`;
      //logger.debug({ area: 'stripe', msg: `callStripe: Calling ${name} with params ${EJSON.stringify(argsArray)}` });
      returnObj = wrappedFunc.apply(Meteor, argsArray);
      //logger.debug({ area: 'stripe', msg: "call returned successfully" });
    } catch (error) {
      var newError = new Meteor.Error(500, "Error calling stripe " + methodName + ": " +
        error.message);
      //logger.error({ area: 'stripe', msg: `Error calling: ${error.message}`, err: error });
      throw newError;
    }
    return returnObj;
  };
}

