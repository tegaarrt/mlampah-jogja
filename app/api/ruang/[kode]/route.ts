import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; // Di folder [kode], titik 4 pasang ini BENAR

export async function GET(
  request: Request,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const resolvedParams = await params;
    const kodeTarget = resolvedParams.kode;

    const ruang = await prisma.ruang.findUnique({
      where: { kodeAkses: kodeTarget },
      include: { votes: true }
    });

    if (!ruang) return NextResponse.json({ success: false, message: "Ruang tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: ruang });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}