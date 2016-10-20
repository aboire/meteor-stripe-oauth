/* global Package */

Package.describe({
  summary: 'Stripe OAuth Connector',
  name: 'billyvg:stripe-oauth',
  version: '0.1.4',
  git: 'https://github.com/Opstarts/stripe-oauth.git',
});

Package.onUse(function (api) {
  api.versionsFrom('1.2');

  api.use('http', ['server']);
  api.use('templating', 'client');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('ecmascript', ['client', 'server']);
  api.use('random', 'client');
  api.use('underscore', 'server');
  api.use('service-configuration', ['client', 'server']);
  api.use('andylash:basic-logger@2.0.1', ['client', 'server']);
  api.use('oauth-encryption', 'server');

  api.export('StripeOAuth');
  api.export('Stripe');

  api.addFiles(['stripe_configure.html', 'stripe_configure.js', 'stripe_login_button.css'],
    'client');

  api.addFiles('stripe_common.js', ['client', 'server']);
  api.addFiles('stripe_client.js', 'client');
  api.addFiles('stripe_server.js', 'server');
  api.addFiles('stripe.js', 'server');
});
