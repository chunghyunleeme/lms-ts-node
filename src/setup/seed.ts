import { Pool, RowDataPacket } from "mysql2/promise";

export async function seed(conn: Pool): Promise<void> {
  const [result]: RowDataPacket[0] = await conn.query(
    "SELECT COUNT(*) as count FROM instructor"
  );

  if (result[0].count === 0) {
    // 테이블에 데이터가 없는 경우에만 INSERT 수행
    await conn.query("INSERT INTO instructor (name) VALUES (?)", [
      "테스트 교사",
    ]);
  }
}
