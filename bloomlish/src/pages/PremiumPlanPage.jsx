import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Layout, Typography, Card, Table, Button, Tag, Spin } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

// "2025-11-26" -> "26/11/2025"
const formatDateTR = (iso) => {
    if (!iso) return "-";
    try {
        const [y, m, d] = iso.split("-");
        return `${d}/${m}/${y}`;
    } catch {
        return iso;
    }
};

const planLabelMap = {
    MONTHLY: "Aylık",
    YEARLY: "Yıllık",
};

export default function PremiumPlanPage() {
    const [subscription, setSubscription] = useState(null); // SubscriptionDto
    const [payments, setPayments] = useState([]);          // PaymentHistoryItemDto[]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const printableRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Bu sayfayı görmek için önce giriş yapmalısınız.");
                    setLoading(false);
                    return;
                }

                setLoading(true);
                setError(null);

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                // 1) Aktif abonelik bilgisi
                const subRes = await axios.get(
                    "http://localhost:8080/api/billing/subscription",
                    { headers }
                );

                // 2) Ödeme geçmişi
                const payRes = await axios.get(
                    "http://localhost:8080/api/billing/payments",
                    { headers }
                );

                setSubscription(subRes.data);
                setPayments(payRes.data || []);
            } catch (err) {
                console.error(err);
                setError("Premium bilgileri yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadPDF = () => {
        // Basit çözüm: yazdır ekranı -> PDF olarak kaydet
        window.print();
    };


    const hasActive =
        subscription && subscription.hasActiveSubscription === true;

    const currentPlanType = hasActive ? subscription.planType : null;
    const planLabel = hasActive ? planLabelMap[currentPlanType] || currentPlanType : "Aktif plan yok";
    const expiresAt = hasActive ? formatDateTR(subscription.expiresAt) : "-";
    const features = hasActive ? subscription.features || [] : [];

    // Ödeme tablosu için dataSource
    const dataSource = payments.map((p, index) => ({
        key: index.toString(),
        date: formatDateTR(p.date),                       // LocalDate -> TR format
        plan: planLabelMap[p.plan] || p.plan,
        amount: `${p.amount} ${p.currency || "TL"}`,
        rawStatus: p.status,
    }));

    const columns = [
        { title: "TARİH", dataIndex: "date", key: "date" },
        { title: "PLAN", dataIndex: "plan", key: "plan" },
        { title: "TUTAR", dataIndex: "amount", key: "amount" },
        {
            title: "DURUM",
            dataIndex: "rawStatus",
            key: "status",
            render: (value) => {
                const isPaid = value === "PAID" || value === "SUCCESS";
                return (
                    <Tag color={isPaid ? "green" : "red"}>
                        {isPaid ? "Ödendi" : value}
                    </Tag>
                );
            },
        },
    ];

    return (
        <Layout className="min-h-screen bg-white">
            <Content className="max-w-4xl mx-auto px-6 py-10">
                {/* Üst başlık */}
                <div className="text-center mb-6">
                    <Title level={2} className="!m-0 tracking-wide">
                        PREMIUM
                    </Title>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <Card className="!rounded-2xl border border-red-300 bg-red-50">
                        <Text type="danger">{error}</Text>
                    </Card>
                ) : (
                    <>
                        {/* PLAN ÖZETİ */}
                        <Card className="!rounded-2xl bg-white/90 border border-black/20">
                            <div className="rounded-xl border border-black/20 bg-neutral-200/80 p-6 md:p-8 relative">
                                <div className="flex items-center justify-between mb-6">
                                    <Title level={4} className="!m-0">
                                        {hasActive ? `${planLabel.toUpperCase()} PLAN` : "Aktif Plan Yok"}
                                    </Title>

                                    {hasActive && (
                                        <Tag
                                            color="green"
                                            className="!rounded-xl !px-3 !py-1 !text-xs"
                                        >
                                            Aktif
                                        </Tag>
                                    )}
                                </div>

                                {/* Özellikler */}
                                {hasActive ? (
                                    <div className="grid gap-3">
                                        {features.length > 0 ? (
                                            features.map((f, i) => (
                                                <div
                                                    key={`${f}-${i}`}
                                                    className="flex items-center gap-3 text-lg"
                                                >
                                                    <CheckOutlined />
                                                    <span className="tracking-wide">{f}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <Text>Bu plan için özellik listesi bulunamadı.</Text>
                                        )}
                                    </div>
                                ) : (
                                    <Text>Henüz aktif bir premium aboneliğiniz bulunmuyor.</Text>
                                )}

                                {/* Sağ altta geçerlilik tarihi */}
                                {hasActive && (
                                    <div className="mt-10 text-right text-gray-500">
                                        <span>Son geçerlilik tarihi {expiresAt}</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Fatura Geçmişi */}
                        <div className="mt-12">
                            <Title level={3} className="!m-0 mb-4">
                                FATURA GEÇMİŞİ
                            </Title>

                            <div ref={printableRef}>
                                <Card className="!rounded-2xl bg-white/90 border border-black/20">
                                    <Table
                                        dataSource={dataSource}
                                        columns={columns}
                                        pagination={false}
                                        className="[&_.ant-table]:!bg-transparent"
                                    />
                                </Card>
                            </div>

                            <div className="mt-4">
                                <Button
                                    onClick={handleDownloadPDF}
                                    className="!rounded-xl !bg-amber-400 !text-black border border-black/30 hover:!bg-amber-500"
                                >
                                    PDF olarak indir
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Content>
        </Layout>
    );
}
