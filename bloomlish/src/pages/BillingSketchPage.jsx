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

    // miniFeatures ve discount 
    const monthly = {
        key: "monthly",
        label: "Aylık",
        price: "200 TL",
        features: [true, false, false],
        miniFeatures: ["Hızlı başlangıç", "İstediğinde iptal"],
        discount: null, // aylıkta indirim yok
    };

    const yearly = {
        key: "yearly",
        label: "Yıllık",
        price: "2000 TL",
        features: [true, true, true],
        miniFeatures: ["Tüm özellikler açık", "Öncelikli destek"],
        discount: 17, // örnek: %17 indirim (~2400 → 2000)
    };

    const plansMap = { monthly, yearly };

    const Icon = ({ ok }) => (ok ? <CheckOutlined className="text-2xl" /> : <CloseOutlined className="text-2xl" />);

    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plansTopRef = useRef(null);

    const onFinish = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        message.success("Ödeme başarıyla tamamlandı ✨");
        setLoading(false);
    };

    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const handleSelect = (planKey) => { setSelectedPlan(planKey); scrollTo("payment-section"); };
    const handleChangePlan = () => { setSelectedPlan(null); plansTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

    const PlanCard = ({ plan }) => {
        const isSelected = selectedPlan === plan.key;
        const isOtherLocked = selectedPlan && !isSelected;

        return (
            <div className="col-span-1">
                {/* Başlık */}
                <div className="text-center mb-3">
                    <Text className="text-pink-600 font-semibold text-lg tracking-wide">
                        {plan.label.toUpperCase()}
                    </Text>
                </div>

                <div
                    className={[
                        "relative flex flex-col items-center text-center rounded-xl border p-4 min-h-[280px] shadow-sm transition",
                        isSelected
                            ? // SEÇİLİ: gradient + pembe vurgu
                            "bg-gradient-to-br from-pink-50 via-fuchsia-50 to-violet-50 border-pink-300 ring-2 ring-pink-400"
                            : // NORMAL
                            "bg-white/70 border-black/10",
                        isOtherLocked ? "opacity-50 pointer-events-none" : "opacity-100",
                    ].join(" ")}
                >
                    {/* İndirim Rozeti  */}
                    {plan.discount ? (
                        <Tag
                            color="pink"
                            className="!absolute -top-3 -right-3 !rounded-xl !px-3 !py-1 !text-xs shadow"

                        >
                            %{plan.discount} indirim
                        </Tag>
                    ) : null}

                    {/* “Seçildi” Rozeti */}
                    {isSelected && !plan.discount && (
                        <Tag
                            color="pink"
                            className="!absolute -top-3 -right-3 !rounded-xl !px-3 !py-1 !text-xs shadow"
                            icon={<CheckOutlined />}
                        >
                            Seçildi
                        </Tag>
                    )}

                    {/* FİYAT */}
                    <Text strong className="text-xl">{plan.price}</Text>

                    {/* Büyük ikonlu özellik sütunu */}
                    <div className="mt-9 flex flex-col gap-6">
                        {plan.features.map((ok, i) => (
                            <div key={i} className="flex justify-center">
                                <Icon ok={ok} />
                            </div>
                        ))}
                    </div>

                    {/* Küçük özellik listesi (yalnızca seçiliyken) */}
                    {isSelected && plan.miniFeatures?.length > 0 && (
                        <ul className="mt-6 w-full text-left text-[13px] leading-5 text-gray-700">
                            {plan.miniFeatures.map((m, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500 inline-block" />
                                    <span>{m}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Buton */}
                    <Button
                        type="primary"
                        disabled={!!selectedPlan && !isSelected}
                        onClick={() => handleSelect(plan.key)}
                        className={[
                            "mt-auto translate-y-2 !rounded-xl !bg-amber-400 !border-amber-400 !text-black border border-black/30 hover:!bg-amber-500",
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
        <Layout className="min-h-screen bg-white">
            <Content className="max-w-4xl mx-auto px-6 pb-20">
                <div className="pt-6 mb-10 flex justify-center">
                    <Button
                        size="large"
                        className="!h-14 !px-8 !rounded-2xl !bg-amber-400 !text-black border border-black/30 shadow-sm hover:!bg-amber-500"
                    >
                        3 GÜNLÜK ÜCRETSİZ KULLAN!
                    </Button>
                </div>

                {/* Başlık */}
                <div className="text-center mb-6">
                    <Title level={2} className="!m-0 tracking-wide">ABONELİK VE ÖDEME</Title>
                </div>

                <Card className="!rounded-2xl bg-white/90 border border-black/10 mb-6" ref={plansTopRef} id="plans-top">
                    <div className="grid grid-cols-3 gap-4 md:gap-6 items-start max-w-3xl mx-auto">
                        {/* Sol başlık sütunu */}
                        <div className="col-span-1 space-y-4 mt-10">
                            {rows.map((t) => (
                                <div
                                    key={t}
                                    className="px-4 py-2 rounded-xl bg-pink-300/80 text-white text-center font-semibold border border-black/10"
                                >
                                    {t}
                                </div>
                            ))}
                        </div>

                        {/* Aylık & Yıllık Kartları */}
                        <PlanCard plan={monthly} />
                        <PlanCard plan={yearly} />
                    </div>
                </Card>

                {/* Seçilen plan özeti */}
                {selectedPlan && (
                    <div className="max-w-3xl mx-auto mb-10">
                        <Card className="!rounded-2xl bg-pink-50 border border-pink-200">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div>
                                    <Title level={4} className="!m-0">Seçilen Plan</Title>
                                    <div className="mt-1 text-gray-700">
                                        <span className="font-semibold">{plansMap[selectedPlan].label}</span> — {plansMap[selectedPlan].price}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleChangePlan} className="!rounded-xl border border-black/20">
                                        Değiştir
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={() => scrollTo("payment-section")}
                                        className="!rounded-xl !bg-amber-400 !text-black border border-black/30 hover:!bg-amber-500"
                                    >
                                        Ödemeye Geç
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                <div className="mb-6" id="payment-section">
                    <Title level={3} className="!m-0">ÖDEME BİLGİLERİ</Title>
                </div>

                {/* Ödeme formu */}
                <Card className="!rounded-2xl bg-white/90 border border-black/10">
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        initialValues={{ holder: "", number: "", expiry: "", cvc: "", address: "" }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Kart üzerindeki isim" name="holder" rules={[{ required: true, message: "Zorunlu alan" }]}>
                                    <Input size="large" className="!rounded-xl border border-black/30" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Kart Numarası"
                                    name="number"
                                    rules={[
                                        { required: true, message: "Zorunlu alan" },
                                        { pattern: /^\d{16}$/, message: "16 haneli kart numarası" },
                                    ]}
                                >
                                    <Input size="large" inputMode="numeric" maxLength={16} className="!rounded-xl border border-black/30" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Son Kullanma Tarihi"
                                    name="expiry"
                                    rules={[
                                        { required: true, message: "Zorunlu alan" },
                                        { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "AA/YY formatında" },
                                    ]}
                                >
                                    <Input placeholder="AA/YY" size="large" className="!rounded-xl border border-black/30" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="CVC"
                                    name="cvc"
                                    rules={[
                                        { required: true, message: "Zorunlu alan" },
                                        { pattern: /^\d{3,4}$/, message: "3–4 haneli CVC" },
                                    ]}
                                >
                                    <Input size="large" inputMode="numeric" maxLength={4} className="!rounded-xl border border-black/30" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Fatura Adresi Seç" name="address" rules={[{ required: true, message: "Zorunlu alan" }]}>
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

                            <Col xs={24} md={12} className="flex md:items-end items-start mt-7">
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    loading={loading}
                                    className="w-full !rounded-2xl !bg-amber-400 !text-black border border-black/30 hover:!bg-amber-500 mt-3"
                                >
                                    ÖDEMEYİ TAMAMLA
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
}
