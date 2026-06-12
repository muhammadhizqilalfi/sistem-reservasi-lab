import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bookingId,
      action,
      comment,
      recipientEmail,
      requesterName,
      labName,
      date,
      time,
    } = body;

    if (!bookingId || !action || !recipientEmail) {
      return NextResponse.json(
        { error: "bookingId, action, dan recipientEmail wajib diisi." },
        { status: 400 }
      );
    }

    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";
    const decisionText = action === "APPROVE" ? "disetujui" : "ditolak";

    try {
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status,
        },
      });
    } catch (error: unknown) {
      // Jika booking tidak ditemukan, lanjutkan hanya dengan pengiriman email.
      // Prisma error code P2025 berarti record tidak ditemukan.
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2025"
      ) {
        console.warn(`Booking ${bookingId} tidak ditemukan, teruskan pengiriman email.`);
      } else {
        throw error;
      }
    }

    const subject = `Pengajuan Reservasi Lab ${decisionText}`;
    const html = `
      <div style="font-family: sans-serif; color: #111; line-height: 1.6;">
        <h2>Halo ${requesterName || "Pengaju"},</h2>
        <p>Permohonan reservasi laboratorium Anda dengan ID <strong>${bookingId}</strong> telah <strong>${decisionText}</strong>.</p>
        <p><strong>Detail Reservasi:</strong></p>
        <ul>
          <li>Laboratorium: ${labName || "-"}</li>
          <li>Tanggal: ${date || "-"}</li>
          <li>Waktu: ${time || "-"}</li>
        </ul>
        <p>Catatan staf lab:</p>
        <blockquote style="border-left: 4px solid #2563eb; padding-left: 12px; color: #374151;">
          ${comment ? comment.replace(/\n/g, "<br />") : "-"}
        </blockquote>
        <p>Terima kasih telah menggunakan sistem reservasi lab.</p>
        <p>Salam,<br />Tim Administrasi Laboratorium</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject,
      html,
      text: `Halo ${requesterName || "Pengaju"},\n\nPermohonan reservasi laboratorium Anda dengan ID ${bookingId} telah ${decisionText}.\n\nLaboratorium: ${labName || "-"}\nTanggal: ${date || "-"}\nWaktu: ${time || "-"}\n\nCatatan staf lab:\n${comment || "-"}\n\nTerima kasih.`,
    });

    return NextResponse.json({ message: "Notifikasi email berhasil dikirim." });
  } catch (error) {
    console.error("Error approval route:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses persetujuan." },
      { status: 500 }
    );
  }
}
