# Module: Tweet Feed

The `tweet_feed` displays your twitter home statuses. Copy and paste the module config below and then add your Twitter keys to the key dictionary in the config.

This module has one dependency:

`npm install twitter`

## Module Config Example

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'twitter',
		position: 'bottom_bar',
		config: {
			width: "", // width in pixels of box. Defaults to 500.
			keys: {
				consumer_key: '',
				consumer_secret: '',
				access_token_key: '',
				access_token_secret: '',
			}
		}
	}
]
````

## Create Twitter API Keys

To use the Twitter API you need to log into twitter and get a private key. This unique code tells twitter that you have given any program posessing these keys permission to access your account.

1) *Create Application* - Go to https://apps.twitter.com/, login, click "Create new app" (top right corner), and fill out the form. If you don't have a website, just enter "http://example.com".

2) *Generate Keys* - You should be redirected to the settings page for your new application. Click the "Keys and Access Tokens" tab. Scroll down to "Token Actions" and click "Create Token".

3) *Configure mirror* - Open your application config file, `config/config.js`, in your favorite code editor. And add the module config from the previou section to the list of modules.

4) *Copy Tokens to the Config* - Copy the consumer key, consumer secret, access token, and access token secret to the appropriate places in the module config you copied from step 3.
