import React, { useMemo, useState } from "react";
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
    Segmented,
    Tag,
    Avatar,
    Button,
    Empty,
    Badge,
    Tooltip,
} from "antd";
import {
    UserOutlined,
    BookOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    FilterOutlined,
    VideoCameraOutlined,
    CrownOutlined,
    RobotOutlined,
    StarFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const MOCK_LESSONS = [
    {
        id: 1,
        teacher: "Deniz Metin",
        title: "English B1 WM",
        date: "2025-10-16",
        time: "13:30",
        price: 650,
        mode: "online",
        level: "B1",
        featured: true,
    },
    {
        id: 2,
        teacher: "Aymina Çakır",
        title: "Grammar WM",
        date: "2025-10-18",
        time: "11:00",
        price: 520,
        mode: "online",
        level: "B1",
    },
    {
        id: 3,
        teacher: "Deniz Metin",
        title: "Speaking Practice B1",
        date: "2025-10-20",
        time: "19:00",
        price: 700,
        mode: "online",
        level: "B1",
    },
    {
        id: 4,
        teacher: "Selin Arslan",
        title: "Writing Skills A2",
        date: "2025-10-21",
        time: "17:30",
        price: 480,
        mode: "online",
        level: "A2",
    },
    {
        id: 5,
        teacher: "Murat Demir",
        title: "Conversation Club B2",
        date: "2025-10-22",
        time: "20:00",
        price: 590,
        mode: "online",
        level: "B2",
    },
];


const uniq = (arr) => Array.from(new Set(arr));

// Naive AI suggestion based on a lesson
function buildSuggestion(lesson) {
    if (!lesson) return "Bir dersi seçtiğinde sana akıllı bir çalışma önerisi hazırlayacağım.";
    const parts = [];
    if (/grammar|grammer|wm/i.test(lesson.title)) {
        parts.push(
            "Bu ders gramer temelli. Dersten önce 20 dk 'Tenses Quick Review' yap, dersten sonra 5 örnek cümle yaz."
        );
    }
    if (/speaking|conversation/i.test(lesson.title)) {
        parts.push(
            "Konuşma odaklı. 2 dakikalık ses kaydıyla kendini tanıtmayı prova et ve derste 3 yeni kalıp hedefle."
        );
    }
    if (/writing/i.test(lesson.title)) {
        parts.push(
            "Yazma dersi. 'PEEL' paragraf şablonunu kullan, dersten sonra 120 kelimelik mini-paragraf teslim et."
        );
    }
    parts.push(`Eğitmen: ${lesson.teacher}. Seviye: ${lesson.level}. Fiyat: ${lesson.price} TL.`);
    return parts.join(" \n\n");
}

export default function LessonsPage() {

    const [query, setQuery] = useState("");
    const [teacher, setTeacher] = useState(undefined);
    const [level, setLevel] = useState(undefined);
    const [dateRange, setDateRange] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortBy, setSortBy] = useState("soonest");
    const [selected, setSelected] = useState(null);

    const prices = useMemo(() => MOCK_LESSONS.map((l) => l.price), []); //tüm fiyatları çıkarır
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);


    const filtered = useMemo(() => {
        let list = [...MOCK_LESSONS];

        if (query.trim()) {    //Metin araması
            const q = query.toLowerCase();
            list = list.filter(
                (l) =>
                    l.title.toLowerCase().includes(q) ||
                    l.teacher.toLowerCase().includes(q) ||
                    l.level.toLowerCase().includes(q)
            );
        }
        if (teacher) list = list.filter((l) => l.teacher === teacher);
        if (level) list = list.filter((l) => l.level === level);
        if (dateRange?.length === 2 && dateRange[0] && dateRange[1]) {
            const [d0, d1] = dateRange;
            list = list.filter((l) => {
                const d = dayjs(l.date);
                return d.isSame(d0, "day") || d.isSame(d1, "day") || (d.isAfter(d0, "day") && d.isBefore(d1, "day"));
            });
        }
        list = list.filter((l) => l.price >= priceRange[0] && l.price <= priceRange[1]);

        switch (sortBy) {
            case "price-asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "soonest":
            default:
                list.sort((a, b) => dayjs(a.date + " " + a.time).valueOf() - dayjs(b.date + " " + b.time).valueOf());
        }
        return list;
    }, [query, teacher, level, dateRange, priceRange, sortBy]);

    const teachers = useMemo(() => uniq(MOCK_LESSONS.map((l) => l.teacher)), []);
    const levels = useMemo(() => uniq(MOCK_LESSONS.map((l) => l.level)), []);

    const suggestion = useMemo(() => buildSuggestion(selected || filtered[0]), [selected, filtered]);

    return (
        <Layout className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white">
            <Content className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Title level={2} className="!m-0 !leading-tight">
                            <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600 text-transparent bg-clip-text drop-shadow-sm">
                                DERSLER
                            </span>
                        </Title>
                        <Text className="text-gray-500">Açılmış güncel dersleri filtrele, karşılaştır ve kaydol.</Text>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Tooltip title="Popüler dersler">
                            <Button icon={<CrownOutlined />} className="!rounded-xl" />
                        </Tooltip>
                        <Tooltip title="Filtreler">
                            <Button type="primary" icon={<FilterOutlined />} className="!rounded-xl bg-pink-500 border-pink-500 hover:!bg-pink-600" />
                        </Tooltip>
                    </div>
                </div>

                {/* Filters */}
                <Card className="!rounded-2xl !border-pink-100 shadow-sm mb-6">

                    <Row gutter={[16, 12]} align="middle">
                        <Col xs={24} md={8}>
                            <Input
                                allowClear
                                placeholder="Arama: ders adı / hoca / seviye"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="!rounded-xl"
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Select
                                allowClear
                                className="w-full !rounded-xl"
                                placeholder="Hoca"
                                value={teacher}
                                onChange={setTeacher}
                                options={teachers.map((t) => ({ label: t, value: t }))}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <Select
                                allowClear
                                className="w-full !rounded-xl"
                                placeholder="Seviye"
                                value={level}
                                onChange={setLevel}
                                options={levels.map((l) => ({ label: l, value: l }))}
                            />
                        </Col>
                        <Col xs={24} md={6}>
                            <RangePicker className="w-full !rounded-xl" onChange={setDateRange} format="YYYY-MM-DD" />
                        </Col>
                        <Col xs={24} md={3}>

                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} className="mt-4">
                        <Col span={24}>
                            <div className="px-1 flex items-center gap-4">
                                <div className="flex items-center gap-2 w-44">
                                    <DollarOutlined />
                                    <Text className="text-gray-600">Fiyat aralığı</Text>
                                </div>
                                <div className="flex-1">
                                    <Slider
                                        min={minPrice}
                                        max={maxPrice}
                                        step={10}
                                        range
                                        tooltip={{ open: true }}
                                        value={priceRange}
                                        onChange={setPriceRange}
                                    />
                                </div>
                                <div className="w-28 text-right text-sm text-gray-600">{priceRange[0]} – {priceRange[1]} TL</div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Content */}
                <Row gutter={[16, 16]}>
                    {/* Left – list */}
                    <Col xs={24} lg={14} xl={15}>
                        {filtered.length === 0 ? (
                            <Empty description="Kriterlere uyan ders bulunamadı" />
                        ) : (
                            <Row gutter={[16, 16]}>
                                {filtered.map((lesson) => (
                                    <Col key={lesson.id} span={24}>
                                        <Card
                                            onMouseEnter={() => setSelected(lesson)}
                                            onClick={() => setSelected(lesson)}
                                            hoverable
                                            className="!rounded-2xl border border-pink-100 hover:shadow-md transition-shadow"
                                            bodyStyle={{ padding: 16 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Badge.Ribbon
                                                        text={lesson.featured ? "Öne Çıkan" : undefined}
                                                        color="pink"
                                                        style={{ display: lesson.featured ? undefined : "none" }}
                                                    />
                                                    <Avatar size={44} icon={<UserOutlined />} className="bg-pink-100 text-pink-600" />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <Text className="font-semibold text-gray-800">{lesson.teacher}</Text>
                                                            <Tag className="!rounded-full" icon={<BookOutlined />}>{lesson.title}</Tag>
                                                        </div>
                                                        <div className="flex gap-4 text-gray-600 text-sm mt-1">
                                                            <span className="flex items-center gap-1"><CalendarOutlined /> {dayjs(lesson.date).format("DD.MM.YYYY")}</span>
                                                            <span className="flex items-center gap-1"><ClockCircleOutlined /> {lesson.time}</span>
                                                            <span className="flex items-center gap-1"><VideoCameraOutlined /> Online</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Tag color="magenta" className="!m-0 !rounded-full">{lesson.level}</Tag>
                                                    <div className="text-right">
                                                        <div className="text-xl font-extrabold text-pink-600">{lesson.price} TL</div>
                                                        <Button type="primary" className="!rounded-xl bg-pink-500 border-pink-500 hover:!bg-pink-600">Kaydol</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Col>

                    {/* Right – AI Suggestion */}
                    <Col xs={24} lg={10} xl={9}>
                        <div className="sticky top-4">
                            <Card
                                title={
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold shadow-sm">
                                            AI ÖNERİSİ
                                        </div>
                                        <RobotOutlined className="text-pink-500" />
                                    </div>
                                }
                                className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur"
                            >
                                <Paragraph className="text-gray-700 whitespace-pre-line">{suggestion}</Paragraph>
                                {selected && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <Tag icon={<UserOutlined />} className="!rounded-full">{selected.teacher}</Tag>
                                        <Tag icon={<BookOutlined />} className="!rounded-full">{selected.title}</Tag>
                                        <Tag icon={<CalendarOutlined />} className="!rounded-full">{dayjs(selected.date).format("DD.MM.YYYY")}</Tag>
                                        <Tag icon={<ClockCircleOutlined />} className="!rounded-full">{selected.time}</Tag>
                                        <Tag color="magenta" className="!rounded-full">{selected.level}</Tag>
                                    </div>
                                )}

                                <div className="mt-6 p-3 border border-rose-100 rounded-xl bg-rose-50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <StarFilled className="text-pink-500" />
                                        <Text strong>Akıllı ipucu</Text>
                                    </div>
                                    <Text className="text-gray-600 text-sm">
                                        Filtrelerini daralt, bir dersi seç ve sağdaki öneriyi kişiselleştir. Kaydolurken eğitim hedefini (ör. "B1 speaking") yazarsan öneriler daha isabetli olur.
                                    </Text>
                                </div>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
