"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

interface AuditEvent {
  timestamp: string;
  event: "Approved" | "Rejected";
  staffName: string;
  refId: string;
  requester: string;
  comment: string;
}

export default function AuditLogPage() {
  const auditLogs: AuditEvent[] = [
    { timestamp: "2026-11-27 09:14:22", event: "Approved", staffName: "Dr. Ahmad Subarjo", refId: "#REQ-90122", requester: "Indra Wijaya", comment: "Peralatan sesuai spesifikasi dan tersedia di Lab Bio." },
    { timestamp: "2026-11-27 08:45:01", event: "Rejected", staffName: "Siti Aminah, M.T.", refId: "#REQ-89410", requester: "Sarah Amelia", comment: "Dokumen pengantar belum lengkap, mohon lampirkan KTM." },
    { timestamp: "2026-11-26 16:30:45", event: "Approved", staffName: "Budi Santoso", refId: "#REQ-88721", requester: "Deni Kurniawan", comment: "Peminjaman jangka pendek disetujui." },
    { timestamp: "2026-11-26 14:12:10", event: "Approved", staffName: "Dr. Ahmad Subarjo", refId: "#REQ-88699", requester: "Rina Safitri", comment: "Kalibrasi alat selesai, siap dipinjamkan." },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h3 className="text-[28px] font-bold text-[#1a146b]">ApprovalLog History</h3>
        <p className="text-[14px] text-[#474651] mt-1">Sistem Audit Trail terpusat untuk memantau seluruh aktivitas persetujuan laboratorium dan peminjaman peralatan.</p>
      </div>

      {/* Advanced Filter Toolbar Section Component */}
      <Card variant="lowest" className="p-6 bg-white border border-[#c8c5d3]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[#474651] px-1">Rentang Tanggal</label>
            <Input icon="calendar_today" type="date" />
          </div>
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[#474651] px-1">Nama Petugas Lab</label>
            <Input icon="person" placeholder="Cari nama staff..." />
          </div>
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[#474651] px-1">Status Log</label>
            <Select>
              <option>Semua Status</option>
              <option>Approved</option>
              <option>Rejected</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" className="w-full" icon="filter_list">Terapkan Filter</Button>
          </div>
        </div>
      </Card>

      {/* High-Density Logs Table */}
      <div className="bg-white border border-[#c8c5d3] rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#c8c5d3] text-[#474651] text-[12px] font-bold uppercase tracking-wider">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Action Event</th>
                <th className="px-6 py-3">Processor (Staff Lab)</th>
                <th className="px-6 py-3">Ref ID</th>
                <th className="px-6 py-3">Requester Name</th>
                <th className="px-6 py-3">Komentar / Alasan</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c5d3]/30 text-[14px]">
              {auditLogs.map((log, index) => (
                <tr key={index} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="px-6 py-4 text-[#474651] whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-bold border ${
                      log.event === "Approved" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/20"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${log.event === "Approved" ? "bg-emerald-500" : "bg-[#ba1a1a]"}`} />
                      {log.event}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0b1c30]">{log.staffName}</td>
                  <td className="px-6 py-4 font-mono text-[#4648d4] font-semibold">{log.refId}</td>
                  <td className="px-6 py-4 text-[#0b1c30]">{log.requester}</td>
                  <td className="px-6 py-4 text-[#474651] max-w-xs truncate" title={log.comment}>{log.comment}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-[#777682] hover:text-[#1a146b] transition-colors" title="Buka Dokumen">
                      open_in_new
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}