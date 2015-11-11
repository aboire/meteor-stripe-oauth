Package.describe({
    summary: 'Stripe OAuth Connector',
    name: 'billyvg:stripe-oauth',
    version: '0.1.0',
    git: 'https://github.com/Opstarts/stripe-oauth.git',
});

Package.onUse(function (api) {
    api.versionsFrom('1.2');

    api.use('http', ['server']);
    api.use('templating', 'client');
    api.use('oauth2', ['client', 'server']);
		api.use('oauth', ['client', 'server']);
    api.use('random', 'client');
    api.use('underscore', 'server');
    api.use('service-configuration', ['client', 'server']);

    api.export('StripeOAuth');

  	api.addFiles([
      'stripe_configure.html',
      'stripe_configure.js',
      'stripe_login_button.css'
    ], 'client');

    api.addFiles('stripe_common.js', ['client', 'server']);
    api.addFiles('stripe_client.js', 'client');
    api.addFiles('stripe_server.js', 'server');
});
