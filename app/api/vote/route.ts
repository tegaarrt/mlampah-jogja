import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simpan data pilihan anggota ke database
    const voteBaru = await prisma.vote.create({
      data: {
        namaAnggota: body.nama,
        pilihan: body.pilihan,
        ruangId: body.kodeRuang // Ini akan tersambung otomatis ke kode ruang Ketua
      }
    });

    return NextResponse.json({ success: true, data: voteBaru });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal menyimpan vote" }, { status: 500 });
  }
}