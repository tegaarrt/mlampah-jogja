
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Ganti import Prisma dengan Supabase

export async function GET(
  request: Request,
  { params }: { params: Promise<{ kode: string }> }
) {
  try {
    const resolvedParams = await params;
    const kodeTarget = resolvedParams.kode;

    // Mengambil data Ruang dari Supabase
    const { data: ruang, error } = await supabase
      .from('ruang')
      .select('*') // Sesuaikan kolom jika perlu
      .eq('kode_ruang', kodeTarget)
      .single();

    if (error || !ruang) {
      return NextResponse.json({ success: false, message: "Ruang tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: ruang });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}