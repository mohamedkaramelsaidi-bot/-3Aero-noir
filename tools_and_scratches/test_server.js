import http from 'http';

http.get('http://localhost:4173/', (res) => {
  console.log('Status code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTML length:', data.length);
    console.log('Includes #root:', data.includes('id="root"'));
    console.log('Includes css:', data.includes('.css'));
    console.log('Includes js:', data.includes('.js'));
  });
}).on('error', err => console.error(err));
