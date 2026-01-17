import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import api from "../api";
import {
    Layout,
    Card,
    Row,
    Col,
    Typography,
    Input,
    Select,
    DatePicker,
    Slider,
    Tag,
    Avatar,
    Button,
    Empty,
    message,
} from "antd";

import { UserOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DEFAULT_PRICE_RANGE = [100, 1000];

export default function LessonsPage() {
    const [lessons, setLessons] = useState([]);
    const [myLessons, setMyLessons] = useState([]); // ✅ kullanıcının kayıtlı dersleri

    const [query, setQuery] = useState("");
    const [teacher, setTeacher] = useState(undefined);
    const [level, setLevel] = useState(undefined);
    const [dateRange, setDateRange] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState(DEFAULT_PRICE_RANGE);
    const [enrolledLessonIds, setEnrolledLessonIds] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    const fetchAllLessons = async () => {
        try {
            const res = await api.get("/api/lessons"); // ✅ sadece boş dersler
            setLessons(res.data || []);
            setCurrentPage(1);
        } catch (err) {
            console.error(err);
            message.error("Dersler alınamadı ");
        }
    };

    const fetchMyLessons = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMyLessons([]);
                setEnrolledLessonIds([]);
                return;
            }

            const res = await api.get("/api/payments/my-lessons", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const arr = Array.isArray(res.data) ? res.data : [];
            setMyLessons(arr);
            setEnrolledLessonIds(arr.map((l) => l.id));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllLessons();
        fetchMyLessons();
    }, []);

    // ✅ sekmeye geri dönünce yenile (başkası satın aldıysa kaybolsun)
    useEffect(() => {
        const onFocus = () => {
            fetchAllLessons();
            fetchMyLessons();
        };
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    // ✅ boş dersler + benim derslerimi birleştir (benimkiler "Kayıtlı" görünsün)
    const mergedLessons = React.useMemo(() => {
        const map = new Map();
        (lessons || []).forEach((l) => map.set(l.id, l));
        (myLessons || []).forEach((l) => map.set(l.id, l)); // benim derslerimi ekle/üstüne yaz
        return Array.from(map.values());
    }, [lessons, myLessons]);

    const teacherList = [...new Set(mergedLessons.map((l) => l.instructorName))];
    const levelList = [...new Set(mergedLessons.map((l) => l.level))];

    // =====================
    // FİLTRELEME
    // =====================
    const applyFiltersToBackend = async () => {
        const params = {};
        setCurrentPage(1);

        if (query) params.name = query;
        if (teacher) params.instructor = teacher;
        if (level) params.level = level;

        const [minSel, maxSel] = selectedPriceRange;
        const [defMin, defMax] = DEFAULT_PRICE_RANGE;

        if (minSel !== defMin || maxSel !== defMax) {
            params.minPrice = minSel;
            params.maxPrice = maxSel;
        }

        if (dateRange?.length === 2) {
            params.startDate = dateRange[0].format("YYYY-MM-DD");
            params.endDate = dateRange[1].format("YYYY-MM-DD");
        }

        // Filtre yoksa normal fetch
        if (Object.keys(params).length === 0) {
            fetchAllLessons();
            fetchMyLessons();
            return;
        }

        try {
            const res = await api.get("/api/lessons/filter", { params }); // ✅ sadece boş dersler filtreli gelir
            setLessons(res.data || []); // boş dersleri güncelle
            setCurrentPage(1);
            // ✅ kayıtlı dersler her zaman görünsün diye ayrıca çekmeye devam
            await fetchMyLessons();
        } catch (err) {
            console.error(err);
            message.error("Filtreleme başarısız ");
        }
    };

    const resetFilters = () => {
        setQuery("");
        setTeacher(undefined);
        setLevel(undefined);
        setDateRange([]);
        setSelectedPriceRange(DEFAULT_PRICE_RANGE);
        setCurrentPage(1);
        fetchAllLessons();
        fetchMyLessons();
    };

    const getLevelColor = (lvl) => {
        switch (lvl) {
            case "A1": return "green";
            case "A2": return "lime";
            case "B1": return "blue";
            case "B2": return "cyan";
            case "C1": return "purple";
            case "C2": return "magenta";
            default: return "pink";
        }
    };

    const [enrollingId, setEnrollingId] = useState(null);

    const handleEnroll = async (lessonId) => {
        try {
            setEnrollingId(lessonId);
            const token = localStorage.getItem("token");

            const res = await api.post(
                `/api/payments/lesson/${lessonId}`,
                { callbackUrl: window.location.origin + "/payment/callback" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            window.location.href = res.data.paymentUrl;

        } catch (err) {
            const status = err.response?.status;
            const code = err.response?.data?.code;

            if (status === 409 && code === "LESSON_FULL") {
                message.error("Bu ders az önce alındı, ders doldu.");
                setLessons((prev) => prev.filter((l) => l.id !== lessonId)); // boş ders listesinden kaldır
                return;
            }

            if (status === 409 && code === "ALREADY_ENROLLED") {
                message.info("Bu derse zaten kayıtlısın.");
                await fetchMyLessons();
                return;
            }

            console.log("ERROR:", err.response?.data);
            message.error("Ödeme başlatılamadı.");
        }
        finally {
            setEnrollingId(null);
        }
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLessons = mergedLessons.slice(startIndex, endIndex);

    return (
        <Layout className="min-h-screen bg-white">
            <Content className="max-w-5xl mx-auto px-4 py-6">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <Title level={2} style={{ color: "#e75480" }} >
                            DERSLER
                        </Title>
                    </div>
                    <Button onClick={resetFilters}>Filtreleri Temizle</Button>
                </div>

                {/* FİLTRE KARTI */}
                <Card className="rounded-2xl mt-4 shadow-sm border border-gray-100 w-auto ">
                    <Row gutter={[16, 12]}>
                        <Col xs={24} md={8}>
                            <Input
                                placeholder="Ders adı"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="h-11"
                            />
                        </Col>

                        <Col xs={12} md={4}>
                            <Select
                                allowClear
                                placeholder="Hoca"
                                value={teacher}
                                onChange={setTeacher}
                                options={teacherList.map((t) => ({
                                    label: t,
                                    value: t,
                                }))}
                                className="w-full h-11"
                                size="large"
                            />
                        </Col>

                        <Col xs={12} md={4}>
                            <Select
                                allowClear
                                placeholder="Seviye"
                                value={level}
                                onChange={setLevel}
                                options={levelList.map((l) => ({
                                    label: l,
                                    value: l,
                                }))}
                                className="w-full h-11"
                                size="large"
                            />
                        </Col>

                        <Col xs={24} md={6}>
                            <RangePicker
                                className="w-full h-11"
                                onChange={setDateRange}
                                format="YYYY-MM-DD"
                            />
                        </Col>

                        <Col xs={24} md={2} style={{ display: "flex", alignItems: "center" }}>
                            <Button
                                type="primary"
                                style={{ width: "120%", height: "40px" }}
                                icon={<FilterOutlined />}
                                onClick={applyFiltersToBackend}
                            >
                                Filtrele
                            </Button>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col span={24}>
                            <Slider
                                min={DEFAULT_PRICE_RANGE[0]}
                                max={DEFAULT_PRICE_RANGE[1]}
                                range
                                value={selectedPriceRange}
                                onChange={setSelectedPriceRange}
                            />
                        </Col>
                    </Row>
                </Card>

                {/* DERS LİSTESİ */}
                <Row gutter={[16, 16]}>
                    {mergedLessons.length === 0 ? (
                        <Empty description="Ders bulunamadı" />
                    ) : (
                        paginatedLessons.map((lesson) => (
                            <Col span={24} key={lesson.id}>
                                <Card className="rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start justify-between w-full">
                                        <div className="flex items-start gap-4">
                                            <Avatar size={50} icon={<UserOutlined />} className="bg-gray-200" />

                                            <div className="flex flex-col">
                                                <Text strong style={{ fontSize: 17 }}>
                                                    {lesson.instructorName}
                                                </Text>

                                                <Text style={{ fontSize: 15, color: "#555" }}>
                                                    {lesson.name}
                                                </Text>

                                                <Tag color="volcano" className="px-2 py-1 mt-1 text-sm rounded-md">
                                                    {lesson.category}
                                                </Tag>

                                                <div className="flex flex-col text-gray-600 mt-2 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        {dayjs(lesson.date).format("DD.MM.YYYY")}
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <span> Başlangıç:</span>
                                                        {lesson.startTime}
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <span> Bitiş:</span>
                                                        {lesson.endTime}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <Tag color={getLevelColor(lesson.level)} className="px-3 py-1 text-sm rounded-md">
                                                {lesson.level}
                                            </Tag>

                                            <div className="text-xl font-bold text-pink-600 mt-2">
                                                {lesson.price} TL
                                            </div>

                                            {enrolledLessonIds.includes(lesson.id) ? (
                                                <Button
                                                    shape="round"
                                                    disabled
                                                    style={{ marginTop: "10px", backgroundColor: "#f0f0f0", color: "#888" }}
                                                >
                                                    Kayıtlı
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="primary"
                                                    shape="round"
                                                    loading={enrollingId === lesson.id}
                                                    disabled={enrollingId === lesson.id}
                                                    onClick={() => handleEnroll(lesson.id)}
                                                    style={{ marginTop: "10px" }}
                                                >
                                                    Kaydol
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>

                <div className="flex justify-center mt-6">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={mergedLessons.length}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                    />
                </div>

            </Content>
        </Layout>
    );
}
