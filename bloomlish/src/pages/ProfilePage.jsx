import React from "react";
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

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const MOCK_USER = {
    name: "Zeynep Cocen",
    level: "B1",
    email: "yarencocen88@gmail.com",
    badges: ["Kelime Ustası", "Quiz Şampiyonu"],
    weeklyGoal: { completed: 3, target: 5 }, // 3/5
    totals: { lessons: 20, tests: 12, points: 8450 },
    aiTip:
        "Zeynep, kelime testlerinde çok iyisin! Dinleme pratiğine biraz daha zaman ayırmalısın.",
    classes: [
        { id: 1, title: "DENİZ METİN English B1 MW dersi", done: true },
        { id: 2, title: "Grammar B1 Atölyesi", done: false },
    ],
};

export default function ProfilePage() {
    const n = useNavigate();
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
                            “Merhaba Zeynep! Bugün harika bir gün, İngilizce pratiğine devam
                            edelim”
                        </Text>
                    </div>
                </div>

                {/* GRID TOP: Rozetler & Hedef Kutusu */}
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
                                    className="[&_.ant-progress-inner]:!rounded-lg"
                                />
                            </div>
                            <Text className="block text-gray-700 mb-3">
                                % {progressPct} tamamlandı
                            </Text>
                            <div className="px-3 py-2 rounded-xl bg-rose-100/80 border border-rose-200 inline-block">
                                <Text className="text-rose-700">
                                    “Haftalık hedef: {MOCK_USER.weeklyGoal.target} ders tamamla (
                                    {MOCK_USER.weeklyGoal.completed}/
                                    {MOCK_USER.weeklyGoal.target})”
                                </Text>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* GRID BOTTOM: İlerleme & Aktivite  |  Derslerim & Testlerim */}
                <Row gutter={[16, 16]}>
                    {/* İlerleme ve Aktivite */}
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
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <Card
                                    size="small"
                                    className="!rounded-xl text-center border-pink-100"
                                >
                                    <Text className="text-gray-500 block">Toplam Ders Sayısı</Text>
                                    <Title level={3} className="!m-0 text-pink-600">
                                        {MOCK_USER.totals.lessons}
                                    </Title>
                                </Card>
                                <Card
                                    size="small"
                                    className="!rounded-xl text-center border-pink-100"
                                >
                                    <Text className="text-gray-500 block">Çözülmüş Testler</Text>
                                    <Title level={3} className="!m-0 text-pink-600">
                                        {MOCK_USER.totals.tests}
                                    </Title>
                                </Card>
                                <Card
                                    size="small"
                                    className="!rounded-xl text-center border-pink-100"
                                >
                                    <Text className="text-gray-500 block">Toplam Puan</Text>
                                    <Title level={3} className="!m-0 text-pink-600">
                                        {MOCK_USER.totals.points.toLocaleString("tr-TR")}
                                    </Title>
                                </Card>
                            </div>

                            <div className="p-3 border border-rose-100 rounded-xl bg-rose-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <BulbOutlined className="text-pink-500" />
                                    <Text strong>Yapay Zeka Tavsiyesi</Text>
                                </div>
                                <Text className="text-gray-700">{MOCK_USER.aiTip}</Text>
                            </div>
                        </Card>
                    </Col>

                    {/* Derslerim & Testlerim (en alt sağ) */}
                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <BookOutlined className="text-pink-500" />
                                    <span>Derslerim & Testlerim</span>
                                </div>
                            }
                            extra={
                                <Tooltip title="Dersler sayfasına git">
                                    <Button
                                        size="small"
                                        className="!rounded-lg"
                                        onClick={() => n("/lessons")}
                                    >
                                        Tümünü Gör
                                    </Button>
                                </Tooltip>
                            }
                            className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur h-full"
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={MOCK_USER.classes}
                                renderItem={(item) => (
                                    <List.Item className="!px-2">
                                        <List.Item.Meta
                                            avatar={
                                                <Badge
                                                    dot
                                                    status={item.done ? "success" : "processing"}
                                                    offset={[0, 6]}
                                                >
                                                    <Avatar
                                                        size={40}
                                                        className="bg-pink-100 text-pink-600"
                                                        icon={<BookOutlined />}
                                                    />
                                                </Badge>
                                            }
                                            title={
                                                <div className="flex items-center gap-2">
                                                    <Text className="text-gray-800">{item.title}</Text>
                                                    {item.done && (
                                                        <CheckCircleTwoTone twoToneColor="#22c55e" />
                                                    )}
                                                </div>
                                            }
                                            description={
                                                <span className="text-gray-500">
                                                    {item.done ? "Tamamlandı" : "Devam ediyor"}
                                                </span>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
