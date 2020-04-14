const axios = require('axios');

/**
 * Function calls Blitline API to optimize image
 * The image in the bucket is then replaced with the optimized version
 * @param {awslink} awslink getSignedRequest function
 * @param {callback} callback getSignedRequest function
 * @param {callback} signedURL getSignedRequest function
 */
module.exports = function run(awslink) {
  const key = awslink.replace('https://smgupload.s3.amazonaws.com/', '');
  axios.post('https://api.blitline.com/job', {
    'application_id': process.env.BLITLINE_ID,
    'v': 1.21,
    'src': awslink,
    'functions': [
      {
        'name': 'resize_to_fit',
        'params': {
          'width': '500',
          'autosharpen': true,
        },
        'save': {
          'image_identifier': 'MY_CLIENT_ID',
          'image_optim': true,
          's3_destination': {
            'bucket': process.env.S3_BUCKET_NAME,
            'key': key,
          },
        },
      },
    ],
  })
      .catch(function(error) {
        console.log(+error);
      });
};
