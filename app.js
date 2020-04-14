// import npm packages
const express = require('express');
const aws = require('aws-sdk');
const mongoose = require('mongoose');
const short = require('short-uuid');
const translator = short();
const imageOptimizer = require('./src/image-optimizer');
const kv = require('./models/keyvalue');

// Code for detecting program leaks
/*
require('leaked-handles').set({
  fullStack: true, // use full stack traces
  timeout: 30000, // run every 30 seconds instead of 5.
  debugSockets: true, // pretty print tcp thrown exceptions.
});
*/

/**
 * Checks if shortlink and aws links have been used then generates a new pair
 * @param {string} fileName randomly generated uuid for aws file name
 * @return {string} returns new file names
 */
function checkModel(fileName) {
  const x = model.findOne( {awslink: fileName}, function(err, abc) {
    if (err) {
      console.log(err);
    }
    if (!abc) {
      model.create({awslink: fileName, llink: translator.fromUUID(fileName)});
      return fileName;
    } else {
      return (checkModel(translator.uuid(fileName)));
    }
  });
  return x._conditions.awslink;
}

// connects to mongodb
const connection = mongoose.createConnection('mongodb://localhost/newdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// sets model to previously defined Schema
const model = connection.model('pair', kv);

// Initiating app, port, and environment
const app = express();
app.set('views', './views');
app.engine('html', require('ejs').renderFile);
app.set( 'port', ( process.env.PORT || 3000 ));
if (process.env.NODE_ENV !== 'test') {
  app.listen( app.get( 'port' ), function() {
    console.log( 'Node server is running on port ' + app.get( 'port' ));
  });
}
app.use(express.static(__dirname ));

// sets aws region and bucket
aws.config.region = 'us-west-1';
const S3_BUCKET = process.env.S3_BUCKET_NAME;


// opens index.html on base path
app.get('/', (req, res) => {
  res.render('index.html', {host: req.headers.host});
});

/**
  *function returns a signed url that allows uploading to S3
  *function is called after user uploads a file
  *This function also calls the image optimizer function from the scripts folder
 */
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  // creates file name by calling checkModel function
  const fileName = checkModel(translator.uuid());
  const fileType = req.query['file-type'];
  // allows link to be active for 60 seconds and sets other bucket parameters
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      return res.end();
    }
    //
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`};
    /* returns link as response to be read by other scripts and sends it
    // to the image optimizer */
    // console.log(returnData.url); Used for testing
    res.write(JSON.stringify(returnData));
    imageOptimizer(returnData.url);
    res.end();
  });
});

// returns a shortlink
app.get('/getfile', (req, res)=> {
  // replaces aws link and returns long uid
  const dbval = req.query.url.replace('https://smgupload.s3.amazonaws.com/', '');
  console.log(dbval);
  // converts long uuid to short uuid and builds url
  res.write('http://'+req.headers.host+'/a/'+translator.fromUUID(dbval));
  res.end();
});

// wildcard get that loads requested file
app.get('/a/*', (req, res)=> {
  const origin = 'http://'+req.headers.host;
  const hostPath = req.path.replace('/a/', '');
  const longuuid = translator.toUUID(hostPath);
  const z = 'https://smgupload.s3.amazonaws.com/'+longuuid;
  res.text = z;
  // renders upload page and passes awslink, short uuid link, and host
  res.render('uploading.html', {awslink: z, qll: hostPath, host: origin});
});

// If the path is not recognized render 404 page
app.get('/*', (req, res)=> {
  res.render('404.html');
});

module.exports = app;


process.on('SIGINT' || 'SIGTERM', function() {
  mongoose.connection.close(function() {
    console.log("Mongoose default connection is disconnected due to application termination");
    process.exit(0);
  });
});
