const fs = require('fs');
const request = require('supertest');
const app = require('../index');

const loadData = (file) =>
  JSON.parse(fs.readFileSync(`./data/${file}`, 'utf8'));

describe('Electricity API Comprehensive Test Suite', () => {
  // API 1: Total electricity usages for each year  
  it('valid - total usage per year', async () => {
    const res = await request(app).get('/api/usage/total-by-year');
    const data = loadData('electricity_usages_en.json');

    const expected = data.reduce((acc, curr) => {
      const year = curr.year;

      const totalUsage = Object.keys(curr)
        .filter((key) => key.endsWith('_kwh'))
        .reduce((sum, key) => sum + (curr[key] || 0), 0);

      acc[year] = (acc[year] || 0) + totalUsage;
      return acc;
    }, {});

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expected);
  });
  it('invalid - total usage per year', async () => {
    const res = await request(app).post('/api/usage/total-by-year');
    expect(res.status).toBe(404);
  });

  // API 2: Total electricity users for each year
  it('valid - total users per year', async () => {
    const res = await request(app).get('/api/users/total-by-year');
    const data = loadData('electricity_users_en.json');

    const expected = data.reduce((acc, curr) => {
        const year = curr.year;
    
        const totalUsers = Object.keys(curr)
          .filter((key) => key.endsWith('_count'))
          .reduce((sum, key) => sum + (curr[key] || 0), 0);
    
        acc[year] = (acc[year] || 0) + totalUsers;
        return acc;
    }, {});

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expected);
  });
  it('invalid - total users per year', async () => {
    const res = await request(app).post('/api/users/total-by-year');
    expect(res.status).toBe(404);
  });

  // API 3: Usage of specific province by specific year
  it('valid - Usage of specific province (Krabi) by year 2566', async () => {
    const province = 'krabi';
    const year = 2566;
    const res = await request(app).get(`/api/usage/${province}/${year}`);
    const data = loadData('electricity_usages_en.json');
    const expected = data.find(
      (d) =>
        d.province_name.toLowerCase() === province.toLowerCase() &&
        d.year == year
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expected);
    });
  it('invalid - Usage of specific province (London) by (2566)', async () => {
    const res = await request(app).post('/api/usage/London/2566');
    expect(res.status).toBe(404);
  });

  // API 4: Users of specific province by specific year
  it('valid - Users of specific province (Krabi) by year 2566', async () => {
    const province = 'krabi';
    const year = 2566;

    const res = await request(app).get(`/api/users/${province}/${year}`);

    const data = loadData('electricity_users_en.json');
    const expected = data.find(
      (d) =>
        d.province_name.toLowerCase() === province.toLowerCase() &&
        d.year == year
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expected);
    });
    it('invalid - Users of specific province (London) by (2566)', async () => {
        const res = await request(app).post('/api/usage/London/2566');
        expect(res.status).toBe(404);
    });

  // API 5: Usage history by specific province
  it('valid - Usage history by specific province (Krabi)', async () => {
    const province = 'krabi';
    const res = await request(app).get(`/api/usage_history/${province}`);
    const data = loadData('electricity_usages_en.json');

    const expected = data.filter(
      (d) => d.province_name.toLowerCase() === province.toLowerCase()
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expected);
  });
  it('invalid - Users of specific province (London) by (2566)', async () => {
    const res = await request(app).post('/api/usage_history/London');
    expect(res.status).toBe(404);
  });

    // API 6: User history by specific province
    it('valid - Users history by specific province (Krabi)', async () => {
        const province = 'krabi';
        const res = await request(app).get(`/api/users_history/${province}`);
        const data = loadData('electricity_users_en.json');
    
        const expected = data.filter(
          (d) => d.province_name.toLowerCase() === province.toLowerCase()
        );
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expected);
      });
      it('invalid - Users of specific province (London) by (2566)', async () => {
        const res = await request(app).post('/api/users_history/London');
        expect(res.status).toBe(404);
      });
});