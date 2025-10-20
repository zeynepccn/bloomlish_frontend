import React, { useState } from "react";
import {
    Layout,
    Card,
    Typography,
    Form,
    Input,
    Button,
    Upload,
    Avatar,
    message,
} from "antd";
import {
    UserOutlined,
    InboxOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

export default function EditProfilePage() {
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const initialValues = {
        email: "yarencococen@gmail.com",
        username: "zeynep.cocen",
        bio: "",
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) message.error("Lütfen bir resim dosyası yükleyin.");
        if (!isLt2M) message.error("Dosya 2MB'den küçük olmalı.");
        return isImage && isLt2M ? true : Upload.LIST_IGNORE;
    };

    const handleAvatarPreview = (file) => {
        const reader = new FileReader();
        reader.onload = () => setAvatarUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            // burada API çağrısı yaparsın:
            // await api.updateProfile({ ...values, avatar: avatarFile });
            await new Promise((r) => setTimeout(r, 800));
            message.success("Profil bilgilerin kaydedildi ✨");
            navigate("/profile");
        } catch (e) {
            message.error("Kaydetme sırasında bir hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-white">
            <Content className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={72}
                            src={avatarUrl || undefined}
                            icon={!avatarUrl ? <UserOutlined /> : undefined}
                            className="bg-pink-100 text-pink-600"
                        />
                        <div>
                            <Title className="!m-0 !leading-tight">
                                <span className="bg-gradient-to-r from-pink-600 to-fuchsia-600 text-transparent bg-clip-text">
                                    Account Settings
                                </span>
                            </Title>
                            <Text className="text-gray-500">
                                Bilgilerini güncelle, profilini kişiselleştir.
                            </Text>
                        </div>
                    </div>

                    <Button
                        icon={<ArrowLeftOutlined />}
                        className="!rounded-xl"
                        onClick={() => navigate(-1)}
                    >
                        Geri
                    </Button>
                </div>

                <Card className="!rounded-2xl border border-pink-100 bg-white/80 backdrop-blur">
                    <Form
                        layout="vertical"
                        initialValues={initialValues}
                        onFinish={onFinish}
                        requiredMark={false}
                    >
                        {/* Email */}
                        <Form.Item
                            label="Email Address"
                            name="email"
                            rules={[
                                { required: true, message: "Email zorunlu" },
                                { type: "email", message: "Geçerli bir email girin" },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="ornek@mail.com"
                                className="!rounded-xl"
                            />
                        </Form.Item>

                        {/* Username */}
                        <Form.Item
                            label="UserName"
                            name="username"
                            rules={[
                                { required: true, message: "Kullanıcı adı zorunlu" },
                                {
                                    pattern: /^[a-zA-Z0-9_.-]{3,20}$/,
                                    message:
                                        "3–20 karakter, harf/rakam/._- kullanılabilir.",
                                },
                            ]}
                        >
                            <Input size="large" className="!rounded-xl" />
                        </Form.Item>

                        {/* Password */}
                        <Form.Item
                            label="Password"
                            name="password"
                            extra="Boş bırakırsan mevcut şifre korunur."
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || value.length >= 6) return Promise.resolve();
                                        return Promise.reject(
                                            new Error("Şifre en az 6 karakter olmalı.")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" className="!rounded-xl" />
                        </Form.Item>

                        {/* Profil Fotoğrafı */}
                        <Form.Item label="PP değiştir" name="avatar">
                            <Dragger
                                name="file"
                                multiple={false}
                                maxCount={1}
                                beforeUpload={(file) => {
                                    const ok = beforeUpload(file);
                                    if (ok) handleAvatarPreview(file);
                                    // gerçek upload yapmayacağız; sadece önizleme:
                                    return false;
                                }}
                                className="!rounded-xl border-dashed"
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined className="text-pink-500" />
                                </p>
                                <p className="ant-upload-text">
                                    Dosyayı buraya sürükle bırak veya tıkla
                                </p>
                                <p className="ant-upload-hint text-gray-500">
                                    PNG/JPG, maksimum 2MB
                                </p>
                            </Dragger>
                        </Form.Item>

                        {/* Biyografi */}
                        <Form.Item label="Biyografi" name="bio">
                            <TextArea
                                rows={4}
                                placeholder="Kendin hakkında kısa bir açıklama…"
                                className="!rounded-xl"
                            />
                        </Form.Item>

                        {/* Actions */}
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
