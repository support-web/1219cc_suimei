import { NextRequest, NextResponse } from 'next/server';
import { BirthData } from '@/types';
import { calculateMeishiki } from '@/lib/suimei';

export async function POST(request: NextRequest) {
  try {
    const birthData: BirthData = await request.json();

    // バリデーション
    if (!birthData.year || !birthData.month || !birthData.day || !birthData.gender) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    // 年月日の範囲チェック
    if (birthData.year < 1900 || birthData.year > 2100) {
      return NextResponse.json(
        { error: '年は1900〜2100の範囲で入力してください' },
        { status: 400 }
      );
    }

    if (birthData.month < 1 || birthData.month > 12) {
      return NextResponse.json(
        { error: '月は1〜12の範囲で入力してください' },
        { status: 400 }
      );
    }

    if (birthData.day < 1 || birthData.day > 31) {
      return NextResponse.json(
        { error: '日は1〜31の範囲で入力してください' },
        { status: 400 }
      );
    }

    // 命式を計算
    const meishiki = await calculateMeishiki(birthData);

    return NextResponse.json(meishiki);
  } catch (error) {
    console.error('Fortune calculation error:', error);
    return NextResponse.json(
      { error: '命式の計算中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
