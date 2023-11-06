const http = require('http');
const fs = require('fs');
const xml = require('fast-xml-parser');

const server = http.createServer((req, res) => {
  try {
    const xmlPath = 'data.xml';

    const xmlData = fs.readFileSync('data.xml', 'utf8');

    const options = {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    };

    const parser = new xml.XMLParser(options);
    const obj = parser.parse(xmlData, options);

    if (obj && obj.exchange && obj.exchange.currency) {
      if (Array.isArray(obj.exchange.currency)) {
        data = obj.exchange.currency;
      } else if (typeof obj.exchange.currency === 'object') {
        data = [obj.exchange.currency];
      }
    }

    if (data.length > 0) {
      const sortedData = data.map((item) => ({
        rate: item.rate,
        date: item.exchangedate,
      }));

      const newObj = {
        data: {
          exchange: sortedData,
        },
      };

      const builder = new xml.XMLBuilder();
      const xmlStr = builder.build(newObj);

      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end(xmlStr);
    } else {
      throw new Error('Неправильна структура XML файлу.');
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Помилка: ' + error.message);
  }
});

server.listen(8080, () => {
  console.log('Сервер запущено на localhost:8080');
});
