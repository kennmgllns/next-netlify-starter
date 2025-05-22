const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  const filePath = path.join(__dirname, 'latest.json');
  
  // Save to temporary JSON file (simple simulation)
  fs.writeFileSync(filePath, JSON.stringify(data));

  return {
    statusCode: 200,
    body: 'Data received successfully'
  };
};
