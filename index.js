const express = require('express');
const app = express();

const routes = require('./routes/routes');

app.use('public', express.static(__dirname + 'public'));
app.set('template-engine', 'ejs');

routes(app);

app.set('port', 3000 || process.env.PORT);

app.listen(app.get('port'), () => console.log('Listening on port', app.get('port')));
