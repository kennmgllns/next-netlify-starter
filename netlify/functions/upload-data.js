const axios = require('axios');

const BIN_ID = process.env.JSONBIN_BIN_ID || '6830547e8561e97a501a7a54';
const API_KEY = process.env.JSONBIN_API_KEY || '$2a$10$IXRMbunUtndT4UBf7rbRveIFEc3UJuey0nbl/8ADpZUKoGJeKEibC';

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Master-Key': API_KEY,
  };

  if (event.httpMethod === 'POST') {
    const data = JSON.parse(event.body);

    try {
      await axios.put(
        `https://api.jsonbin.io/v3/b/${BIN_ID}`,
        data,
        { headers }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data updated' }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const response = await axios.get(
        `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
        { headers }
      );

      return {
        statusCode: 200,
        body: JSON.stringify(response.data.record),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  return {
    statusCode: 405,
    body: 'Method Not Allowed',
  };
};
