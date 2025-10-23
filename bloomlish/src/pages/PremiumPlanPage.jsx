import React, { useEffect, useMemo, useState, useRef } from "react";
import {
    Layout,
    Typography,
    Card,
    Table,
    Button,
    Tag,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;


const formatTR = (d) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

const calcExpiry = (planKey) => {
    const now = new Date();
    const d = new Date(now);
    if (planKey === "yearly") d.setFullYear(d.getFullYear() + 1);
    else d.setMonth(d.getMonth() + 1);
    return formatTR(d);
};

/**
 * Seçilen planı localStorage’dan çekiyoruz.
 * (BillingSketchPage’de seçerken kaydet: localStorage.setItem("selectedPlan", JSON.stringify(planObj)))
 * planObj örneği:
 * { key:"monthly", label:"Aylık", price:"200 TL", features:[true,false,false] }
 */
const useSelectedPlan = () => {
    const [plan, setPlan] = useState(null);
    useEffect(() => {
        try {
            const raw = localStorage.getItem("selectedPlan");
            if (raw) setPlan(JSON.parse(raw));
        } catch { }
    }, []);
    return plan;
};

export default function PremiumPlanPage() {
    const selectedPlan = useSelectedPlan();

    // Yedek (seçilmemişse kabaca aylık göster)
    const plan = useMemo(
        () =>
            selectedPlan || {
                key: "monthly",
                label: "Aylık",
                price: "200 TL",
                features: [true, true, true],
            },
        [selectedPlan]
    );

    const expiry = useMemo(() => calcExpiry(plan?.key), [plan?.key]);

    // Fatura geçmişi (örnek)
    const dataSource = [
        { key: "1", date: "10/03/2025", plan: "Aylık", amount: "200 TL", status: "Ödendi" },
        { key: "2", date: "10/02/2025", plan: "Aylık", amount: "200 TL", status: "Ödendi" },
        { key: "3", date: "10/01/2025", plan: "Aylık", amount: "200 TL", status: "Ödendi" },
    ];
    const columns = [
        { title: "TARİH", dataIndex: "date", key: "date" },
        { title: "PLAN", dataIndex: "plan", key: "plan" },
        { title: "TUTAR", dataIndex: "amount", key: "amount" },
        { title: "DURUM", dataIndex: "status", key: "status" },
    ];

    const printableRef = useRef(null);
    const handleDownloadPDF = () => {
        // Hızlı çözüm: yazdır/PDF’e kaydet
        window.print();
    };

    return (
        <Layout className="min-h-screen bg-white">
            <Content className="max-w-4xl mx-auto px-6 py-10">
                {/* Üst başlık */}
                <div className="text-center mb-6">
                    <Title level={2} className="!m-0 tracking-wide">
                        PREMIUM
                    </Title>
                </div>

                {/* PLAN ÖZETİ */}
                <Card className="!rounded-2xl bg-white/90 border border-black/20">
                    <div
                        className="
              rounded-xl border border-black/20 bg-neutral-200/80
              p-6 md:p-8 relative
            "
                    >
                        <div className="flex items-center justify-between mb-6">
                            <Title level={4} className="!m-0">
                                {plan?.label?.toUpperCase()} PLAN
                            </Title>

                            {/* (opsiyonel) indirim etiketi örneği */}
                            {plan?.discount ? (
                                <Tag color="pink" className="!rounded-xl !px-3 !py-1 !text-xs">
                                    %{plan.discount} indirim
                                </Tag>
                            ) : null}
                        </div>

                        {/* Özellikler (sol blok) */}
                        <div className="grid gap-4">
                            {["ÖZELLİK 1", "ÖZELLİK 2", "ÖZELLİK 3"].map((f, i) => (
                                <div key={f} className="flex items-center gap-3 text-lg">
                                    <CheckOutlined />
                                    <span className="tracking-wide">{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* Sağ altta geçerlilik tarihi */}
                        <div className="mt-10 text-right text-gray-500">
                            <span>Son geçerlilik tarihi {expiry}</span>
                        </div>
                    </div>
                </Card>

                {/* Fatura Geçmişi */}
                <div className="mt-12">
                    <Title level={3} className="!m-0 mb-4">
                        FATURA GEÇMİŞİ
                    </Title>

                    {/* Yazdırılabilir alan */}
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
            </Content>
        </Layout>
    );
}
