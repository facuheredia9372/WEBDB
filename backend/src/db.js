import 'dotenv/config';
import pg from 'pg';

pg.types.setTypeParser(1082, (valor) => valor);

// Conexión a PostgreSQL (con soporte SSL requerido por Render)
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

// Consultas SQL
export const query = (text, params) => pool.query(text, params);

// Transacciones
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