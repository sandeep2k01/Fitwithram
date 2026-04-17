async function testAuthFlow() {
  console.log('🔄 Starting Auth Flow API Test (Native Fetch)...\n');
  const API_URL = 'http://localhost:5000/api';
  const testEmail = `testuser_${Date.now()}@test.com`;
  const testPassword = 'securepassword123';

  try {
    // 1. Test Registration
    console.log('1️⃣ Testing Registration API (/auth/register)...');
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Native Fetch User',
        email: testEmail,
        password: testPassword,
        goal: 'strength'
      })
    });
    const registerResponse = await regRes.json();
    if (!regRes.ok) throw new Error(registerResponse.message);
    
    console.log('✅ Registration SUCCESS!');
    console.log(`Returned token: ${registerResponse.token.substring(0, 20)}...`);
    console.log(`Created User ID: ${registerResponse.user.id}\n`);

    // 2. Test Login
    console.log('2️⃣ Testing Login API (/auth/login)...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginResponse = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginResponse.message);

    console.log('✅ Login SUCCESS!');
    console.log(`Matched User: ${loginResponse.user.name} (${loginResponse.user.email})\n`);
    
    // 3. Test Profile Fetch (Protected Route)
    console.log('3️⃣ Testing Protected Route (/auth/profile)...');
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${loginResponse.token}`
      }
    });
    const profileResponse = await profileRes.json();
    if (!profileRes.ok) throw new Error(profileResponse.message);

    console.log('✅ Protected Route SUCCESS!');
    console.log(`Fetched Profile Goal: ${profileResponse.user.goal}`);
    console.log(`Fetched Profile Join Date: ${profileResponse.user.created_at}\n`);

    console.log('🎉 ALL BACKEND AUTH CALLS WORKING PERFECTLY!');

  } catch (error) {
    console.error('❌ API Test Failed!');
    console.error(error.message);
  }
}

testAuthFlow();
