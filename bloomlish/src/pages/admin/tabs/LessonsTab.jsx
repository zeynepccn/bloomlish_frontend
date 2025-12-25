import React from "react";

export default function LessonsTab({ purchases, loading }) {
    const fmtDate = (iso) => {
        if (!iso) return "—";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString("tr-TR");
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-pink-600 mb-4">
                Ders / Satın Alımlar
            </h2>

            {loading ? (
                <div className="p-4 bg-pink-50 rounded-xl">Yükleniyor...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-pink-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-pink-100">
                                <th className="p-2 text-left">User</th>
                                <th className="p-2 text-left">Lesson</th>
                                <th className="p-2 text-left">Amount</th>
                                <th className="p-2 text-left">Payment Status</th>
                                <th className="p-2 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases?.length ? (
                                purchases.map((x) => (
                                    <tr key={x.id} className="border-b hover:bg-pink-50">
                                        <td className="p-2">{x.user}</td>
                                        <td className="p-2">{x.lesson}</td>
                                        <td className="p-2">{x.amount} TL</td>

                                        <td
                                            className={`p-2 font-semibold ${x.paymentStatus === "PAID"
                                                    ? "text-green-600"
                                                    : x.paymentStatus === "UNPAID"
                                                        ? "text-yellow-700"
                                                        : "text-gray-600"
                                                }`}
                                        >
                                            {x.paymentStatus}
                                        </td>

                                        <td className="p-2">{fmtDate(x.createdAt)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="p-4 text-gray-500" colSpan={5}>
                                        Kayıt bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
