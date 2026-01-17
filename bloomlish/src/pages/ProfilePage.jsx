import React, { useEffect, useState } from "react";
import { Modal, Upload, message, Dropdown, Rate, Input } from "antd";
import { Layout, Card, Row, Col, Typography, Avatar, Button, Tag, Progress, List } from "antd";

const { TextArea } = Input;


import { UserOutlined, EditOutlined, CreditCardOutlined, LogoutOutlined, SmileOutlined, TrophyOutlined, BulbOutlined, BookOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../api";

const { Content } = Layout;
const { Title, Text } = Typography;
export default function ProfilePage({ onLogout }) {
    const n = useNavigate();

    const [user, setUser] = useState(null);

    const [myLessons, setMyLessons] = useState([]);
    const [openLessonModal, setOpenLessonModal] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");

    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [feedbackLesson, setFeedbackLesson] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [sendingFeedback, setSendingFeedback] = useState(false);
    const [feedbackSubmittedMap, setFeedbackSubmittedMap] = useState({});

    useEffect(() => {
        api
            .get("/api/payments/my-lessons",)
            .then((res) => {
                console.log("Dersler → ", res.data);
                setMyLessons(res.data);
            })
            .catch((err) => {
                console.error("Dersler çekilemedi:", err);
            });
    }, []);


    useEffect(() => {
        api
            .get("/api/profile/me",)
            .then((res) => {
                console.log("Profil →", res.data);
                console.log("Badges →", res.data.badges);
                setUser(res.data);
            })
            .catch((err) => {
                console.error("Profil çekilemedi:", err);
            });
    }, []);

    const getLessonStatus = (lesson) => {
        const now = new Date();
        const start = new Date(lesson.date + " " + lesson.startTime);
        const end = new Date(lesson.date + " " + lesson.endTime);

        if (now > end) return { status: "Tamamlandı", color: "default", disabled: false };
        if (now > start && now < end) return { status: "Ders Devam Ediyor", color: "green", disabled: false };
        return { status: "Yaklaşan Ders", color: "magenta", disabled: false };
    };

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


    const handleLessonClick = async (lesson) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { status } = getLessonStatus(lesson);

        // ✅ Ders tamamlandıysa: yorum/puan modalı
        if (status === "Tamamlandı") {
            try {
                // önce local map
                if (feedbackSubmittedMap[lesson.id]) {
                    Modal.info({
                        title: "Geri bildirim zaten gönderildi",
                        content: "Bu ders için yorumunu daha önce iletmişsin.",
                    });
                    return;
                }

                // backend'den kontrol
                const s = await api.get(`/api/feedbacks/status/${lesson.id}`);
                if (s.data?.submitted) {
                    setFeedbackSubmittedMap((prev) => ({ ...prev, [lesson.id]: true }));
                    Modal.info({
                        title: "Geri bildirim zaten gönderildi",
                        content: "Bu ders için yorumunu daha önce iletmişsin.",
                    });
                    return;
                }

                setFeedbackLesson(lesson);
                setRating(5);
                setComment("");
                setOpenFeedbackModal(true);
                return;
            } catch (err) {
                console.error("feedback status error:", err);
                Modal.error({
                    title: "Bir Hata Oluştu",
                    content: "Geri bildirim kontrolü yapılamadı.",
                });
                return;
            }
        }

        // ⬇️ eski akışın aynen devam
        try {
            const res = await api.get(`/api/lessons/join-check/${lesson.id}`);
            const result = res.data;

            if (result === "OK") {
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

            if (result === "NOT_STARTED" || result === "WRONG_DAY") {
                setSelectedLesson(lesson);
                setOpenLessonModal(true);

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


    const uploadAvatar = async (file) => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const form = new FormData();
            form.append("file", file);

            const res = await api.post("/api/profile/me/avatar", form,);

            setUser(res.data);
            message.success("Profil fotoğrafı güncellendi!");
        } catch (err) {
            console.error("Avatar yüklenemedi:", err);
            message.error("Profil fotoğrafı yüklenemedi!");
        }

        return false;
    };

    const handleRemoveAvatar = async () => {
        try {
            await api.delete("/api/profile/me/avatar/delete");
            setUser((prev) => ({
                ...prev,
                profileImageUrl: null,
            }));
            message.success("Profil fotoğrafı kaldırıldı");
        } catch (err) {
            console.error("Avatar silinemedi:", err);
            message.error("Profil fotoğrafı kaldırılamadı");
        }
    };
    const avatarMenu = {
        items: [
            {
                key: "upload",
                label: "Fotoğraf Yükle",
                icon: <UploadOutlined />,
                onClick: () => {
                    document.getElementById("avatar-upload-input").click();
                },
            },
            {
                key: "remove",
                label: "Fotoğrafı Kaldır",
                icon: <DeleteOutlined />,
                danger: true,
                disabled: !user?.profileImageUrl,
                onClick: handleRemoveAvatar,
            },
        ],
    };
    const handleLogout = () => {
        onLogout?.();
        n("/", { replace: true });
    };
    const badges = user?.badges || [];

    const activeGoal =
        badges.find((b) => !b.earned) || badges[badges.length - 1];

    const goalPct = activeGoal?.threshold
        ? Math.round((activeGoal.progress / activeGoal.threshold) * 100)
        : 0;

    const earnedBadges = (user?.badges || []).filter((b) => b.earned);
    const inProgressBadges = badges.filter((b) => !b.earned);
    const completedBadges = badges.filter((b) => b.earned);


    return (
        <Layout className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white">
            <Content className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                        {/* 🔽 AVATAR */}
                        <Dropdown menu={avatarMenu} trigger={["hover"]}>
                            <div className="cursor-pointer">
                                <Upload
                                    id="avatar-upload-input"
                                    showUploadList={false}
                                    beforeUpload={uploadAvatar}
                                >
                                    <Avatar
                                        size={72}
                                        src={user?.profileImageUrl || undefined}
                                        icon={!user?.profileImageUrl ? <UserOutlined /> : undefined}
                                        className="bg-pink-100 text-pink-600"
                                    />
                                </Upload>
                            </div>
                        </Dropdown>
                        {/* 🔼 AVATAR */}

                        {/* ✅ İSİM/LEVEL/EMAIL */}
                        <div>
                            <Title level={2} className="!m-0 !leading-tight text-pink-700">
                                {user?.displayName || user?.username || "—"}
                            </Title>

                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Tag color="magenta" className="!rounded-full !px-3 !py-1">
                                    SEVİYE: {user?.currentLevel || "—"}
                                </Tag>
                                <Text className="text-gray-600">{user?.email || "—"}</Text>
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
                            onClick={handleLogout}
                        >
                            Çıkış
                        </Button>
                    </div>
                </div>

                {/* GREETING */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2">
                        <span className="text-2xl"></span>
                        <Text className="text-pink-600 font-semibold text-lg">
                            {`Merhaba ${user?.displayName || user?.username || "—"}! Bugün harika bir gün, İngilizce pratiğine devam edelim`}
                        </Text>
                    </div>
                </div>

                {/* ÜST ROW: ROZETLER + İLERLEME */}
                <Row gutter={[16, 16]} className="mb-2">
                    {/* Rozetler (sadece kazanılanlar) */}
                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <span className="text-xl"></span>
                                    <span>Rozetler</span>
                                </div>
                            }
                            className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur"
                        >
                            {earnedBadges.length === 0 ? (
                                <Text className="text-gray-600">
                                    Henüz rozet kazanmadın. Hedef kutusundan ilerlemeyi takip et
                                </Text>
                            ) : (
                                <div className="space-y-3">
                                    {earnedBadges.map((b) => (
                                        <div key={b.id} className="flex items-center gap-2">
                                            <TrophyOutlined className="text-pink-500" />
                                            <Text className="text-gray-700">{b.title}</Text>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* İlerleme ve Aktivite (buraya taşındı) */}
                    <Col xs={24} md={12}>
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <BulbOutlined className="text-pink-500" />
                                    <span>İlerleme ve Aktivite</span>
                                </div>
                            }
                            className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur"
                        >
                            <div className="p-3 border border-rose-100 rounded-xl bg-rose-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <BulbOutlined className="text-pink-500" />
                                    <Text strong>Yapay Zeka Tavsiyesi</Text>
                                </div>
                                <Text className="text-gray-700">
                                    {user?.aiTip || "Bugün 10 dk pratik yaparak serini koru "}
                                </Text>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/*  ALT ROW: HEDEF KUTUSU FULL WIDTH */}
                <Row gutter={[16, 16]} className="mb-2">
                    <Col xs={24}>
                        <Card
                            title={
                                <div className="flex items-center gap-2">
                                    <span>Hedef kutusu</span>
                                </div>
                            }
                            className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur"
                        >
                            {inProgressBadges.length === 0 ? (
                                <Text className="text-gray-600">
                                    Tebrikler! Tüm hedefleri tamamladın
                                </Text>
                            ) : (
                                <div className="space-y-4">
                                    {inProgressBadges.map((b) => {
                                        const pct = b.threshold
                                            ? Math.round((b.progress / b.threshold) * 100)
                                            : 0;

                                        return (
                                            <div
                                                key={b.id}
                                                className="p-3 rounded-xl border border-rose-100 bg-rose-50"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div>
                                                        <Text strong className="text-gray-800">
                                                            {b.title}
                                                        </Text>
                                                        <div className="text-xs text-gray-500">
                                                            {b.description}
                                                        </div>
                                                    </div>

                                                    <Tag
                                                        color="magenta"
                                                        className="!rounded-full"
                                                    >
                                                        Devam ediyor
                                                    </Tag>
                                                </div>

                                                <Progress percent={pct} status="active" />

                                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                                    <span>
                                                        {b.progress}/{b.threshold}
                                                    </span>
                                                    <span>%{pct}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* tamamlananlar */}
                            {completedBadges.length > 0 && (
                                <div className="mt-4">
                                    <Text className="text-xs text-gray-500">
                                        Tamamlananlar:
                                    </Text>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {completedBadges.map((b) => (
                                            <Tag
                                                key={b.id}
                                                color="green"
                                                className="!rounded-full"
                                            >
                                                {b.title}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>

                {/* GRID BOTTOM */}
                <Row gutter={[16, 16]}>
                    {/* Derslerim (full width) */}
                    <Col xs={24}>
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
                                            className={`border border-gray-200 p-3 rounded-xl flex items-center justify-between hover:bg-rose-50 transition ${disabled
                                                ? "opacity-50 cursor-not-allowed"
                                                : "cursor-pointer"
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
                                                    <div className="font-medium text-gray-800">
                                                        {lesson.name}
                                                    </div>
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
                                                {status === "Tamamlandı" && feedbackSubmittedMap[lesson.id] ? " • Gönderildi" : ""}
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
                                            Derse Daha Var
                                        </h2>

                                        <p className="text-gray-700">
                                            <strong>{selectedLesson.name}</strong> dersi henüz başlamadı.
                                        </p>

                                        <p className="text-gray-500 mt-2">
                                            <strong>Tarih:</strong> {selectedLesson.date}
                                            <br />
                                            <strong>Saat:</strong> {selectedLesson.startTime} –{" "}
                                            {selectedLesson.endTime}
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
                        <Modal
                            open={openFeedbackModal}
                            onCancel={() => setOpenFeedbackModal(false)}
                            centered
                            title="Ders Değerlendir"
                            okText="Gönder"
                            cancelText="Vazgeç"
                            confirmLoading={sendingFeedback}
                            onOk={async () => {
                                if (!feedbackLesson) return;

                                if (!comment.trim()) {
                                    message.error("Yorum boş olamaz.");
                                    return;
                                }

                                try {
                                    setSendingFeedback(true);

                                    await api.post("/api/feedbacks", {
                                        lessonId: feedbackLesson.id,
                                        rating,
                                        comment: comment.trim(),
                                    });

                                    message.success("Geri bildirimin gönderildi!");
                                    setFeedbackSubmittedMap((prev) => ({ ...prev, [feedbackLesson.id]: true }));
                                    setFeedbackLesson(null);
                                    setComment("");
                                    setRating(5);
                                    setOpenFeedbackModal(false);
                                } catch (err) {
                                    console.error("feedback post error:", err);
                                    message.error("Geri bildirim gönderilemedi!");
                                } finally {
                                    setSendingFeedback(false);
                                }
                            }}
                        >
                            <div className="space-y-3">
                                <div className="text-sm text-gray-600">
                                    <b>{feedbackLesson?.name}</b>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {feedbackLesson?.date} • {feedbackLesson?.startTime} - {feedbackLesson?.endTime}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm font-medium mb-1">Puan</div>
                                    <Rate value={rating} onChange={setRating} />
                                </div>

                                <div>
                                    <div className="text-sm font-medium mb-1">Yorum</div>
                                    <TextArea
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Hocam konuyu çok güzel anlattınız..."
                                        maxLength={500}
                                        showCount
                                    />
                                </div>
                            </div>
                        </Modal>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );

}