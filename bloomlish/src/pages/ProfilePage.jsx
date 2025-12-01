import React, { useEffect, useState } from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Avatar,
    Button,
    Tag,
    Progress,
    List,
    Badge,
    Tooltip,
} from "antd";
import {
    UserOutlined,
    EditOutlined,
    CreditCardOutlined,
    LogoutOutlined,
    SmileOutlined,
    TrophyOutlined,
    BulbOutlined,
    CheckCircleTwoTone,
    BookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;
const { Title, Text } = Typography;

const MOCK_USER = {
    name: "Zeynep Cocen",
    level: "B1",
    email: "yarencocen88@gmail.com",
    badges: ["Kelime Ustası", "Quiz Şampiyonu"],
    weeklyGoal: { completed: 3, target: 5 },
    totals: { lessons: 20, tests: 12, points: 8450 },
    aiTip:
        "Zeynep, kelime testlerinde çok iyisin! Dinleme pratiğine biraz daha zaman ayırmalısın.",
};

export default function ProfilePage() {
    const n = useNavigate();


    const [myLessons, setMyLessons] = useState([]);

   
    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get("http://localhost:8080/api/payments/my-lessons", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log("Dersler → ", res.data);
                setMyLessons(res.data);
            })
            .catch((err) => {
                console.error("Dersler çekilemedi:", err);
            });
    }, []);

    const progressPct =
        Math.round(
            (MOCK_USER.weeklyGoal.completed / MOCK_USER.weeklyGoal.target) * 100
        ) || 0;

    return (
        <Layout className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white">
            <Content className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                        <Avatar
                            size={72}
                            icon={<UserOutlined />}
                            className="bg-pink-100 text-pink-600"
                        />
                        <div>
                            <Title level={2} className="!m-0 !leading-tight text-pink-700">
                                {MOCK_USER.name}
                            </Title>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Tag color="magenta" className="!rounded-full !px-3 !py-1">
                                    SEVİYE: {MOCK_USER.level}
                                </Tag>
                                <Text className="text-gray-600">{MOCK_USER.email}</Text>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            icon={<EditOutlined />}
                            className="!rounded-xl"
                            onClick={() => n("/profile/edit")}
                        >
                            Profili Düzenle
                        </Button>
                        <Button
                            icon={<CreditCardOutlined />}
                            className="!rounded-xl"
                            onClick={() => n("/billing")}
                        >
                            Ödeme Bilgileri
                        </Button>
                        <Button
                            danger
                            icon={<LogoutOutlined />}
                            className="!rounded-xl"
                            onClick={() => n("/logout")}
                        >
                            Çıkış
                        </Button>
                    </div>
                </div>

                {/* GREETING */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-2xl">🫶</span>
                        <Text className="text-pink-600 font-semibold text-lg">
                            “Merhaba Zeynep! Bugün harika bir gün, İngilizce pratiğine devam edelim”
                        </Text>
                    </div>
                </div>

                {/* GRID TOP */}
                <Row gutter={[16, 16]} className="mb-2">
                    {/* Rozetler */}
                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🏅</span>
                                    <span>Rozetler</span>
                                </div>
                            }
                            className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur"
                        >
                            <div className="space-y-3">
                                {MOCK_USER.badges.map((b, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        {i === 0 ? (
                                            <TrophyOutlined className="text-pink-500" />
                                        ) : (
                                            <SmileOutlined className="text-pink-500" />
                                        )}
                                        <Text className="text-gray-700">{b}</Text>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Col>

                    {/* Hedef kutusu */}
                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <span>🎯</span>
                                    <span>Hedef kutusu</span>
                                </div>
                            }
                            className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur"
                        >
                            <div className="mb-2">
                                <Progress
                                    percent={progressPct}
                                    strokeColor={{
                                        from: "#ec4899",
                                        to: "#a21caf",
                                    }}
                                    status="active"
                                />
                            </div>
                            <Text className="block text-gray-700 mb-3">
                                % {progressPct} tamamlandı
                            </Text>
                        </Card>
                    </Col>
                </Row>

                {/* GRID BOTTOM */}
                <Row gutter={[16, 16]}>
                    {/* İlerleme & Aktivite */}
                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <BulbOutlined className="text-pink-500" />
                                    <span>İlerleme ve Aktivite</span>
                                </div>
                            }
                            className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur h-full"
                        >
                            <div className="p-3 border border-rose-100 rounded-xl bg-rose-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <BulbOutlined className="text-pink-500" />
                                    <Text strong>Yapay Zeka Tavsiyesi</Text>
                                </div>
                                <Text className="text-gray-700">{MOCK_USER.aiTip}</Text>
                            </div>
                        </Card>
                    </Col>

                    {/* Derslerim & Testlerim */}
                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <BookOutlined className="text-pink-500" />
                                    <span>Derslerim</span>
                                </div>
                            }
                            className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur h-full"
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={myLessons}
                                renderItem={(lesson) => (
                                    <List.Item className="!px-2">
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    size={40}
                                                    className="bg-pink-100 text-pink-600"
                                                    icon={<BookOutlined />}
                                                />
                                            }
                                            title={
                                                <Text className="text-gray-800">
                                                    {lesson.name}
                                                </Text>
                                            }
                                            description={
                                                <span className="text-gray-500">
                                                    {lesson.description}
                                                </span>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />

                            {myLessons.length === 0 && (
                                <Text className="text-gray-500">Henüz dersiniz yok.</Text>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
