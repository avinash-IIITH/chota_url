var config = {};

config.db = {};
// the URL shortening host - shortened URLs will be this + base58 ID
// i.e.: http://localhost:3000/3Ys
config.webhost = 'https://dry-dusk-18938.herokuapp.com/';

// your MongoDB host and database name
config.db.host = 'guest:guest@ds255265.mlab.com:55265';
config.db.name = 'tiny_url';

module.exports = config;


// var config = {};

// config.db = {};
// // the URL shortening host - shortened URLs will be this + base58 ID
// // i.e.: http://localhost:3000/3Ys
// config.webhost = 'http://localhost:3000/';

// // your MongoDB host and database name
// config.db.host = 'localhost';
// config.db.name = 'tiny_url';

// module.exports = config;