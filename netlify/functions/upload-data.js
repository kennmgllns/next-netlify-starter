const fs = require('fs')
const path = require('path')

const dataFile = path.resolve(__dirname, 'data.json')

// Ensure the data file exists
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({
    lat: 14.5995,
    lng: 120.9842,
    sensor: 32.5
  }, null, 2))
}

exports.handler = async function (event, context) {
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body)

      const updatedData = {
        lat: body.lat,
        lng: body.lng,
        sensor: body.sensor
      }

      fs.writeFileSync(dataFile, JSON.stringify(updatedData, null, 2))

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Data updated" }),
      }
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid JSON", error: err.message }),
      }
    }
  }

  if (event.httpMethod === 'GET') {
    const content = fs.readFileSync(dataFile, 'utf8')
    return {
      statusCode: 200,
      body: content,
    }
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed",
  }
}
