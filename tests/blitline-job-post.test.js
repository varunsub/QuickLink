

const blitlineID = process.env.BLITLINE_ID;

describe('Post image to blitline', () => {
  test('Posts image information to Blitline', async (done) => {
    // Sends GET Request to /test endpoint
    const res = await request.post('https://api.blitline.com/job')
        .send({
          'application_id': blitlineID,
          'src': 'https://smgupload.s3-us-west-1.amazonaws.com/1d57284a-33e9-488f-9c39-9c20b27bfdd1',
          'v': 1.21,
          'functions': [
            {
              'name': 'resize_to_fit',
              'save': {
                'image_identifier': 'MY_CLIENT_ID',
              },
            },
          ],
        }).then( (response) => {
          assert(response.body.email, 'foo@bar.com');
        });
    console.log(res);
    done();
  }, 10000);
});
