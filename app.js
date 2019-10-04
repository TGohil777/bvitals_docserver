const express = require('express')
const app = express()
const chalk = require('chalk')
const morgan = require('morgan')
const fs = require('fs')
const bodyParser = require('body-parser')
const uuid = require('uuid');
const fileUpload = require('express-fileupload');
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));

app.use(fileUpload());
morgan.token('id', function getId(req) {
    return req.id;
  })

app.use(assignId);

app.use('/images',express.static('images'))
  
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    }
    
app.use(morgan(':id :method :url :response-time', {
    stream: fs.createWriteStream('./access.log',{flags: 'a'})
    }));
  
function assignId (req, res, next) {
    req.id = uuid.v4()
    next()
    }

app.use('/api/v1/documentService', require('./routes/fileUpload'))
app.listen(process.env.PORT, () => {
  console.log(chalk.green(`Express server listening on port ${process.env.PORT}`));
});