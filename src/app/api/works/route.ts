import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/admin/db";
import { verifyToken } from "@/lib/admin/auth";

// 작품 목록 조회
export async function GET(request: NextRequest) {
  try {
    const works = await query("SELECT * FROM works ORDER BY created_at DESC");
    return NextResponse.json(works);
  } catch (error) {
    console.error("Get works error:", error);
    return NextResponse.json(
      { error: "작품 목록을 불러오는데 실패했습니다" },
      { status: 500 },
    );
  }
}

// 작품 생성 (디버그 버전)
export async function POST(request: NextRequest) {
  try {

    // 인증 확인
    const token = request.cookies.get("admin-token")?.value;

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const body = await request.json();

    const { title, description, imageUrl, videoUrl, userInfo } = body;

    if (!title) {
      return NextResponse.json(
        { error: "작품 제목은 필수입니다" },
        { status: 400 },
      );
    }


    const result = await query(
      "INSERT INTO works (title, description, image_url, video_url, user_info) VALUES (?, ?, ?, ?, ?)",
      [
        title,
        description || null,
        imageUrl || null,
        videoUrl || null,
        userInfo || null,
      ],
    );

    console.log("SQL execution result:", result);
    console.log("Insert ID:", (result as any).insertId);

    return NextResponse.json({
      message: "작품이 성공적으로 등록되었습니다",
      id: (result as any).insertId,
    });
  } catch (error) {
    console.error("=== 작품 등록 에러 ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", (error as Error).message);
    console.error("Error stack:", (error as Error).stack);
    console.error("Full error:", error);

    return NextResponse.json(
      { error: "작품 등록에 실패했습니다: " + (error as Error).message },
      { status: 500 },
    );
  }
}

// 작품 삭제
export async function DELETE(request: NextRequest) {
  try {
    // 인증 확인
    const token = request.cookies.get("admin-token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "작품 ID가 필요합니다" },
        { status: 400 },
      );
    }

    await query("DELETE FROM works WHERE id = ?", [id]);

    return NextResponse.json({ message: "작품이 삭제되었습니다" });
  } catch (error) {
    console.error("Delete work error:", error);
    return NextResponse.json(
      { error: "작품 삭제에 실패했습니다" },
      { status: 500 },
    );
  }
}
