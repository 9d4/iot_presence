const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router = express.Router();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('layout', 'layouts/template');

// * middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(expressLayouts);
app.use(require('./middleware/'))

// * routes
app.use(require('./routes/web'));
app.use(require('./routes/api'));


app.listen(port, () => console.log('Listening at port', port));
