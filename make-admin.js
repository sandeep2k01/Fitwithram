require('dotenv').config({ path: './server/.env' });
const supabase = require('./server/config/supabase');

async function makeAdmin() {
  const { data, error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .match({ email: 'testbrowser1@fitwithram.com' })
    .select();

  if (error) {
    console.error('Failed to update:', error);
  } else {
    console.log('✅ testbrowser1@fitwithram.com is now an ADMIN!', data);
  }
}

makeAdmin();
