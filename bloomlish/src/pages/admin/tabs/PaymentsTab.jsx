import React, { useMemo, useState } from "react";
import PaymentDetailModal from "../components/PaymentDetailModal";


export default function PaymentsTab({ payments }) {
    const [status, setStatus] = useState("ALL");
    const [selected, setSelected] = useState(null);

    const filtered = useMemo(() => {
        return payments.filter(p => (status === "ALL" ? true : p.status === status));
    }, [payments, status]);

    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <h2 className="text-lg font-semibold text-pink-600">Ödemeler</h2>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded-xl px-3 py-2"
                >
                    <option value="ALL">ALL</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="FAILED">FAILED</option>
                    <option value="PENDING">PENDING</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-pink-200 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-pink-100">
                            <th className="p-2 text-left">User</th>
                            <th className="p-2 text-left">Lesson/Order</th>
                            <th className="p-2 text-left">Amount</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Provider</th>
                            <th className="p-2 text-left">CreatedAt</th>
                            <th className="p-2 text-left">Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr
                                key={p.id}
                                className="border-b hover:bg-pink-50 cursor-pointer"
                                onClick={() => setSelected(p)}
                            >
                                <td className="p-2">{p.user}</td>
                                <td className="p-2">{p.lesson}</td>
                                <td className="p-2">{p.amount} TL</td>
                                <td className={`p-2 font-semibold ${p.status === "SUCCESS" ? "text-green-600" :
                                    p.status === "FAILED" ? "text-red-500" : "text-yellow-600"
                                    }`}>
                                    {p.status}
                                </td>
                                <td className="p-2">{p.provider}</td>
                                <td className="p-2">{p.createdAt}</td>
                                <td className="p-2 text-sm text-gray-500">
                                    {p.status === "FAILED" ? (p.errorMessage || "—").slice(0, 60) : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <PaymentDetailModal payment={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
