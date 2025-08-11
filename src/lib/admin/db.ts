// DISABLED: Database connection removed - No longer needed
/*
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // acquireTimeout, timeout, reconnect 제거 (경고 없애기)
};

// 연결 풀 생성
const pool = mysql.createPool(dbConfig);

export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export default pool;
*/

// Placeholder exports to prevent import errors
export async function query(sql: string, params?: any[]): Promise<any> {
  console.log("🚫 Database connection disabled - query() called but not executed");
  return [];
}

export default null;
