import React from "react";

export default function PaymentDetailModal({ payment, onClose }) {
    if (!payment) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(payment.rawResponse || "");
            alert("Raw response kopyalandı.");
        } catch {
            alert("Kopyalama başarısız.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-pink-700">Payment Detail</h3>
                        <p className="text-sm text-gray-500">#{payment.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                        Kapat
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <Info label="User" value={payment.user} />
                    <Info label="Lesson/Order" value={payment.lesson} />
                    <Info label="Amount" value={`${payment.amount} TL`} />
                    <Info label="Status" value={payment.status} />
                    <Info label="Provider" value={payment.provider} />
                    <Info label="CreatedAt" value={payment.createdAt} />
                    <Info label="Transaction/Ref" value={payment.refNo || "—"} />
                    <Info label="Refund/İptal" value={payment.refundStatus || "—"} />
                </div>

                <div className="mt-5">
                    <div className="font-semibold text-gray-700 mb-2">Hata / Log</div>
                    <div className="bg-gray-50 border rounded-xl p-3 text-sm">
                        <div className="mb-2">
                            <span className="font-medium">Error Message:</span>{" "}
                            <span className="text-gray-700">{payment.errorMessage || "—"}</span>
                        </div>

                        <details>
                            <summary className="cursor-pointer text-pink-700 font-medium">
                                Raw Response (aç/kapat)
                            </summary>

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleCopy}
                                    className="px-3 py-1 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 text-xs"
                                >
                                    Kopyala
                                </button>
                            </div>

                            <pre className="mt-2 whitespace-pre-wrap text-xs bg-white border rounded-lg p-2 overflow-auto max-h-64">
                                {payment.rawResponse || "—"}
                            </pre>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="bg-pink-50 border border-pink-100 rounded-xl p-3">
            <div className="text-gray-500">{label}</div>
            <div className="font-medium text-gray-800 break-words">{value}</div>
        </div>
    );
}
