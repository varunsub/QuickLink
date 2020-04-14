const app = require('../app.js');
const supertest = require('supertest');
const request = supertest(app);

/**
 * Tests the /getfile endpoint that validates file
 * and creates the unique IDs for images
 */

describe('GET getfile', () => {
  test('Sends get request to the /getfile endpoint', async (done) => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/getfile?url=https://smgupload.s3.amazonaws.com/32c4acbc-f6b1-4423-bb3b-debc6ac1e3f4');
    const output = res.text.substring(res.text.indexOf('/a/') + 3);
    expect(output).toEqual('7gBbZcqFkr1YMPdqg6xtTj');
    console.log(output);
    done();
  });
});
