import React, { useState, useRef } from "react";
import axios from "axios";
import {
    Layout,
    Typography,
    Button,
    Card,
    Tag,
    message,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function BillingSketchPage() {
    const rows = ["FİYAT", "ÖZELLİK 1", "ÖZELLİK 2", "ÖZELLİK 3"];

    const monthly = {
        key: "monthly",
        label: "Aylık",
        price: "200 TL",
        features: [true, false, false],
        miniFeatures: ["Hızlı başlangıç", "İstediğinde iptal"],
        discount: null,
    };

    const yearly = {
        key: "yearly",
        label: "Yıllık",
        price: "2000 TL",
        features: [true, true, true],
        miniFeatures: ["Tüm özellikler açık", "Öncelikli destek"],
        discount: 17,
    };

    const plansMap = { monthly, yearly };

    const Icon = ({ ok }) =>
        ok ? <CheckOutlined className="text-2xl" /> : <CloseOutlined className="text-2xl" />;

    const [selectedPlan, setSelectedPlan] = useState(null); // "monthly" | "yearly"
    const [loading, setLoading] = useState(false);

    const plansTopRef = useRef(null);

    const smoothScrollToRef = (refEl) => {
        refEl?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleSelect = (planKey) => {
        setSelectedPlan(planKey); // "monthly" / "yearly"
    };

    const handleChangePlan = () => {
        setSelectedPlan(null);
        smoothScrollToRef(plansTopRef.current);
    };

    // 🔴 ARTIK BURADA KART BİLGİSİ YOK
    // Sadece planType'ı backend'e gönderiyoruz, gelen paymentUrl'e redirect ediyoruz.
    const handleGoToPayment = async () => {
        if (!selectedPlan) {
            message.error("Lütfen önce bir plan seç.");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Önce giriş yapmanız gerekiyor.");
                setLoading(false);
                return;
            }

            const body = {
                planType: selectedPlan, // "monthly" veya "yearly"
            };

            const res = await axios.post(
                "http://localhost:8080/api/billing/start-checkout",
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Billing start-checkout response:", res.data);

            const paymentUrl = res.data.paymentUrl;
            if (!paymentUrl) {
                message.error("Ödeme linki alınamadı.");
                return;
            }

            // Iyzipay ödeme sayfasına yönlendir
            window.location.href = paymentUrl;

        } catch (err) {
            console.error(err);
            message.error("Ödeme başlatılırken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const PlanCard = ({ plan }) => {
        const isSelected = selectedPlan === plan.key;
        const isOtherLocked = selectedPlan && !isSelected;

        return (
            <div className="col-span-1">
                {/* Plan başlığı */}
                <div className="text-center mb-3">
                    <Text className="text-pink-600 font-semibold text-lg tracking-wide">
                        {plan.label.toUpperCase()}
                    </Text>
                </div>

                <div
                    className={[
                        "relative flex flex-col items-center text-center rounded-xl border p-6 min-h-[320px] shadow-sm transition",
                        isSelected
                            ? "bg-gradient-to-br from-pink-50 via-fuchsia-50 to-violet-50 border-pink-400 ring-2 ring-pink-400"
                            : "bg-white border-black/10",
                        isOtherLocked ? "opacity-50 pointer-events-none" : "opacity-100",
                    ].join(" ")}
                >
                    {/* indirim rozeti */}
                    {plan.discount ? (
                        <Tag
                            color="pink"
                            className="!absolute -top-3 -right-3 !rounded-xl !px-3 !py-1 !text-xs shadow"
                        >
                            %{plan.discount} indirim
                        </Tag>
                    ) : null}

                    {/* seçildi rozeti */}
                    {isSelected && !plan.discount && (
                        <Tag
                            color="pink"
                            className="!absolute -top-3 -right-3 !rounded-xl !px-3 !py-1 !text-xs shadow"
                            icon={<CheckOutlined />}
                        >
                            Seçildi
                        </Tag>
                    )}

                    {/* fiyat */}
                    <Text strong className="text-xl">
                        {plan.price}
                    </Text>

                    {/* tik / çarpı sütunu */}
                    <div className="mt-9 flex flex-col gap-6 text-xl">
                        {plan.features.map((ok, i) => (
                            <div key={i} className="flex justify-center">
                                <Icon ok={ok} />
                            </div>
                        ))}
                    </div>

                    {/* mini feature listesi */}
                    {isSelected && plan.miniFeatures?.length > 0 && (
                        <ul className="mt-6 w-full text-left text-[14px] leading-5 text-gray-800">
                            {plan.miniFeatures.map((m, i) => (
                                <li key={i} className="flex items-start gap-2 text-[14px]">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500 inline-block" />
                                    <span>{m}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* CTA */}
                    <Button
                        type="primary"
                        disabled={!!selectedPlan && !isSelected}
                        onClick={() => handleSelect(plan.key)}
                        className={[
                            "mt-auto translate-y-4 !rounded-xl !bg-amber-400 !border-amber-400 !text-black border border-black/30 hover:!bg-amber-500 font-medium",
                            isSelected ? "!bg-amber-500" : "",
                        ].join(" ")}
                    >
                        {isSelected ? "Seçildi" : "Satın Al"}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Layout className="min-h-screen bg-pink-50">
            <Content className="max-w-6xl mx-auto px-10 pb-24">
                {/* üst CTA */}
                <div className="pt-10 mb-10 flex justify-center">
                    <Button
                        size="large"
                        className="!h-14 !px-8 !rounded-2xl !bg-amber-400 !text-black border border-black/30 shadow-sm hover:!bg-amber-500 font-medium"
                    >
                        3 GÜNLÜK ÜCRETSİZ KULLAN!
                    </Button>
                </div>

                {/* başlık */}
                <div className="text-center mb-8">
                    <Title level={2} className="!m-0 tracking-wide !text-gray-900 text-[28px]">
                        ABONELİK VE ÖDEME
                    </Title>
                </div>

                {/* PLAN TABLOSU */}
                <Card
                    className="!rounded-2xl bg-white shadow-lg border border-black/10 mb-8 max-w-5xl mx-auto"
                    ref={plansTopRef}
                    id="plans-top"
                >
                    <div className="grid grid-cols-[220px_1fr_1fr] gap-6 items-start">
                        {/* sol taraf feature etiketleri */}
                        <div className="space-y-4 mt-10">
                            {rows.map((t) => (
                                <div
                                    key={t}
                                    className="px-4 py-2 rounded-xl bg-pink-300/80 text-white text-center font-semibold border border-black/10 text-[15px]"
                                >
                                    {t}
                                </div>
                            ))}
                        </div>

                        {/* aylık ve yıllık kartları */}
                        <PlanCard plan={monthly} />
                        <PlanCard plan={yearly} />
                    </div>
                </Card>

                {/* SEÇİLEN PLAN ALANI */}
                {selectedPlan && (
                    <div className="max-w-5xl mx-auto mb-10">
                        <Card className="!rounded-2xl bg-white shadow border border-black/10">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div>
                                    <Title level={4} className="!m-0 !text-gray-900">
                                        Seçilen Plan
                                    </Title>
                                    <div className="mt-1 text-gray-700 text-[15px] leading-snug">
                                        <span className="font-semibold">
                                            {plansMap[selectedPlan].label}
                                        </span>{" "}
                                        — {plansMap[selectedPlan].price}
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-wrap">
                                    <Button
                                        onClick={handleChangePlan}
                                        className="!rounded-xl border border-black/30 hover:!border-black/60 hover:!text-black"
                                    >
                                        Değiştir
                                    </Button>
                                    <Button
                                        type="primary"
                                        loading={loading}
                                        onClick={handleGoToPayment}
                                        className="!rounded-xl !bg-amber-400 !text-black border border-black/30 hover:!bg-amber-500 font-medium"
                                    >
                                        Ödemeye Geç
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </Content>
        </Layout>
    );
}
