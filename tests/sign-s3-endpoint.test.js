const app = require('../app.js');
const supertest = require('supertest');
const request = supertest(app);

/**
 * Tests S3 endpoint is working
 */

describe('GET sign-s3', () => {
  test('Gets the test endpoint sign-s3', async (done) => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/sign-s3?file-name=test&file-type=.jpg');
    expect(res.status).toEqual(200);
    done();
  }, 10000);
});
