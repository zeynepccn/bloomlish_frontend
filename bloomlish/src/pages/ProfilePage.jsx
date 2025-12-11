import React, { useEffect, useState } from "react";
import { Modal } from "antd";

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
    const [openLessonModal, setOpenLessonModal] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");

   
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
    
    const getLessonStatus = (lesson) => {
    const now = new Date();
    const start = new Date(lesson.date + " " + lesson.startTime);
    const end = new Date(lesson.date + " " + lesson.endTime);

    if (now > end) return { status: "Tamamlandı", color: "default", disabled: true };
    if (now > start && now < end) return { status: "Ders Devam Ediyor", color: "green", disabled: false };
    return { status: "Yaklaşan Ders", color: "magenta", disabled: false };
};

// --- Sıralama fonksiyonu (Tamamlananlar en altta) ---
const sortLessons = (lessons) => {
    return [...lessons].sort((a, b) => {
        const now = new Date();
        const startA = new Date(a.date + " " + a.startTime);
        const endA = new Date(a.date + " " + a.endTime);
        const startB = new Date(b.date + " " + b.startTime);
        const endB = new Date(b.date + " " + b.endTime);

        const doneA = now > endA;
        const doneB = now > endB;

        if (doneA && !doneB) return 1;
        if (!doneA && doneB) return -1;

        return startA - startB;
    });
};



    const calculateTimeLeft = (lesson) => {
        const now = new Date();
        const start = new Date(lesson.date + " " + lesson.startTime);

        let diff = start - now;
        if (diff <= 0) return "Ders başlamak üzere!";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);

        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * (1000 * 60);

        const seconds = Math.floor(diff / 1000);

        return `${days} gün ${hours} saat ${minutes} dk ${seconds} sn`;
    };

    // --- Kart tıklama fonksiyonu ---
    const handleLessonClick = async (lesson) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await axios.get(
                `http://localhost:8080/api/lessons/join-check/${lesson.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const result = res.data;

            if (result === "OK") {
                // Ders başladı → direkt video sayfasına git
                n(`/lesson/${lesson.id}`);
                return;
            }

            if (result === "NOT_ENROLLED") {
                Modal.info({
                    title: "Derse Kayıtlı Değilsiniz",
                    content: "Bu derse katılmak için önce satın almanız gerekiyor.",
                });
                return;
            }

            if (result === "FINISHED") {
                Modal.warning({
                    title: "Ders Sona Erdi",
                    content: "Bu dersin süresi dolmuş.",
                });
                return;
            }

            // Yaklaşan ders → mevcut modal’ını açıyoruz
            if (result === "NOT_STARTED" || result === "WRONG_DAY") {
                setSelectedLesson(lesson);
                setOpenLessonModal(true);

                // geri sayım başlat
                const interval = setInterval(() => {
                    setTimeLeft(calculateTimeLeft(lesson));
                }, 1000);

                window.currentCountdown = interval;
                return;
            }

        } catch (err) {
            console.error("join-check error:", err);
            Modal.error({
                title: "Bir Hata Oluştu",
                content: "Derse giriş kontrolü yapılamadı.",
            });
        }
    };



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
                                pagination={{
                                    pageSize: 4,
                                    align: "center",
                                }}
                                dataSource={sortLessons(myLessons)}
                                renderItem={(lesson) => {
                                    const { status, color, disabled } = getLessonStatus(lesson);

                                    return (
                                        <List.Item
                                            className={`border border-gray-200 p-3 rounded-xl flex items-center justify-between hover:bg-rose-50 transition ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                                }`}
                                            onClick={() => handleLessonClick(lesson)}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        size={42}
                                                        className="bg-pink-100 text-pink-600"
                                                        icon={<BookOutlined />}
                                                    />
                                                }
                                                title={
                                                    <div className="font-medium text-gray-800">{lesson.name}</div>
                                                }
                                                description={
                                                    <div className="text-gray-500 text-xs">
                                                        {lesson.description}
                                                        <br />
                                                        <span className="text-gray-400">
                                                            {lesson.date} • {lesson.startTime} – {lesson.endTime}
                                                        </span>
                                                    </div>
                                                }
                                            />

                                            <Tag color={color} className="!rounded-full px-3 py-1 text-xs">
                                                {status}
                                            </Tag>
                                        </List.Item>
                                    );
                                }}
                            />
                            {selectedLesson && (
                                <Modal
                                    open={openLessonModal}
                                    onCancel={() => {
                                        setOpenLessonModal(false);
                                        clearInterval(window.currentCountdown);
                                    }}
                                    footer={null}
                                    centered
                                    className="rounded-2xl"
                                >
                                    <div className="text-center p-4">

                                        <h2 className="text-lg font-semibold text-pink-600 mb-2">
                                            Derse Daha Var 🕒
                                        </h2>

                                        <p className="text-gray-700">
                                            <strong>{selectedLesson.name}</strong> dersi henüz başlamadı.
                                        </p>

                                        <p className="text-gray-500 mt-2">
                                            <strong>Tarih:</strong> {selectedLesson.date}
                                            <br />
                                            <strong>Saat:</strong> {selectedLesson.startTime} – {selectedLesson.endTime}
                                        </p>
                                        <p className="text-pink-600 font-semibold text-lg mt-3">
                                            ⏳ {timeLeft}
                                        </p>

                                        <div className="mt-4 flex justify-center">
                                            <Button
                                                type="primary"
                                                className="!bg-pink-500 !border-pink-500 !rounded-xl"
                                                onClick={() => setOpenLessonModal(false)}
                                            >
                                                Tamam
                                            </Button>
                                        </div>

                                    </div>
                                </Modal>
                            )}

                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
