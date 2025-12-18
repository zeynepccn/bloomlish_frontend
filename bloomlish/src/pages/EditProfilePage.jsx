import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Form, Input, Button, message } from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../api";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function EditProfilePage() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [loadingMe, setLoadingMe] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/api/profile/me");
                form.setFieldsValue({
                    email: res.data.email,
                    username: res.data.username,
                    password: "",
                });
            } catch (e) {
                message.error("Profil bilgileri alınamadı. Giriş yapman gerekebilir.");
            } finally {
                setLoadingMe(false);
            }
        })();
    }, [form]);
    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const payload = {
                email: values.email,
                username: values.username,
                password: values.password || "",
            };

            const res = await api.put("/api/profile/me", payload);
            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
            }
            if (res.data?.email) {
                localStorage.setItem("email", res.data.email);
            }

            message.success("Profil güncellendi ✨");
            navigate("/profile");

        } catch (e) {
            const msg = e?.response?.data || "Güncelleme başarısız.";
            message.error(typeof msg === "string" ? msg : "Güncelleme başarısız.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white">
            <Content className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Title className="!m-0">
                            <span className="bg-gradient-to-r from-pink-600 to-fuchsia-600 text-transparent bg-clip-text font-normal">
                                Hesap Ayarları
                            </span>
                        </Title>
                        <Text className="text-gray-500">Email, kullanıcı adı ve şifre değiştir.</Text>
                    </div>
                    <Button icon={<ArrowLeftOutlined />} className="!rounded-xl" onClick={() => navigate(-1)}>
                        Geri
                    </Button>
                </div>

                <Card className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        disabled={loadingMe}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Email zorunlu" },
                                { type: "email", message: "Geçerli bir email girin" },
                            ]}
                        >
                            <Input size="large" className="!rounded-xl" />
                        </Form.Item>

                        <Form.Item
                            label="Kullanıcı adı"
                            name="username"
                            rules={[
                                { required: true, message: "Kullanıcı adı zorunlu" }
                            ]}
                        >
                            <Input size="large" className="!rounded-xl" />
                        </Form.Item>

                        <Form.Item
                            label="Yeni şifre"
                            name="password"
                            extra="Boş bırakırsan şifren değişmez."
                            rules={[
                                {
                                    validator: (_, value) =>
                                        !value || value.length >= 6
                                            ? Promise.resolve()
                                            : Promise.reject(new Error("Şifre en az 6 karakter olmalı.")),
                                },
                            ]}
                        >
                            <Input.Password size="large" className="!rounded-xl" />
                        </Form.Item>

                        <div className="flex justify-end">
                            <Button
                                htmlType="submit"
                                type="primary"
                                size="large"
                                icon={<SaveOutlined />}
                                loading={submitting}
                                className="!bg-gradient-to-r !from-pink-500 !to-fuchsia-600 border-none hover:!opacity-90 px-8 rounded-xl shadow-[0_10px_30px_rgba(236,72,153,0.25)]"
                            >
                                Kaydet
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
}
