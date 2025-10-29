import React, { useState, useRef } from "react";
import {
    Layout,
    Typography,
    Button,
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    message,
    Tag,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

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

    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // ödeme formu görünür mü
    const [showPayment, setShowPayment] = useState(false);

    const plansTopRef = useRef(null);
    const paymentRef = useRef(null); // scroll hedefi

    const onFinish = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        message.success("Ödeme başarıyla tamamlandı ✨");
        setLoading(false);
    };


    const smoothScrollToRef = (refEl) => {
        refEl?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleSelect = (planKey) => {
        // sadece planı seçiyoruz, ödeme formunu açmıyorum
        setSelectedPlan(planKey);

    };

    const handleChangePlan = () => {
        setSelectedPlan(null);
        setShowPayment(false); // plan değiştirince ödeme formunu da tekrar gizle
        smoothScrollToRef(plansTopRef.current);
    };

    const handleGoToPayment = () => {
        // şimdi ödeme formunu açıyorum
        setShowPayment(true);

        // ödeme formu DOM’a girdikten hemen sonra oraya kaydır
        setTimeout(() => {
            smoothScrollToRef(paymentRef.current);
        }, 50);
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
                        isOtherLocked
                            ? "opacity-50 pointer-events-none"
                            : "opacity-100",
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
                                <li
                                    key={i}
                                    className="flex items-start gap-2 text-[14px]"
                                >
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
                    <Title
                        level={2}
                        className="!m-0 tracking-wide !text-gray-900 text-[28px]"
                    >
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
                                        onClick={handleGoToPayment} // 🔥 artık buraya bağlı
                                        className="!rounded-xl !bg-amber-400 !text-black border border-black/30 hover:!bg-amber-500 font-medium"
                                    >
                                        Ödemeye Geç
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* ÖDEME BAŞLIĞI + FORMU sadece showPayment true iken */}
                {showPayment && (
                    <>
                        <div
                            className="mb-6 max-w-5xl mx-auto"
                            id="payment-section"
                            ref={paymentRef} // 🔥 scroll hedefi
                        >
                            <Title
                                level={3}
                                className="!m-0 !text-gray-900 text-[22px]"
                            >
                                ÖDEME BİLGİLERİ
                            </Title>
                        </div>

                        <Card className="!rounded-2xl bg-white shadow-lg border border-black/10 max-w-5xl mx-auto p-8">
                            <Form
                                layout="vertical"
                                onFinish={onFinish}
                                requiredMark={false}
                                initialValues={{
                                    holder: "",
                                    number: "",
                                    expiry: "",
                                    cvc: "",
                                    address: "",
                                }}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Kart üzerindeki isim"
                                            name="holder"
                                            rules={[
                                                { required: true, message: "Zorunlu alan" },
                                            ]}
                                        >
                                            <Input
                                                size="large"
                                                className="!rounded-xl border border-black/30"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Kart Numarası"
                                            name="number"
                                            rules={[
                                                { required: true, message: "Zorunlu alan" },
                                                {
                                                    pattern: /^\d{16}$/,
                                                    message: "16 haneli kart numarası",
                                                },
                                            ]}
                                        >
                                            <Input
                                                size="large"
                                                inputMode="numeric"
                                                maxLength={16}
                                                className="!rounded-xl border border-black/30"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Son Kullanma Tarihi"
                                            name="expiry"
                                            rules={[
                                                { required: true, message: "Zorunlu alan" },
                                                {
                                                    pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
                                                    message: "AA/YY formatında",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="AA/YY"
                                                size="large"
                                                className="!rounded-xl border border-black/30"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="CVC"
                                            name="cvc"
                                            rules={[
                                                { required: true, message: "Zorunlu alan" },
                                                {
                                                    pattern: /^\d{3,4}$/,
                                                    message: "3–4 haneli CVC",
                                                },
                                            ]}
                                        >
                                            <Input
                                                size="large"
                                                inputMode="numeric"
                                                maxLength={4}
                                                className="!rounded-xl border border-black/30"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            label="Fatura Adresi Seç"
                                            name="address"
                                            rules={[
                                                { required: true, message: "Zorunlu alan" },
                                            ]}
                                        >
                                            <Select
                                                size="large"
                                                className="!rounded-xl [&_.ant-select-selector]:!rounded-xl border border-black/30"
                                                placeholder="Bir adres seçin"
                                            >
                                                <Option value="home">Ev Adresi</Option>
                                                <Option value="work">İş Adresi</Option>
                                                <Option value="new">Yeni Adres Ekle…</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col
                                        xs={24}
                                        md={12}
                                        className="flex md:items-end items-start mt-7"
                                    >
                                        <Button
                                            htmlType="submit"
                                            size="large"
                                            loading={loading}
                                            className="w-full !rounded-2xl !bg-amber-400 !text-black border border-black/30 hover:!bg-amber-500 mt-3 font-medium"
                                        >
                                            ÖDEMEYİ TAMAMLA
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </>
                )}
            </Content>
        </Layout>
    );
}
