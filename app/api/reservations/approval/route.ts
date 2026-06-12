// app/api/reservations/approval/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_kelompok_plbk_super_aman_123";

// =========================================================================
// KONFIGURASI SMTP EMAIL
// =========================================================================
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER || "labreserve.notification@gmail.com", 
    pass: process.env.EMAIL_PASS || "abcd efgh ijkl mnop", 
  },
});

export async function PUT(request: Request) {
  try {
    // 1. VALIDASI PASPOR KEBERSAMAAN (JWT TOKEN)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Otorisasi gagal: Token tidak ditemukan!" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Sesi Anda kadaluarsa, silakan login kembali." }, { status: 401 });
    }

    // 2. ENFORCEMENT ROLE: Pastikan hanya LABSTAFF (Admin) yang bisa utak-atik status
    if (decoded.role !== "LABSTAFF") {
      return NextResponse.json({ message: "Akses ditolak: Anda tidak memiliki hak akses Admin!" }, { status: 403 });
    }

    // 3. AMBIL PAYLOAD FORMULIR DARI FRONTEND
    const body = await request.json();
    const { bookingId, status, rejectReason } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ message: "Data ID Pengajuan dan Status wajib ditentukan!" }, { status: 400 });
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json({ message: "Format status salah! Harus APPROVED atau REJECTED" }, { status: 400 });
    }

    // 4. CEK KEBERADAAN DATA RESERVASI + INCLUDE USER & LAB (UNTUK EMAIL)
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,        
        laboratory: true,  
      },
    });

    if (!existingBooking) {
      return NextResponse.json({ message: "Data pengajuan tidak ditemukan di database." }, { status: 404 });
    }

    // 5. UPDATE STATUS RESERVASI DI DATABASE SUPABASE
    let updatedPurpose = existingBooking.purpose;
    if (status === "REJECTED" && rejectReason) {
      updatedPurpose = `${existingBooking.purpose} [ALASAN DITOLAK ADMIN: ${rejectReason}]`;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: status,
        purpose: updatedPurpose,
      },
    });

    // =========================================================================
    // 🟢 6. OTOMATISASI PENGIRIMAN EMAIL NOTIFIKASI + FALLBACK PLAIN TEXT
    // =========================================================================
    if (existingBooking.user?.email) {
      try {
        const emailTujuan = existingBooking.user.email;
        const namaPemohon = existingBooking.user.name;
        const namaLab = existingBooking.laboratory?.name || "Laboratorium Kuliah";
        const tanggalSesi = new Date(existingBooking.date).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        const subjekEmail = status === "APPROVED" 
          ? "📢 [LabReserve] Permohonan Reservasi Lab Anda DISETUJUI" 
          : "⚠️ [LabReserve] Permohonan Reservasi Lab Anda DITOLAK";

        // 🟢 REVISI SOLUSI 2: Definisikan teks polos cadangan agar tidak dicurigai filter bot spam Gmail
        const isiEmailTextPolos = status === "APPROVED"
          ? `Halo ${namaPemohon}, permohonan reservasi Anda untuk ${namaLab} pada hari ${tanggalSesi} (${existingBooking.startTime} - ${existingBooking.endTime} WIB) telah resmi DISETUJUI oleh Staf Laboratorium. Silakan datang tepat waktu.`
          : `Halo ${namaPemohon}, permohonan reservasi Anda untuk ${namaLab} pada hari ${tanggalSesi} terpaksa DITOLAK oleh Staf Laboratorium dengan alasan resmi: "${rejectReason}". Silakan ajukan kembali jadwal alternatif lain melalui dashboard.`;

        const isiEmailHtml = status === "APPROVED" 
          ? `
            <div style="font-family: sans-serif; padding: 20px; color: #0b1c30;">
              <h2 style="color: #1a146b;">Selamat, Permohonan Anda Disetujui!</h2>
              <p>Halo <b>${namaPemohon}</b>,</p>
              <p>Permohonan reservasi ruangan laboratorium Anda telah resmi diverifikasi dan <b>DISETUJUI</b> oleh Staf Teknis Laboratorium dengan detail agenda:</p>
              <table style="margin: 20px 0; border-collapse: collapse;">
                <tr><td><b>Laboratorium</b></td><td>: ${namaLab}</td></tr>
                <tr><td><b>Jadwal Hari</b></td><td>: ${tanggalSesi}</td></tr>
                <tr><td><b>Alokasi Waktu</b></td><td>: ${existingBooking.startTime} - ${existingBooking.endTime} WIB</td></tr>
                <tr><td><b>Tujuan Sesi</b></td><td>: ${existingBooking.purpose.split("[MOHON")[0]}</td></tr>
              </table>
              <p>Silakan datang tepat waktu dan jagalah ketertiban serta kebersihan fasilitas laboratorium akademik selama sesi berlangsung.</p>
              <hr style="border: 0; border-top: 1px solid #c8c5d3; margin: 20px 0;" />
              <small style="color: #777682;">Email ini dikirim otomatis oleh Sistem Portal Akademik LabReserve Kelompok 11.</small>
            </div>
          `
          : `
            <div style="font-family: sans-serif; padding: 20px; color: #0b1c30;">
              <h2 style="color: #ba1a1a;">Mohon Maaf, Permohonan Anda Ditolak</h2>
              <p>Halo <b>${namaPemohon}</b>,</p>
              <p>Dengan berat hati kami menginformasikan bahwa permohonan reservasi Anda untuk <b>${namaLab}</b> pada hari <b>${tanggalSesi}</b> terpaksa <b>DITOLAK</b> oleh Staf Laboratorium.</p>
              <div style="background: #ffdad6; padding: 15px; border-left: 4px solid #ba1a1a; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-weight: bold; color: #ba1a1a;">Alasan Penolakan Resmi:</p>
                <p style="margin: 5px 0 0 0; color: #410002;">"${rejectReason}"</p>
              </div>
              <p>Silakan ajukan kembali permohonan baru dengan memilih slot waktu alternatif atau ruangan laboratorium cadangan lain melalui dashboard.</p>
              <hr style="border: 0; border-top: 1px solid #c8c5d3; margin: 20px 0;" />
              <small style="color: #777682;">Email ini dikirim otomatis oleh Sistem Portal Akademik LabReserve Kelompok 11.</small>
            </div>
          `;

        // Eksekusi pengiriman email SMTP
        transporter.sendMail({
          from: `"LabReserve Portal" <${process.env.EMAIL_USER}>`,
          to: emailTujuan,
          subject: subjekEmail,
          text: isiEmailTextPolos, // 🟢 SUNTIKAN REVISI SOLUSI 2: Text Polos Terpasang
          html: isiEmailHtml,
        }).then(() => {
          console.log(`✉️ Email notifikasi sukses terkirim ke: ${emailTujuan}`);
        }).catch((mailErr) => {
          console.error("❌ Gagal mengirim email SMTP:", mailErr);
        });

      } catch (emailBuildError) {
        console.error("❌ Gagal menyusun struktur komponen email:", emailBuildError);
      }
    }

    return NextResponse.json({
      message: `Berkas reservasi berhasil di-${status.toLowerCase()} dan antrean diperbarui!`,
      updatedBooking,
    }, { status: 200 });

  } catch (error) {
    console.error("Error Approval API Runtime:", error);
    return NextResponse.json({ message: "Gagal memproses keputusan berkas", error }, { status: 500 });
  }
}