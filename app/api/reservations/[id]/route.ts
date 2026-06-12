// app/api/reservations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ENDPOINT PATCH: Admin menyetujui (APPROVED) atau menolak (REJECTED) berkas pengajuan
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, staffComment, staffId } = body; // 'APPROVED' atau 'REJECTED'

    if (!status || !staffId) {
      return NextResponse.json({ message: "Data keputusan tidak lengkap" }, { status: 400 });
    }

    const updatedReservation = await prisma.$transaction(async (tx) => {
      // 1. Update status reservasi dan komentar dari Staf Lab
      const reservation = await tx.reservation.update({
        where: { id },
        data: {
          status, // APPROVED atau REJECTED
          staffComment: staffComment || null,
        },
        include: { loanItems: true }
      });

      // 2. JIKA DITOLAK (REJECTED), kembalikan stok alat yang tadinya sudah dikurangi ke kondisi semula
      if (status === "REJECTED" && reservation.loanItems.length > 0) {
        for (const item of reservation.loanItems) {
          await tx.equipment.update({
            where: { id: item.equipmentId },
            data: {
              availableStock: {
                increment: item.quantity, // Stok dikembalikan lagi
              },
            },
          });
        }
      }

      // 3. Catat jejak keputusan ke tabel AuditLog untuk keperluan jaminan pelacakan sistem
      await tx.auditLog.create({
        data: {
          action: status,
          staffId,
          refId: id,
          comment: staffComment || "Tanpa catatan tambahan.",
        },
      });

      return reservation;
    });

    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal memproses keputusan reservasi", error }, { status: 500 });
  }
}