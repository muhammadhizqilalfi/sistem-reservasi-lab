import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const labId = searchParams.get("labId");
    const date = searchParams.get("date");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    // 1. Validasi query parameter wajib
    if (!labId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Parameter tidak lengkap" },
        { status: 400 }
      );
    }
    
    let conflictFound = false;
    let conflictDetails = null;

    // ====================================================================
    // SIMULASI TESTING UI: Bentrok hanya dipicu jika tanggal 2026-06-13
    // Silakan ganti tanggal di bawah ke tanggal lain jika ingin tes alert di frontend
    // ====================================================================
    if (date === "2026-06-13" && (startTime === "14:00" || startTime === "08:00")) {
      conflictFound = true;
      conflictDetails = {
        message: "Jadwal bentrok dengan kelas Praktikum Jaringan di Lab Komputer A pada pukul 14:00 - 16:00.",
      };
    }
    // ====================================================================

    // 3. Respon jika ditemukan jadwal bentrok
    if (conflictFound) {
      return NextResponse.json({
        conflict: conflictDetails
      });
    }

    // 4. Respon jika jadwal aman (tidak bentrok)
    return NextResponse.json({ conflict: null });

  } catch (error) {
    console.error("Error pada API check-conflict:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}