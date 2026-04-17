require('dotenv').config();
const supabase = require('./config/supabase');

async function makeAdmin() {
  const { data, error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .match({ email: 'e2etester90@fitwithram.com' })
    .select();

  if (error) {
    console.error('Failed to update:', error);
  } else {
    console.log('✅ e2etester90 is now an ADMIN!', data);
  }
}

makeAdmin();
