import pool from './db';

async function testarConexao() {
  try {
    const resultado = await pool.query('SELECT NOW() AS agora, current_database() AS banco');
    console.log('Conexão OK:', resultado.rows[0]);
  } catch (erro) {
    console.error('Falha ao conectar no banco:', erro);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testarConexao();
