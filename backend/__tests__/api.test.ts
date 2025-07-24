// import 'reflect-metadata';
// import request from 'supertest';
// import app from '../src/index';

// // Basic API tests
// describe('API Tests', () => {
//   // Test health check endpoint
//   it('should return 200 for health check', async () => {
//     const res = await request(app).get('/health');
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty('status', 'ok');
//   });

//   // Test not found route
//   it('should return 404 for unknown route', async () => {
//     const res = await request(app).get('/unknown-route');
//     expect(res.statusCode).toEqual(404);
//   });
// });
