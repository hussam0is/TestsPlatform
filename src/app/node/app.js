
// const EventEmitter = require('events');
// const emitter = new EventEmitter();

// // Register a listener
// emitter.on('messege', (arg) => {
//   console.log('listener called', arg);
// });

// // Raise an event
// emitter.emit('messege',{id: 1, url:'http://'});

const http = require('http');

const server = http.createServer((req,res) => {
  if(req.url === '/'){
    res.write('Hellow world');
    res.end();
  }
  if (req.url === '/api/environment') {
    res.write(JSON.stringify([1, 2, 3]));
    res.end();
  }
});

server.listen(3000);

console.log('Listening on port 5000...');
