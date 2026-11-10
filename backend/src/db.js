import 'dotenv/config';
import pg from 'pg';

pg.types.setTypeParser(1082, (valor) => valor);

const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10
    })
  : new pg.Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10
    });

pool.query(`
  SELECT
    current_database() as database,
    current_schema() as schema,
    current_user as usuario
`)
.then(res => {
  console.log('POSTGRES INFO:', res.rows);
})
.catch(err => {
  console.error('ERROR CONEXION:', err);
});

export const query = (text, params) => pool.query(text, params);

export async function transaction(trabajo) {
  const cliente = await pool.connect();

  try {
    await cliente.query('BEGIN');
    const resultado = await trabajo(cliente);
    await cliente.query('COMMIT');
    return resultado;
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
}