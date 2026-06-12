"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface LabOption {
  id: string;
  code: string;
  name: string;
}

export default function LecturerBulkScheduler() {
  // Database State
  const [labs, setLabs] = useState<LabOption[]>([]);

  // Form Wizard States
  const [selectedWeeks, setSelectedWeeks] = useState<10 | 12>(10);
  const [selectedLabId, setSelectedLabId] = useState("");
  const [subjectName, setSubjectName] = useState(
    "Sistem Basis Data Terdistribusi",
  );
  const [classSection, setClassSection] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:30");

  // Penentu Hari & Start Date Target
  const [startDate, setStartDate] = useState("2026-06-13"); // Default ke 13 Juni 2026
  const [dayName, setDayName] = useState("Sabtu");
  const [submitting, setSubmitting] = useState(false);

  // Ambil daftar laboratorium aktif untuk Dropdown Selector
  useEffect(() => {
    async function loadLabs() {
      try {
        const res = await fetch("/api/labs"); // Menggunakan API routing master lab sebelumnya
        const data = await res.json();
        if (res.ok && data.labs) {
          setLabs(data.labs);
          if (data.labs.length > 0) setSelectedLabId(data.labs[0].id);
        }
      } catch (err) {
        console.error("Gagal memuat list ruang lab:", err);
      }
    }
    loadLabs();
  }, []);

  // Update nama hari secara otomatis saat dosen merubah input Date picker
  const handleDateChange = (dateValue: string) => {
    setStartDate(dateValue);
    if (!dateValue) return;

    const daysInIndonesian = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const pickedDate = new Date(dateValue);
    const dayIndex = pickedDate.getDay();
    setDayName(daysInIndonesian[dayIndex]);
  };

  const handleBulkSubmit = async () => {
    if (!selectedLabId || !classSection || !startDate) {
      alert(
        "Harap lengkapi instrumen Ruangan, Kode Seksi Kelas, dan Tanggal Mulai!",
      );
      return;
    }

    // 👈 AMBIL TOKEN DARI LOCALSTORAGE (Sesuaikan tempat kamu menyimpan token saat login sukses)
    const token = localStorage.getItem("token");

    try {
      setSubmitting(true);
      const res = await fetch("/api/lecturer/bulk-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          labId: selectedLabId,
          subjectName,
          classSection,
          startTime,
          endTime,
          startDate,
          recurrenceWeeks: selectedWeeks,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(
          `🎉 ${data.message || "Plotting kelas satu semester berhasil disimpan!"}`,
        );
        setClassSection("");
      } else {
        alert(data.error || "Gagal memproses plotting massal.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  // Mencari nama lab terpilih untuk visual ringkasan di samping kanan
  const targetLabName =
    labs.find((l) => l.id === selectedLabId)?.name || "Belum dipilih";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#1a146b] tracking-tight">
          Bulk Scheduling
        </h2>
        <p className="text-[14px] text-[#474651] mt-1">
          Lakukan permohonan plotting jadwal kelas praktikum kuliah berulang
          secara massal untuk satu semester penuh.
        </p>
      </div>

      {/* Stepper wizard process lines */}
      <div className="flex items-center max-w-md mx-auto py-2">
        <div className="flex flex-col items-center flex-1 text-[#1a146b]">
          <div className="w-8 h-8 rounded-full border-2 border-[#1a146b] bg-[#e2dfff] flex items-center justify-center font-bold text-[13px]">
            1
          </div>
          <span className="text-[11px] font-bold mt-1">Konfigurasi</span>
        </div>
        <div className="h-0.5 bg-[#c8c5d3] flex-1"></div>
        <div className="flex flex-col items-center flex-1 text-[#777682]">
          <div className="w-8 h-8 rounded-full border-2 border-[#c8c5d3] bg-white flex items-center justify-center font-bold text-[13px]">
            2
          </div>
          <span className="text-[11px] font-medium mt-1">Konfirmasi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Forms Inputs Blocks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recurrence Radio Cards */}
          <Card
            variant="lowest"
            className="bg-white p-6 border border-[#c8c5d3]"
          >
            <h4 className="text-[16px] font-bold text-[#0b1c30] mb-4">
              Pilih Masa Berulang (Recurrence)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setSelectedWeeks(10)}
                className={`border-2 p-4 rounded-xl block cursor-pointer transition-all ${
                  selectedWeeks === 10
                    ? "border-[#4648d4] bg-[#e1e0ff]/30 text-[#1a146b]"
                    : "border-[#c8c5d3] hover:bg-[#f8f9ff]"
                }`}
              >
                <div className="flex justify-between items-center mb-1 font-bold">
                  <span className="text-[16px]">10 Minggu</span>
                  <span className="material-symbols-outlined">date_range</span>
                </div>
                <p className="text-[12px] text-[#474651] leading-relaxed">
                  Sesi praktikum rutin mingguan teratur di luar pekan UTS dan
                  UAS.
                </p>
              </div>

              <div
                onClick={() => setSelectedWeeks(12)}
                className={`border-2 p-4 rounded-xl block cursor-pointer transition-all ${
                  selectedWeeks === 12
                    ? "border-[#4648d4] bg-[#e1e0ff]/30 text-[#1a146b]"
                    : "border-[#c8c5d3] hover:bg-[#f8f9ff]"
                }`}
              >
                <div className="flex justify-between items-center mb-1 font-bold">
                  <span className="text-[16px]">
                    Semester Penuh (12 Minggu)
                  </span>
                  <span className="material-symbols-outlined">
                    event_available
                  </span>
                </div>
                <p className="text-[12px] text-[#777682] leading-relaxed">
                  Mencakup total 12 minggu penuh berturut-turut termasuk
                  pengerjaan tugas proyek.
                </p>
              </div>
            </div>
          </Card>

          {/* Form Meta Fields */}
          <Card
            variant="lowest"
            className="bg-white p-6 border border-[#c8c5d3] space-y-4"
          >
            <h4 className="text-[16px] font-bold text-[#0b1c30]">
              Detail Informasi Akademik
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Mata Kuliah Praktik"
                value={subjectName}
                onChange={(e: any) => setSubjectName(e.target.value)}
                required
              />
              <Input
                label="Kode Seksi Kelas"
                placeholder="Contoh: IF-402A"
                value={classSection}
                onChange={(e: any) => setClassSection(e.target.value)}
                required
              />

              {/* Dropdown Input Laboratorium dari Database */}
              <div className="space-y-1.5">
                <label className="block text-[12px] font-medium text-[#474651]">
                  Laboratorium Tujuan
                </label>
                <select
                  className="w-full h-[38px] px-3 bg-white border border-[#c8c5d3] rounded-md text-[14px] text-[#0b1c30] focus:outline-none focus:border-[#4648d4]"
                  value={selectedLabId}
                  onChange={(e) => setSelectedLabId(e.target.value)}
                >
                  {labs.length === 0 ? (
                    <option value="">Memuat list laboratorium...</option>
                  ) : (
                    labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        [{lab.code}] {lab.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Input Tanggal Mulai Efektif */}
              <Input
                label="Tanggal Mulai Kuliah Sesi 1"
                type="date"
                value={startDate}
                onChange={(e: any) => handleDateChange(e.target.value)}
                required
              />

              <Input
                label="Jam Masuk Sesi"
                type="time"
                value={startTime}
                onChange={(e: any) => setStartTime(e.target.value)}
                required
              />
              <Input
                label="Jam Selesai Sesi"
                type="time"
                value={endTime}
                onChange={(e: any) => setEndTime(e.target.value)}
                required
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Batal</Button>
            <Button
              variant="primary"
              icon="send"
              onClick={handleBulkSubmit}
              disabled={submitting}
            >
              {submitting
                ? "Memproses Plotting..."
                : "Ajukan Plotting Jadwal Kuliah"}
            </Button>
          </div>
        </div>

        {/* Right Preview Snapshots Bars */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="elevation" className="bg-[#1a146b] text-white p-6">
            <h4 className="text-[12px] font-bold text-[#9c9af4] uppercase tracking-wider mb-4">
              Ringkasan Pilihan
            </h4>
            <div className="space-y-4 text-[14px]">
              <div>
                <p className="text-[11px] opacity-70 font-bold uppercase">
                  Ruangan Target
                </p>
                <p className="text-[18px] font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[#c3c0ff]">
                    business
                  </span>{" "}
                  {targetLabName}
                </p>
              </div>
              <div className="h-[1px] bg-white/20"></div>
              <div>
                <p className="text-[11px] opacity-70 font-bold uppercase">
                  Hari Berulang & Durasi
                </p>
                <p className="text-[18px] font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[#c3c0ff]">
                    calendar_today
                  </span>{" "}
                  Setiap Hari {dayName} ({selectedWeeks} Pertemuan)
                </p>
                <p className="text-[11px] opacity-60 mt-1">
                  Dimulai dari tanggal: {startDate || "-"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
