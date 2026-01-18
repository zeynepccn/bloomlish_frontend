import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { BookOutlined, MessageOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function BloomlishStartScreen() {
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
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100">
            <div className="max-w-6xl mx-auto px-6 py-14">
                {/* Header */}
                <div className="text-center mb-12">
                    <Title
                        level={1}
                        className="!mb-4 !text-4xl sm:!text-5xl md:!text-6xl font-extrabold leading-tight"
                    >
                        <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 text-transparent bg-clip-text drop-shadow-sm">
                            Seviyene Uygun Dersleri Keşfet
                        </span>
                    </Title>

                    <Paragraph className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Yapay zeka destekli sistemimizle{" "}
                        <span className="text-pink-500 font-medium">seviyene uygun</span>{" "}
                        dersleri senin için öneriyoruz. İstersen birebir özel ders, istersen grup
                        çalışmalarıyla öğrenmeye devam et 
                    </Paragraph>
                </div>

                {/* Cards */}
                <Row gutter={[20, 20]} justify="center" className="mb-14">
                    {lessons.map((item, i) => (
                        <Col key={i} xs={24} sm={12} md={8}>
                            <Card
                                hoverable
                                bordered={false}
                                className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100"
                                style={{ height: "100%", backgroundColor: "white" }}
                                bodyStyle={{ padding: "1.75rem 1.5rem", height: "100%" }}
                            >
                                <div className="flex flex-col items-center text-center h-full">
                                    <div className="mb-2">{item.icon}</div>

                                    <h3 className="font-semibold text-gray-800 text-xl mt-2 mb-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm leading-snug mb-4">
                                        {item.desc}
                                    </p>

                                    <div className="mt-auto text-gray-500 text-sm space-y-1">
                                        <p> Ortalama süre: 30 dk</p>
                                        <p> Puan: {item.score}</p>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Footer */}
                <footer className="text-center text-gray-400 text-sm">
                    © 2025 <span className="text-pink-500 font-semibold">Bloomlish</span> 🌸 | İngilizceyi eğlenceli hale getir!
                </footer>
            </div>
        </div>
    );
}
