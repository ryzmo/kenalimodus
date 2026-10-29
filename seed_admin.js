const fs = require('fs');
const { getDb } = require('./src/lib/db.js');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const env = fs.readFileSync('.env.local', 'utf8');
  env.split('\n').forEach(l => {
    const [k, ...v] = l.split('=');
    if (k && v) process.env[k.trim()] = v.join('=').trim();
  });

  const sql = getDb();
  if (!sql) {
    console.error("Database connection failed");
    return;
  }

  const hash = await bcrypt.hash('admin123', 10);
  await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES ('Admin BCA #AwasModus', 'admin@bca.co.id', ${hash}, 'admin')
    ON CONFLICT (email) 
    DO UPDATE SET role = 'admin', password_hash = ${hash};
  `;

  console.log("Admin account successfully created or updated: admin@bca.co.id / admin123");
}

seedAdmin().catch(console.error);

