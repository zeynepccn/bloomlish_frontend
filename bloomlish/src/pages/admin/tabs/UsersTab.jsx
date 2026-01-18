import React, { useMemo, useState } from "react";

export default function UsersTab({
    users,
    onRoleChange,
    onStatusChange,
    onPremiumToggle,
}) {
    const [q, setQ] = useState("");
    const [savedRow, setSavedRow] = useState(null); // userId

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return users;
        return users.filter(
            (u) =>
                (u.email || "").toLowerCase().includes(s) ||
                (u.username || "").toLowerCase().includes(s)
        );
    }, [q, users]);

    const showSaved = (id) => {
        setSavedRow(id);
        setTimeout(() => setSavedRow(null), 2000);
    };

    const handleRoleChangeWithMessage = async (id, role) => {
        await onRoleChange(id, role);
        showSaved(id);
    };

    const handleStatusChangeWithMessage = async (id, status) => {
        await onStatusChange(id, status);
        showSaved(id);
    };

    const handlePremiumToggleWithMessage = async (id) => {
        await onPremiumToggle(id);
        showSaved(id);
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <h2 className="text-lg font-semibold text-pink-600">
                    Kullanıcı Yönetimi
                </h2>

                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="email / username ara..."
                    className="border rounded-xl px-3 py-2 w-72"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-pink-200 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-pink-100">
                            <th className="p-2 text-left">Username</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Role</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Level</th>
                            <th className="p-2 text-left">Premium</th>
                            <th className="p-2 text-left">Kayıt</th>
                            <th className="p-2 text-left">Durum</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((u) => (
                            <tr key={u.id} className="border-b hover:bg-pink-50">
                                <td className="p-2">{u.username}</td>
                                <td className="p-2">{u.email}</td>

                                <td className="p-2">
                                    <select
                                        value={u.role}
                                        onChange={(e) =>
                                            handleRoleChangeWithMessage(u.id, e.target.value)
                                        }
                                        className="border rounded-lg px-2 py-1"
                                    >
                                        <option value="STUDENT">STUDENT</option>
                                        <option value="INSTRUCTOR">INSTRUCTOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>

                                <td className="p-2">
                                    <select
                                        value={u.status}
                                        onChange={(e) =>
                                            handleStatusChangeWithMessage(u.id, e.target.value)
                                        }
                                        className="border rounded-lg px-2 py-1"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="PASSIVE">PASSIVE</option>
                                        <option value="BANNED">BANNED</option>
                                    </select>
                                </td>

                                <td className="p-2">{u.level || "—"}</td>

                                <td className="p-2">
                                    <button
                                        onClick={() => handlePremiumToggleWithMessage(u.id)}
                                        className={`px-3 py-1 rounded-lg text-white ${u.premium ? "bg-green-500" : "bg-gray-400"
                                            }`}
                                    >
                                        {u.premium ? "ON" : "OFF"}
                                    </button>
                                </td>

                                <td className="p-2">
                                    {u.createdAt
                                        ? new Date(u.createdAt).toLocaleDateString("tr-TR")
                                        : "—"}
                                </td>

                                <td className="p-2 text-green-600 text-sm font-medium">
                                    {savedRow === u.id && "✓ Kaydedildi"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
