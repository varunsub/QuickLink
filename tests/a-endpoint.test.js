const app = require('../app.js');
const supertest = require('supertest');
const request = supertest(app);

/**
 * Tests the /a/ endpoint that requests an image
 */

describe('GET getfile', () => {
  test('Gets the test endpoint', async (done) => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/a/7JirHbWV5tumYbDP2zacUU');
    expect(res.status).toEqual(200);
    done();
  }, 10000);
});
