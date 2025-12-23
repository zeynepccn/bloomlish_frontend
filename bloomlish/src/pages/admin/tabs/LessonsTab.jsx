import React from "react";

export default function LessonsTab({ purchases }) {
    return (
        <div>
            <h2 className="text-lg font-semibold text-pink-600 mb-4">Ders / Satın Alımlar</h2>

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
                        {purchases.map(x => (
                            <tr key={x.id} className="border-b hover:bg-pink-50">
                                <td className="p-2">{x.user}</td>
                                <td className="p-2">{x.lesson}</td>
                                <td className="p-2">{x.amount} TL</td>
                                <td className={`p-2 font-semibold ${x.paymentStatus === "SUCCESS" ? "text-green-600" :
                                        x.paymentStatus === "FAILED" ? "text-red-500" : "text-yellow-600"
                                    }`}>
                                    {x.paymentStatus}
                                </td>
                                <td className="p-2">{x.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
