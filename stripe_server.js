/* global Stripe _ */
StripeOAuth = {};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
const getTokenResponse = function (query) {
  const config = ServiceConfiguration.configurations.findOne({service: 'stripe'});
  if (!config) {
    throw new ServiceConfiguration.ConfigError("Service not configured");
  }

  let responseContent;

  try {
    // Request an access token
    responseContent = HTTP.post(
      "https://connect.stripe.com/oauth/token", {
      params: {
        client_id:     config.appId,
        client_secret: config.secret,
        code:          query.code,
        grant_type:   'authorization_code',
      },
    }).content;
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with stripe. " + err.message),
                   {response: err.response});
  }
  // Success!  Extract the stripe access token and key
  // from the response

  const parsedResponse = JSON.parse(responseContent);

  const stripeAccessToken = parsedResponse.access_token;
  const stripe_id = parsedResponse.stripe_user_id;
  const stripe_publishable_key = parsedResponse.stripe_publishable_key;


  if (!stripeAccessToken) {
    throw new Error("Failed to complete OAuth handshake with stripe " +
                    "-- can't find access token in HTTP response. " + responseContent);
  }
  return {
    accessToken: stripeAccessToken,
    stripe_user_id: stripe_id,
    stripe_publishable_key,
  };
};

Oauth.registerService('stripe', 2, null, function(query) {
  const response = getTokenResponse(query);

  const accessToken = response.accessToken;


  const serviceData = {
    accessToken: OAuth.sealSecret(accessToken),
    stripe_publishable_key: response.stripe_publishable_key,
    stripe_user_id: response.stripe_user_id,
    id: response.stripe_user_id,
  };

  const account = Stripe.syncCall(Stripe.account, 'retrieve', response.stripe_user_id);
  const fields = {
    email: account.email,
    businessName: account.business_name,
  };
  console.log(`account is : ${JSON.stringify(account)}}`);
  if (account.legal_entity) {
    fields.businessName = account.legal_entity.business_name;
    fields.firstName = account.legal_entity.first_name;
    fields.lastName = account.legal_entity.last_name;
    fields.defaultCurrency = account.legal_entity.default_currency;
  }
  _.extend(serviceData, fields);

  return {
    serviceData,
    options: {
      profile: fields,
    },
  };
});


StripeOAuth.retrieveCredential = function(credentialToken) {
  return Oauth.retrieveCredential(credentialToken);
};
