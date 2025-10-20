import React, { useState } from "react";
import {
    Layout,
    Typography,
    Button,
    Row,
    Col,
    Card,
    Tag,
    Form,
    Input,
    Select,
    message,
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function BillingSketchPage() {
    const [loading, setLoading] = useState(false);

    const onFinish = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        message.success("Ödeme başarıyla tamamlandı ✨");
        setLoading(false);
    };

    return (
        <Layout className="min-h-screen bg-white">
            <Content className="max-w-4xl mx-auto px-6 pb-20">
                {/* Üst büyük CTA */}
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
                    <Title level={2} className="!m-0 tracking-wide">
                        ABONELİK VE ÖDEME
                    </Title>
                </div>

                {/* Plan Karşılaştırma */}
                <Card className="!rounded-2xl bg-white/90 border border-black/10 mb-12">
                    {/* Aylık / Yıllık butonları */}
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <Button className="!rounded-xl !h-10 !px-6 border border-black/30 bg-gray-100">
                            AYLIK
                        </Button>
                        <div className="relative">
                            <Button className="!rounded-xl !h-10 !px-6 border border-black/30 bg-gray-100">
                                YILLIK
                            </Button>
                            <Tag
                                color="magenta"
                                className="absolute -top-3 -right-4 !rounded-[8px] !py-0.5 !px-2 text-[10px]"
                            >
                                %20 İNDİRİM
                            </Tag>
                        </div>
                    </div>

                    {/* Grid tablo düzeni */}
                    <div className="grid grid-cols-3 gap-4 md:gap-6 items-start max-w-3xl mx-auto">
                        {/* Sol başlık sütunu */}
                        <div className="col-span-1 space-y-4">
                            {["FİYAT", "ÖZELLİK 1", "ÖZELLİK 2", "ÖZELLİK 3"].map((t) => (
                                <div
                                    key={t}
                                    className="px-4 py-2 rounded-xl bg-pink-300/80 text-white text-center font-semibold border border-black/10"
                                >
                                    {t}
                                </div>
                            ))}
                        </div>

                        {/* Aylık sütunu */}
                        <div className="col-span-1 text-center space-y-6">
                            <Text strong className="text-xl">200 TL</Text>
                            <div className="text-2xl"><CheckOutlined className="text-black" /></div>
                            <div className="text-2xl"><CloseOutlined className="text-black" /></div>
                            <div className="text-2xl"><CloseOutlined className="text-black" /></div>

                            <Button
                                type="primary"
                                className="!mt-2 !rounded-xl !bg-amber-400 !border-amber-400 !text-black border border-black/30 hover:!bg-amber-500"
                            >
                                Satın Al
                            </Button>
                        </div>

                        {/* Yıllık sütunu */}
                        <div className="col-span-1 text-center space-y-6">
                            <Text strong className="text-xl">2000 TL</Text>
                            <div className="text-2xl flex justify-center gap-2">
                                <CheckOutlined className="text-black" />
                            </div>
                            <div className="text-2xl"><CheckOutlined className="text-black" /></div>
                            <div className="text-2xl"><CheckOutlined className="text-black" /></div>

                            <Button
                                type="primary"
                                className="!mt-2 !rounded-xl !bg-amber-400 !border-amber-400 !text-black border border-black/30 hover:!bg-amber-500"
                            >
                                Satın Al
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* ÖDEME BİLGİLERİ başlığı */}
                <div className="mb-6">
                    <Title level={3} className="!m-0">ÖDEME BİLGİLERİ</Title>
                </div>

                {/* Ödeme formu */}
                <Card className="!rounded-2xl bg-white/90 border border-black/10">
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
                                    rules={[{ required: true, message: "Zorunlu alan" }]}
                                >
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
                                        { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "AA/YY formatında" },
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
                                        { pattern: /^\d{3,4}$/, message: "3–4 haneli CVC" },
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
                                    rules={[{ required: true, message: "Zorunlu alan" }]}
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

                            <Col xs={24} md={12} className="flex items-end">
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    loading={loading}
                                    className="w-full !rounded-2xl !bg-amber-400 !text-black border border-black/30 hover:!bg-amber-500"
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
