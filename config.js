const convict = require('convict');
const fs = require('fs');

// Define a schema
const config = convict({

	env: {
		doc: 'The application environment.',
		format: ['production', 'development', 'test'],
		default: 'development',
		env: 'NODE_ENV'
	},
	port: {
		doc: 'The port to bind.',
		format: 'port',
		default: 4000,
		env: 'PORT'
	},

	hosting: {
		domain: {
			doc: 'The domain at which the app is hosted.',
			format: '*',
			default: 'localhost',
			env: 'DOMAIN'
		},
		url: {
			doc: 'The full url at which the app is hosted.',
			format: 'url',
			default: 'https://localhost:4000',
			env: 'URL'
		},
		localhost: {
			doc: 'whether ot listen on localhost or not (for reverse-proxy)',
			format: 'Boolean',
			default: true,
			env: 'LISTEN_LOCALHOST'
		}
	},

	session: {
		name: {
			doc: 'The name for the session',
			default: 'Menu Tools Session'
		},
		secret: {
			doc: 'The secret for the session',
			default: 'supersecretsecret',
			sensitive: true
		},
		maxAge: {
			doc: 'The maximum age of the session, in days',
			format: 'int',
			default: 7
		}
	},

	jwt: {
		secret: {
			doc: 'The secret for JWTs',
			default: 'anothersupersecretstring',
			sensitive: true
		}
	},

	db: {
		url: {
			doc: 'Database url, including username and password',
			format: '*',
			default: 'mongodb://127.0.0.1/menu-tools',
			env: 'DB_URL',
			sensitive: true
		}
	},

	pushover: {
		doc: 'The pushover app key',
		format: '*',
		default: '',
		env: 'PUSHOVER'
	},

	testing: {
		token: {
			doc: 'Token to use for testing',
			format: '*',
			default: ''
		},
		purdue: {
			username: {
				doc: 'Purdue username to use for testing favorites import',
				format: '*',
				default: ''
			},
			password: {
				doc: 'Purdue password to use for testing favorites import',
				format: '*',
				default: ''
			}
		}
	},

	webhooks: {
		password: {
			doc: 'Password being sent in auth header',
			default: ''
		}
	}
});

// Load environment dependent configuration
const env = config.get('env');
if (fs.existsSync(`./config/${env}-config.json`))
	config.loadFile(`./config/${env}-config.json`);

// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;