import React, { useEffect, useState } from "react";
import UsersTab from "./tabs/UsersTab";
import PaymentsTab from "./tabs/PaymentsTab";
import LessonsTab from "./tabs/LessonsTab";
import api from "../../api";

const TABS = [
    { key: "users", label: "Kullanıcılar" },
    { key: "payments", label: "Ödemeler" },
    { key: "lessons", label: "Ders Satın Alımlar" },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("users");

    const [users, setUsers] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    const [payments, setPayments] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingEnrollments, setLoadingEnrollments] = useState(false);
    const [loadingPayments, setLoadingPayments] = useState(false);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await api.get("/api/admin/users?page=0&size=50");
            // Spring Page dönüyorsa res.data.content
            const list = res.data.content ?? res.data;
            // UsersTab’ın beklediği shape’e uyarlayalım:
            const mapped = list.map(u => ({
                id: u.userId,
                username: u.username,
                email: u.email,
                role: (u.role || "").replace("ROLE_", ""),
                level: u.currentLevel,
                premium: !!u.premium,
                createdAt: u.createdAt ?? "",
                status: u.accountStatus || "ACTIVE",
            }));
            setUsers(mapped);

        } finally {
            setLoadingUsers(false);
        }
    };

    // 2) ENROLLMENTS çek (paid=null -> hepsi)
    const fetchEnrollments = async () => {
        setLoadingEnrollments(true);
        try {
            const res = await api.get("/api/admin/enrollments?page=0&size=50");
            const list = res.data.content ?? res.data;
            setEnrollments(list);
        } finally {
            setLoadingEnrollments(false);
        }
    };

    const fetchPayments = async () => {
        setLoadingPayments(true);
        try {
            const res = await api.get("/api/admin/payments?page=0&size=50");
            const page = res.data;
            const list = page.content ?? page;

            // Backend DTO: {id,user,plan,amount,currency,status,createdAt}
            // PaymentsTab: {id,user,order,amount,currency,status,createdAt} bekleyecek
            const mapped = list.map((p) => ({
                id: p.id,
                user: p.user,
                order: p.plan, // planType'ı order alanına koyuyoruz
                amount: p.amount,
                currency: p.currency || "TRY",
                status: p.status,
                createdAt: p.createdAt, // iso string gelir
            }));
            setPayments(mapped);
        } finally {
            setLoadingPayments(false);
        }
    };


    useEffect(() => {
        fetchUsers();
        fetchEnrollments();
        fetchPayments(); // istersen her seferinde değil, tab'a girince
    }, []);

    useEffect(() => {
        if (activeTab === "payments") fetchPayments();
        if (activeTab === "lessons") fetchEnrollments();
        if (activeTab === "users") fetchUsers();
    }, [activeTab]);


    // 3) Role change -> backend PATCH
    const handleRoleChange = async (id, role) => {
        // UsersTab role'u "ADMIN" gibi veriyorsa backend "ROLE_ADMIN" ister
        const roleValue = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
        await api.patch(`/api/admin/users/${id}/role`, { role: roleValue });
        // optimistik UI:
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, role } : u)));
    };

    const handleStatusChange = async (id, status) => {
        await api.patch(`/api/admin/users/${id}/status`, { status });
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, status } : u)));
    };

    const handlePremiumToggle = async (id) => {
        const current = users.find(u => u.id === id);
        const next = !current?.premium;
        await api.patch(`/api/admin/users/${id}/premium`, { premium: next });
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, premium: next } : u)));
    };
    const purchases = enrollments.map((e) => ({
        id: e.enrollmentId ?? e.id,
        user: e.userEmail ?? e.studentEmail ?? e.userName,
        lesson: e.lessonName,
        amount: e.amount ?? e.price,
        paymentStatus: e.paymentStatus ?? (e.paid ? "PAID" : "UNPAID"),
        createdAt: e.date ?? e.enrolledAt,
    }));



    return (
        <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 p-6">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 text-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-pink-700"> Admin Panel</h1>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            window.location.href = "/login";
                        }}
                        className="bg-rose-400 text-white px-4 py-2 rounded-xl hover:bg-rose-500"
                    >
                        Çıkış
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`px-4 py-2 rounded-xl transition ${activeTab === t.key ? "bg-pink-100 text-pink-700 font-semibold" : "bg-gray-50 hover:bg-pink-50"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === "users" && (
                    <UsersTab
                        users={users}
                        onRoleChange={handleRoleChange}
                        onStatusChange={handleStatusChange}
                        onPremiumToggle={handlePremiumToggle}
                        loading={loadingUsers}
                    />
                )}

                {activeTab === "payments" && (
                    <PaymentsTab data={payments} loading={loadingPayments} />
                )}


                {activeTab === "lessons" && (
                    <LessonsTab purchases={purchases} loading={loadingEnrollments} />
                )}

            </div>
        </div>
    );
}
