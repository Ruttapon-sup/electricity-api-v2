const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Helper: Load Data
const loadData = (file) => {
  return JSON.parse(fs.readFileSync(`./data/${file}`, 'utf8'));
};

// 1. API: Total electricity usage for each year
app.get('/api/usage/total-by-year', (req, res) => {
  const data = loadData('electricity_usages_en.json');

  const totals = data.reduce((acc, curr) => {
    const year = curr.year;

    const totalUsage = Object.keys(curr)
      .filter((key) => key.endsWith('_kwh'))
      .reduce((sum, key) => sum + (curr[key] || 0), 0);

    acc[year] = (acc[year] || 0) + totalUsage;
    return acc;
  }, {});

  res.json(totals);
});

// 2. API: Total electricity users for each year
app.get('/api/users/total-by-year', (req, res) => {
  const data = loadData('electricity_users_en.json');

  const totals = data.reduce((acc, curr) => {
    const year = curr.year;

    const totalUsers = Object.keys(curr)
      .filter((key) => key.endsWith('_count'))
      .reduce((sum, key) => sum + (curr[key] || 0), 0);

    acc[year] = (acc[year] || 0) + totalUsers;
    return acc;
  }, {});

  res.json(totals);
});

// 3. API: Usage by province and year
app.get('/api/usage/:province/:year', (req, res) => {
  const { province, year } = req.params;
  const data = loadData('electricity_usages_en.json');

  const result = data.find(
    (d) =>
      d.province_name.toLowerCase() === province.toLowerCase() &&
      d.year == year
  );

  res.json(result || { message: 'Data not found' });
});

// 4. API: Users by province and year
app.get('/api/users/:province/:year', (req, res) => {
  const { province, year } = req.params;
  const data = loadData('electricity_users_en.json');

  const result = data.find(
    (d) =>
      d.province_name.toLowerCase() === province.toLowerCase() &&
      d.year == year
  );

  res.json(result || { message: 'Data not found' });
});

// 5. API: Usage history for a specific province
app.get('/api/usage_history/:province', (req, res) => {
  const { province } = req.params;
  const data = loadData('electricity_usages_en.json');

  const result = data.filter(
    (d) => d.province_name.toLowerCase() === province.toLowerCase()
  );

  res.json(result);
});

// 6. API: User history for a specific province
app.get('/api/users_history/:province', (req, res) => {
  const { province } = req.params;
  const data = loadData('electricity_users_en.json');

  const result = data.filter(
    (d) => d.province_name.toLowerCase() === province.toLowerCase()
  );

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});