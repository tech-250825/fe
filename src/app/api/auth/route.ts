import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/admin/db";
import { verifyPassword, generateToken } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "사용자명과 비밀번호를 입력해주세요" },
        { status: 400 },
      );
    }

    // 환경변수에서 관리자 계정 정보 가져오기
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername) {
      console.error("Admin credentials not configured");
      return NextResponse.json({ error: "서버 설정 오류" }, { status: 500 });
    }

    // 인증 확인
    if (username === adminUsername) {
      // JWT 토큰 생성
      const token = generateToken(1, username);

      // 쿠키에 토큰 설정
      const response = NextResponse.json({
        message: "로그인 성공",
        user: { id: 1, username: username },
      });

      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24시간
      });

      return response;
    } else {
      return NextResponse.json(
        { error: "잘못된 사용자명 또는 비밀번호입니다" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ message: "로그아웃 성공" });
  response.cookies.delete("admin-token");
  return response;
}
