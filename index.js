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
// import http from 'http';
// import https from 'https';
// import url from 'url';
// import stringDecoder from 'string_decoder'.StringDecoder;
// import config from './config';
// import fs from 'fs';


// Instantiate HTTP server
const httpServer = ;

// Start HTTP server
httpServer

// Logic for HTTP server

  // Get the url and parse it

  // Get the path of the url

  // Get the query string as an object

  // Get the HTTP method

  // Get the headers as an object

  // Get the payload, if any

    // Choose the handler this request should go to. If one is not found, choose the notFound hendler

    // Construct the data object to send to the handler

    // Route the request to the handler specified in the router

      // Use the status code called back by the handler, or default to 200

      // Use the payload called back by the handler, or default to empty object

      // Convert the payload to a string

      // Return the response

// Define the handlers

// hello handler

// Not found handler

// Define request router
