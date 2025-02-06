import {
    encodeParam,
    decodeParam,
    buildQueryString,
    parseQueryString
  } from './fetch.js';
  
  // 1) Encoding a single value
  const specialString = 'Hello Eastern Europe and Africa! Привет! 😀';
  const encodedString = encodeParam(specialString);
  console.log('Encoded string:', encodedString);
  
  // 2) Decoding a single value
  const decodedString = decodeParam(encodedString);
  console.log('Decoded string:', decodedString);
  
  // 3) Building a query string
  const queryObj = {
    name: 'Marija',
    preferences: {
      language: 'Italian',
      topics: ['networks', 'computing', 'books']
    },
    page: 1
  };
  const queryString = buildQueryString(queryObj);
  console.log('Query string:', queryString);
  
  // 4) Parsing a query string
  const parsedObject = parseQueryString(queryString);
  console.log('Parsed object:', parsedObject);
  
  // 5) Using these in a typical scenario: attach or read from a URL
  const fullUrl = `https://example.org/search?${queryString}`;
  console.log('Example full URL:', fullUrl);
  
  // Simulate reading from a URL's query part:
  const parsedFromUrl = parseQueryString(fullUrl.split('?')[1]);
  console.log('Parsed from URL:', parsedFromUrl);
  