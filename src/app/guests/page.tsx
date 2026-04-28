"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface CompanionData {
  name: string;
  gender: "male" | "female" | "unknown";
}

interface Guest {
  id: string;
  fullName: string;
  attendance: string;
  songSuggestion: string;
  timestamp: string;
  gender: "male" | "female" | "unknown";
  companions: CompanionData[];
  manuallyAdded: boolean;
}

interface Stats {
  total: number;
  attending: number;
  declined: number;
  companions: number;
  totalHeadcount: number;
  men: number;
  women: number;
  unknownGender: number;
}

function GenderBadge({ g }: { g: string }) {
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded inline-block ${
        g === "male"
          ? "bg-[#E3F2FD] text-[#1565C0]"
          : g === "female"
            ? "bg-[#FCE4EC] text-[#C2185B]"
            : "bg-gray-100 text-gray-400"
      }`}
    >
      {g === "male" ? "👨" : g === "female" ? "👩" : "❓"}
    </span>
  );
}

function GenderPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (g: "male" | "female") => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("male")}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
          value === "male"
            ? "bg-[#E3F2FD] text-[#1565C0] border-[#90CAF9] shadow-sm"
            : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
        }`}
      >
        👨 Man
      </button>
      <button
        type="button"
        onClick={() => onChange("female")}
        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
          value === "female"
            ? "bg-[#FCE4EC] text-[#C2185B] border-[#F48FB1] shadow-sm"
            : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
        }`}
      >
        👩 Woman
      </button>
    </div>
  );
}

function CompanionEditor({
  companions,
  setCompanions,
}: {
  companions: CompanionData[];
  setCompanions: (c: CompanionData[]) => void;
}) {
  return (
    <div className="space-y-2">
      {companions.map((c, idx) => (
        <div
          key={idx}
          className="p-3 bg-white rounded-lg border border-[#E8D5A3] space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8B7536] font-medium">
              #{idx + 1}
            </span>
            <input
              type="text"
              value={c.name}
              onChange={(e) => {
                const updated = [...companions];
                updated[idx] = { ...c, name: e.target.value };
                setCompanions(updated);
              }}
              placeholder="Companion name"
              className="flex-1 px-3 py-1.5 border border-[#E8D5A3] rounded-lg text-sm text-[#3E2723] focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="button"
              onClick={() =>
                setCompanions(companions.filter((_, i) => i !== idx))
              }
              className="text-red-400 hover:text-red-600 text-sm px-1.5 transition-colors"
            >
              ✕
            </button>
          </div>
          <GenderPicker
            value={c.gender}
            onChange={(g) => {
              const updated = [...companions];
              updated[idx] = { ...c, gender: g };
              setCompanions(updated);
            }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setCompanions([...companions, { name: "", gender: "unknown" }])
        }
        className="w-full px-3 py-2 rounded-lg text-sm text-[#1565C0] bg-[#E3F2FD] border border-[#90CAF9] hover:bg-[#BBDEFB] transition-colors"
      >
        ➕ Add Companion
      </button>
    </div>
  );
}

function GuestListContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "";
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");

  // Edit modal state
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState<"male" | "female" | "unknown">(
    "unknown",
  );
  const [editCompanions, setEditCompanions] = useState<CompanionData[]>([]);
  const [editSaving, setEditSaving] = useState(false);

  // Add guest modal state
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [addName, setAddName] = useState("");
  const [addGender, setAddGender] = useState<"male" | "female" | "unknown">(
    "unknown",
  );
  const [addCompanions, setAddCompanions] = useState<CompanionData[]>([]);
  const [addSaving, setAddSaving] = useState(false);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fetchGuests = useCallback(() => {
    if (!key) return;
    fetch(`/api/guests?key=${encodeURIComponent(key)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setGuests(data.rsvps);
        setStats(data.stats);
        setLoading(false);
      })
      .catch(() => {
        setError("Access denied. Invalid link.");
        setLoading(false);
      });
  }, [key]);

  useEffect(() => {
    if (!key) {
      setError("Missing access key");
      setLoading(false);
      return;
    }
    fetchGuests();
  }, [key, fetchGuests]);

  const openEdit = (guest: Guest) => {
    setEditGuest(guest);
    setEditName(guest.fullName);
    setEditGender(guest.gender);
    setEditCompanions(guest.companions.map((c) => ({ ...c })));
  };

  const closeEdit = () => {
    setEditGuest(null);
    setEditName("");
    setEditGender("unknown");
    setEditCompanions([]);
  };

  const saveEdit = async () => {
    if (!editGuest || !editName.trim()) return;
    setEditSaving(true);
    try {
      const res = await fetch(`/api/guests?key=${encodeURIComponent(key)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rsvpId: editGuest.id,
          fullName: editName,
          gender: editGender === "unknown" ? undefined : editGender,
          companions: editCompanions,
        }),
      });
      if (res.ok) {
        closeEdit();
        fetchGuests();
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setEditSaving(false);
    }
  };

  const addGuest = async () => {
    if (!addName.trim()) return;
    setAddSaving(true);
    try {
      const res = await fetch(`/api/guests?key=${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: addName,
          gender: addGender === "unknown" ? undefined : addGender,
          companions: addCompanions,
        }),
      });
      if (res.ok) {
        setShowAddGuest(false);
        setAddName("");
        setAddGender("unknown");
        setAddCompanions([]);
        fetchGuests();
      }
    } catch (err) {
      console.error("Failed to add guest:", err);
    } finally {
      setAddSaving(false);
    }
  };

  const handleDeleteGuest = async (rsvpId: string) => {
    setConfirmDelete(null);
    try {
      const res = await fetch(`/api/guests?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsvpId }),
      });
      if (res.ok) {
        closeEdit();
        fetchGuests();
      }
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[#3E2723] font-serif text-lg">
            Loading guest list...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-[#C62828] text-xl font-serif">🔒 {error}</p>
        </div>
      </div>
    );
  }

  const filtered =
    filter === "all" ? guests : guests.filter((g) => g.attendance === filter);
  const weddingDate = new Date("2026-05-17T00:00:00+02:00");
  const daysLeft = Math.max(
    0,
    Math.ceil((weddingDate.getTime() - Date.now()) / 86400000),
  );

  return (
    <div className="min-h-screen bg-[#FAF0E6]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3E2723] to-[#5D4037] text-center py-8 px-4">
        <h1 className="text-[#D4AF37] font-serif text-3xl sm:text-4xl tracking-wider">
          Wasim & Rayan
        </h1>
        <p className="text-[#C4A86C] text-xs tracking-[4px] mt-2 uppercase">
          Wedding Guest List
        </p>
        <p className="text-[#FFD54F] text-sm mt-3">📅 {daysLeft} days to go</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-4xl mx-auto px-4 -mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white rounded-xl shadow-md p-4 text-center border border-[#E8D5A3]">
              <div className="text-3xl font-bold text-[#3E2723]">
                {stats.total}
              </div>
              <div className="text-[10px] text-[#8B7536] uppercase tracking-wider mt-1">
                Total RSVPs
              </div>
            </div>
            <div className="bg-[#E8F5E9] rounded-xl shadow-md p-4 text-center border border-[#A5D6A7]">
              <div className="text-3xl font-bold text-[#2E7D32]">
                {stats.attending}
              </div>
              <div className="text-[10px] text-[#2E7D32] uppercase tracking-wider mt-1">
                Attending
              </div>
            </div>
            <div className="bg-[#FFEBEE] rounded-xl shadow-md p-4 text-center border border-[#EF9A9A]">
              <div className="text-3xl font-bold text-[#C62828]">
                {stats.declined}
              </div>
              <div className="text-[10px] text-[#C62828] uppercase tracking-wider mt-1">
                Declined
              </div>
            </div>
            <div className="bg-[#E3F2FD] rounded-xl shadow-md p-4 text-center border border-[#90CAF9]">
              <div className="text-3xl font-bold text-[#1565C0]">
                {stats.companions}
              </div>
              <div className="text-[10px] text-[#1565C0] uppercase tracking-wider mt-1">
                Companions
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-[#3E2723] to-[#5D4037] rounded-xl shadow-md p-4 text-center">
              <div className="text-3xl font-bold text-[#FFD54F]">
                {stats.totalHeadcount}
              </div>
              <div className="text-[10px] text-[#C4A86C] uppercase tracking-wider mt-1">
                Total Headcount
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="bg-[#E3F2FD] rounded-xl shadow-md p-3 text-center border border-[#90CAF9]">
              <div className="text-2xl font-bold text-[#1565C0]">
                👨 {stats.men}
              </div>
              <div className="text-[10px] text-[#1565C0] uppercase tracking-wider mt-1">
                Men
              </div>
            </div>
            <div className="bg-[#FCE4EC] rounded-xl shadow-md p-3 text-center border border-[#F48FB1]">
              <div className="text-2xl font-bold text-[#C2185B]">
                👩 {stats.women}
              </div>
              <div className="text-[10px] text-[#C2185B] uppercase tracking-wider mt-1">
                Women
              </div>
            </div>
            <div className="bg-[#FFF8E1] rounded-xl shadow-md p-3 text-center border border-[#FFD54F]">
              <div className="text-2xl font-bold text-[#F57F17]">
                ❓ {stats.unknownGender}
              </div>
              <div className="text-[10px] text-[#F57F17] uppercase tracking-wider mt-1">
                Unverified
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Button + Filter Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            {[
              {
                value: "all" as const,
                label: "All",
                count: guests.length,
              },
              {
                value: "yes" as const,
                label: "✅ Attending",
                count: guests.filter((g) => g.attendance === "yes").length,
              },
              {
                value: "no" as const,
                label: "❌ Declined",
                count: guests.filter((g) => g.attendance === "no").length,
              },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === tab.value
                    ? "bg-[#3E2723] text-[#D4AF37] shadow-md"
                    : "bg-white text-[#5D4037] border border-[#D4AF37]/30 hover:bg-[#FFF8E7]"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddGuest(true)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-[#2E7D32] text-white hover:bg-[#1B5E20] shadow-md transition-colors"
          >
            ➕ Add Guest
          </button>
        </div>
      </div>

      {/* Guest List */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#E8D5A3]">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-3 bg-[#3E2723] text-[#D4AF37] text-xs uppercase tracking-wider font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Guest Name</div>
            <div className="col-span-1">Edit</div>
            <div className="col-span-3">Companions</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date</div>
          </div>

          {filtered.map((guest, i) => (
            <div
              key={guest.id}
              className={`px-4 py-3 text-sm border-b border-[#F0E6D3] ${i % 2 === 0 ? "bg-white" : "bg-[#FDFAF5]"} hover:bg-[#FFF8E7] transition-colors`}
            >
              {/* Mobile */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-semibold text-[#3E2723] truncate">
                      {i + 1}. {guest.fullName}
                    </span>
                    <GenderBadge g={guest.gender} />
                    {guest.manuallyAdded && (
                      <span className="text-[10px] px-1 py-0.5 bg-[#FFF8E1] text-[#F57F17] rounded border border-[#FFD54F]">
                        manual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        guest.attendance === "yes"
                          ? "bg-[#E8F5E9] text-[#2E7D32]"
                          : "bg-[#FFEBEE] text-[#C62828]"
                      }`}
                    >
                      {guest.attendance === "yes" ? "✅" : "❌"}
                    </span>
                    <button
                      onClick={() => openEdit(guest)}
                      className="text-xs px-2 py-1 rounded bg-[#FFF8E7] text-[#8B7536] border border-[#E8D5A3] hover:bg-[#F5ECD5] transition-colors"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
                {guest.companions.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {guest.companions.map((c, ci) => (
                      <div key={ci} className="flex items-center gap-2">
                        <span className="text-xs text-[#1565C0]">
                          👫 {c.name || "Unnamed"}
                        </span>
                        <GenderBadge g={c.gender} />
                      </div>
                    ))}
                  </div>
                )}
                {guest.songSuggestion && (
                  <p className="text-xs text-[#8B7536]">
                    🎵 {guest.songSuggestion}
                  </p>
                )}
                <p className="text-[10px] text-[#A1887F]">
                  {new Date(guest.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Desktop */}
              <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1 text-[#A1887F]">{i + 1}</div>
                <div className="col-span-3 font-semibold text-[#3E2723] flex items-center gap-2">
                  <span className="truncate">{guest.fullName}</span>
                  <GenderBadge g={guest.gender} />
                  {guest.manuallyAdded && (
                    <span className="text-[10px] px-1 py-0.5 bg-[#FFF8E1] text-[#F57F17] rounded border border-[#FFD54F]">
                      manual
                    </span>
                  )}
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => openEdit(guest)}
                    className="text-xs px-2 py-1 rounded bg-[#FFF8E7] text-[#8B7536] border border-[#E8D5A3] hover:bg-[#F5ECD5] transition-colors"
                  >
                    ✏️
                  </button>
                </div>
                <div className="col-span-3 text-[#5D4037]">
                  {guest.companions.length > 0 ? (
                    <div className="space-y-0.5">
                      {guest.companions.map((c, ci) => (
                        <div key={ci} className="flex items-center gap-1">
                          <span className="text-[#1565C0] text-xs">
                            👫 {c.name || "Unnamed"}
                          </span>
                          <GenderBadge g={c.gender} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#A1887F]">—</span>
                  )}
                </div>
                <div className="col-span-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      guest.attendance === "yes"
                        ? "bg-[#E8F5E9] text-[#2E7D32]"
                        : "bg-[#FFEBEE] text-[#C62828]"
                    }`}
                  >
                    {guest.attendance === "yes" ? "✅ Yes" : "❌ No"}
                  </span>
                </div>
                <div className="col-span-2 text-[#A1887F] text-xs">
                  {new Date(guest.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-[#A1887F]">
              No guests found
            </div>
          )}
        </div>

        {/* Song Requests */}
        {filter !== "no" && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-[#E8D5A3]">
            <h2 className="text-[#3E2723] font-serif text-xl mb-4">
              🎶 Song Requests
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {guests
                .filter((g) => g.songSuggestion)
                .map((g, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 bg-[#FFF8E7] rounded-lg"
                  >
                    <span className="text-sm">🎵</span>
                    <div>
                      <p className="text-sm text-[#3E2723] font-medium">
                        {g.songSuggestion}
                      </p>
                      <p className="text-[10px] text-[#A1887F]">
                        — {g.fullName}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            {guests.filter((g) => g.songSuggestion).length === 0 && (
              <p className="text-[#A1887F] text-sm">No song requests yet</p>
            )}
          </div>
        )}

        {/* ════════════ ADD GUEST MODAL ════════════ */}
        {showAddGuest && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddGuest(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-[#E8D5A3] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[#3E2723] font-serif text-xl mb-4">
                ➕ Add Guest Manually
              </h3>

              <div className="mb-4">
                <label className="text-xs text-[#8B7536] uppercase tracking-wider block mb-1">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2 border border-[#E8D5A3] rounded-lg text-sm text-[#3E2723] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#8B7536] uppercase tracking-wider block mb-1">
                  Gender
                </label>
                <GenderPicker value={addGender} onChange={setAddGender} />
              </div>

              <div className="mb-4 p-3 bg-[#FDFAF5] rounded-lg border border-[#F0E6D3]">
                <label className="text-xs text-[#8B7536] uppercase tracking-wider block mb-2">
                  Companions
                </label>
                <CompanionEditor
                  companions={addCompanions}
                  setCompanions={setAddCompanions}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddGuest(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addGuest}
                  disabled={addSaving || !addName.trim()}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${addSaving ? "bg-gray-400" : "bg-[#2E7D32] hover:bg-[#1B5E20]"}`}
                >
                  {addSaving ? "Adding..." : "✅ Add Guest"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ EDIT GUEST MODAL ════════════ */}
        {editGuest && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeEdit}
          >
            <div
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-[#E8D5A3] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-[#3E2723] font-serif text-xl mb-4">
                ✏️ Edit Guest
              </h3>

              <div className="mb-4">
                <label className="text-xs text-[#8B7536] uppercase tracking-wider block mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8D5A3] rounded-lg text-sm text-[#3E2723] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs text-[#8B7536] uppercase tracking-wider block mb-1">
                  Gender
                </label>
                <GenderPicker value={editGender} onChange={setEditGender} />
              </div>

              <div className="mb-4 p-3 bg-[#FDFAF5] rounded-lg border border-[#F0E6D3]">
                <label className="text-xs text-[#8B7536] uppercase tracking-wider block mb-2">
                  Companions ({editCompanions.length})
                </label>
                <CompanionEditor
                  companions={editCompanions}
                  setCompanions={setEditCompanions}
                />
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={closeEdit}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={editSaving || !editName.trim()}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${editSaving ? "bg-gray-400" : "bg-[#2E7D32] hover:bg-[#1B5E20]"}`}
                >
                  {editSaving ? "Saving..." : "💾 Save Changes"}
                </button>
              </div>

              <button
                onClick={() =>
                  setConfirmDelete({
                    id: editGuest.id,
                    name: editGuest.fullName,
                  })
                }
                className="w-full px-4 py-2 rounded-lg text-xs text-[#C62828] bg-[#FFF5F5] border border-[#FFCDD2] hover:bg-[#FFEBEE] transition-colors"
              >
                🗑️ Delete This Guest Entirely
              </button>
            </div>
          </div>
        )}

        {/* ════════════ CONFIRM DELETE ════════════ */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border border-[#E8D5A3]">
              <p className="text-[#3E2723] font-serif text-lg mb-2">
                ⚠️ Confirm Delete
              </p>
              <p className="text-[#5D4037] text-sm mb-4">
                Delete &quot;{confirmDelete.name}&quot; and their entire RSVP?
                This cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteGuest(confirmDelete.id)}
                  className="px-4 py-2 rounded-lg text-sm bg-[#C62828] text-white hover:bg-[#B71C1C] transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#A1887F] text-xs">
            Wasim & Rayan Wedding · 17 May 2026 · Vlaardingen
          </p>
          <p className="text-[#C4A86C] text-[10px] mt-1">
            Last refreshed:{" "}
            {new Date().toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GuestsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
          <div className="inline-block w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GuestListContent />
    </Suspense>
  );
}
