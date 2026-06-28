import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"; // Titiknya cuma 3 pasang

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ruangBaru = await prisma.ruang.create({
      data: { kodeAkses: body.kodeRuang }
    });
    return NextResponse.json({ success: true, data: ruangBaru });
  } catch (error) {
    console.log("ERROR BIKIN RUANG:", error); 
    return NextResponse.json({ success: false, message: "Gagal membuat ruang" }, { status: 500 });
  }
}