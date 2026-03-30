const fs = require('fs');
const path = require('path');

const ordersFile = path.join('/tmp', 'orders.json');

exports.handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    try {
      if (fs.existsSync(ordersFile)) {
        const data = fs.readFileSync(ordersFile, 'utf8');
        const orders = JSON.parse(data);
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          },
          body: JSON.stringify(orders),
        };
      } else {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          },
          body: JSON.stringify([]),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao ler pedidos' }),
      };
    }
  } else if (event.httpMethod === 'POST') {
    try {
      const order = JSON.parse(event.body);
      let orders = [];
      if (fs.existsSync(ordersFile)) {
        const data = fs.readFileSync(ordersFile, 'utf8');
        orders = JSON.parse(data);
      }
      orders.push(order);
      fs.writeFileSync(ordersFile, JSON.stringify(orders));
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
        body: JSON.stringify({ success: true }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao salvar pedido' }),
      };
    }
  } else if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }
};