import React from "react";
import { Button, Table, Card, Row, Col, Typography } from "antd";
import { BookOutlined, MessageOutlined, EditOutlined } from "@ant-design/icons";
import Footer from "../components/Footer";


const { Title, Paragraph } = Typography;

export default function BloomlishStartScreen() {
    // Tablo verileri
    const data = [
        { key: 1, tarih: "16.10.2025", ders: "Kelime Geliştirme - A1", hoca: "Ayşe Yılmaz" },
        { key: 2, tarih: "16.10.2025", ders: "Konuşma Pratiği - B1", hoca: "Murat Demir" },
        { key: 3, tarih: "16.10.2025", ders: "Yazma Becerisi - A2", hoca: "Selin Arslan" },
    ];

    const columns = [
        { title: "📅 Tarih", dataIndex: "tarih", key: "tarih", align: "center" },
        { title: "📘 Ders", dataIndex: "ders", key: "ders", align: "center" },
        { title: "👩‍🏫 Hoca", dataIndex: "hoca", key: "hoca", align: "center" },
        {
            title: "🎓 Katıl",
            key: "action",
            align: "center",
            render: () => (
                <Button
                    type="primary"
                    size="middle"
                    className="!bg-gradient-to-r !from-pink-500 !to-fuchsia-500 border-none hover:!opacity-90 rounded-md font-semibold"
                >
                    Katıl
                </Button>
            ),
        },
    ];

    const lessons = [
        {
            title: "Kelime Geliştirme",
            desc: "Günlük kelime pratikleri ve örnek cümlelerle kelime dağarcığını geliştir.",
            icon: <BookOutlined style={{ fontSize: 38, color: "#ec4899" }} />,
            score: "4.8 / 5",
        },
        {
            title: "Konuşma Pratiği",
            desc: "Eğitmenlerle canlı ders veya AI destekli konuşma imkânlarıyla pratiğini artır.",
            icon: <MessageOutlined style={{ fontSize: 38, color: "#ec4899" }} />,
            score: "4.8 / 5",
        },
        {
            title: "Yazma Becerisi",
            desc: "Günlük yazı (Daily Notes) imkânlarıyla yazma yeteneğini geliştir.",
            icon: <EditOutlined style={{ fontSize: 38, color: "#ec4899" }} />,
            score: "4.7 / 5",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 py-10">
            <div className="max-w-6xl mx-auto px-6">



                <Title
                    level={1}
                    className="!text-5xl sm:!text-6xl md:!text-7xl font-extrabold leading-tight"
                >
                    <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 text-transparent bg-clip-text drop-shadow-md">
                        Seviyene Uygun Dersleri Keşfet
                    </span>
                </Title>


                {/* PARAGRAF – span’dan sonra boşluğu garantiye al */}
                <Paragraph className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed text-center">
                    Yapay zeka destekli sistemimizle{" "}
                    <span className="text-pink-500 font-medium">seviyene uygun</span>
                    {" "}
                    dersleri senin için öneriyoruz. İstersen birebir özel ders, istersen grup
                    çalışmalarıyla öğrenmeye devam et 💫
                </Paragraph>



                <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-12 mb-14">
                    <Button
                        size="large"
                        type="primary"
                        className="!bg-gradient-to-r !from-pink-500 !to-fuchsia-500 hover:!opacity-90 px-10 py-6 text-lg font-semibold rounded-2xl shadow-[0_10px_30px_rgba(236,72,153,0.25)] border-none transition-transform hover:scale-105"
                    >
                        🌸 Dersleri Keşfet
                    </Button>

                    <Button
                        size="large"
                        className="border-2 border-pink-400 text-pink-600 hover:!bg-pink-100 hover:!text-pink-700 px-10 py-6 text-lg font-semibold rounded-2xl shadow-sm transition-all hover:shadow-md hover:scale-105"
                    >
                        🔮 Seviye Testi Yap
                    </Button>
                </div>


                <Row gutter={[24, 24]} justify="center" className="mb-20">
                    {lessons.map((item, i) => (
                        <Col key={i} xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                bordered={false}
                                className="text-center rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100"
                                style={{ height: "100%", backgroundColor: "white" }}
                                bodyStyle={{ padding: "2rem 1.5rem" }}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    {item.icon}
                                    <h3 className="font-semibold text-gray-800 text-xl mt-3 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-snug mb-3">
                                        {item.desc}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        ⏱ Ortalama süre: 30 dk
                                    </p>
                                    <p className="text-gray-500 text-sm">⭐ Puan: {item.score}</p>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>


                <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100">
                    <Title
                        level={3}
                        className="text-center mb-6 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 text-transparent bg-clip-text"
                    >
                        Bugün Katılabileceğin Dersler
                    </Title>

                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        bordered
                        className="rounded-xl overflow-hidden shadow-sm"
                        rowClassName="hover:bg-pink-50 transition-colors"
                    />
                </div>


                <footer className="mt-16 text-center text-gray-400 text-sm">
                    © 2025 <span className="text-pink-500 font-semibold">Bloomlish</span> 🌸 | İngilizceyi eğlenceli hale getir!
                </footer>
            </div>
        </div>
    );
}