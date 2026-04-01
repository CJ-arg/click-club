import { Pool } from 'pg';

// Busca cualquiera de las variables que hayas pegado en el .env
// Busca cualquiera de las variables que hayas pegado en el .env o las que Vercel puso con prefijo
const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL || 
  process.env.click_club_POSTGRES_URL || 
  process.env.click_club_DATABASE_URL ||
  process.env.CLICK_CLUB_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        visitor_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error("Error init DB:", error);
  }
}

export async function createOrUpdateProfile({ visitorId, name, url }) {
  await initDb();
  try {
    const result = await pool.query(`
      INSERT INTO profiles (visitor_id, name, url, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (visitor_id)
      DO UPDATE SET name = EXCLUDED.name, url = EXCLUDED.url, created_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [visitorId, name, url]);
    
    return result.rows[0];
  } catch (error) {
    console.error("Error saving profile", error);
    throw error;
  }
}

export async function getAllProfiles() {
  await initDb();
  try {
    const result = await pool.query('SELECT * FROM profiles ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error("Error getting profiles:", error);
    return [];
  }
}

export async function deleteProfile(visitorId) {
  try {
     await pool.query('DELETE FROM profiles WHERE visitor_id = $1', [visitorId]);
  } catch(error) {
     console.error("Error deleting profile", error);
     throw error;
  }
}
