const request = require('supertest');
const app = require('../index');
describe('Electricity API Endpoints', () => {
// Test Case 1: Total Usage
    it('should return total electricity usage for all years', async () => {
        const res = await request(app).get('/api/usage/total-by-year');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
    });
// Test Case 2: Specific Province Usage
    it('should return electricity usage for a specific province and year', async () => {
    const res = await request(app).get('/api/usage/America/2566');
    expect(res.body.message).toBe('Data not found');
    });
// Test Case 3: Verify Data Structure for Users
    it('should return total electricity users for all years', async () => {
    const res = await request(app).get('/api/users_history/Bangkok');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    });
});