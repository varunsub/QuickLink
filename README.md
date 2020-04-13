# QuickLink Image Uploader

This app is an imgur clone. You can upload an image and will recieve a shortlink that can easily be shared. This link has embedded meta tags for Twitter card and OpenGraphProtocol to enhance sharing.

This app uses AWS S3 buckets for file storage

To use the app go to https://quicklinkz.herokuapp.com/

To deploy locally you must have
An AWS S3 bucket
Your AWS Access ID and secret key

To deploy locally follow these instructions

1. Clone the repo with git clone <>
2. Enter the project directory cd ./heroku-image-uploader
3. Create a .env file with required environment variables nano .env
4. Enter the form:<br/>
AWS_ACCESS_KEY_ID='YOUR ID' <br/>
AWS_SECRET_ACCESS_KEY='YOUR SECRET KEY' <br/>
S3_BUCKET_NAME='YOUR BUCKET NAME' <br/>
BLITLINE_ID = 'BLITLINE APPLICATION ID'</br>

  OR 

  Rename the .env.sample file to .env with the proper credentials

5. Run the command "heroku local" and then visit localhost:5000 on your browser

Tests

To run tests on the endpoints, enter npm run test on command line in the project directory

To test opengraph tags enter node ./tests/open-graph-debugger.js and ensure the tags are appropriate. 
