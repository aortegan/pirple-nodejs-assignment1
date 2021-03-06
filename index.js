/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// Instantiate HTTP server
const httpServer = http.createServer((req,res) => {
  // Call function with server Logic
  server(req,res);
});

// Start HTTP server
httpServer.listen(config.httpPort,() => {
  console.log("Server listening on port " + config.httpPort + ", in " + config.envName + " mode");
});

// Create https options object to encrypt/decrypt
const httpsOptions = {
  'key' : fs.readFileSync('./https/key.pem'), // read key file generated with openssl
  'cert' : fs.readFileSync('./https/cert.pem')  // read certificate file generated with openssl
};

// Instantiate HTTPS server
const httpsServer = https.createServer(httpsOptions,(req,res) => {
  server(req,res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort,() => {
	console.log('Server listening on port ' + config.httpsPort +', in ' + config.envName + ' mode');
});

// Logic for HTTP server
const server = (req,res) => {

  // Get the url and parse it
  var parsedUrl = url.parse(req.url,true);

  // Get the path of the url
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get the headers as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new stringDecoder('utf-8'); // create decoder
  var buffer = ''; // instantiate buffer to store data
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, choose the notFound handler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
  		'trimmedPath' : trimmedPath,
  		'queryStringObject' : queryStringObject,
  		'method' : method,
  		'headers' : headers,
  		'payload' : buffer
		};

    // Route the request to the handler specified in the router
    chosenHandler(data,(statusCode,payload) => {

      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString)

      console.log('Returning this response: ',statusCode,payloadString);
      });
    });
};

// Define the handlers
const handlers = {};

// hello handler
handlers.hello = (data,callback) => {
  callback(200,{"Welcome message" : 'Hello you!'}) // callback a status code and an object with welcome message
};

// Not found handler
handlers.notFound = (data,callback) => {
  callback(404);
};

// Define request router
const router = {
	'hello' : handlers.hello,
};
