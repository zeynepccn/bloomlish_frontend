import React, { useMemo, useState } from "react";
import { Card, Table, Tag, Input, Select, Space, Typography } from "antd";

const { Title } = Typography;

const statusTag = (status) => {
    const map = {
        SUCCESS: "green",
        FAILED: "red",
        PENDING: "orange",
    };
    return <Tag color={map[status] || "default"}>{status}</Tag>;
};

export default function PaymentsTab({ data = [], loading = false }) {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("ALL");

    const filteredData = useMemo(() => {
        const q = query.toLowerCase().trim();

        return (data || [])
            .filter((r) => (status === "ALL" ? true : r.status === status))
            .filter((r) => {
                if (!q) return true;
                return (
                    (r.user || "").toLowerCase().includes(q) ||
                    (r.order || "").toLowerCase().includes(q)
                );
            });
    }, [data, query, status]);

    const columns = [
        { title: "User", dataIndex: "user", key: "user", ellipsis: true },
        { title: "Plan", dataIndex: "order", key: "order", ellipsis: true },
        {
            title: "Amount",
            key: "amount",
            render: (_, r) => `${Number(r.amount).toFixed(2)} ${r.currency || "TRY"}`,
            width: 140,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: statusTag,
            width: 120,
        },
        { title: "CreatedAt", dataIndex: "createdAt", key: "createdAt", width: 200 },
    ];

    return (
        <Card className="!rounded-2xl">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12 }}>
                <Title level={4} style={{ margin: 0 }}>
                    Ödemeler
                </Title>

                <Space>
                    <Input
                        placeholder="User veya Plan search..."
                        allowClear
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ width: 260 }}
                    />
                    <Select
                        value={status}
                        onChange={setStatus}
                        style={{ width: 160 }}
                        options={[
                            { value: "ALL", label: "All" },
                            { value: "SUCCESS", label: "SUCCESS" },
                            { value: "FAILED", label: "FAILED" },
                            { value: "PENDING", label: "PENDING" },
                        ]}
                    />
                </Space>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </Card>
    );
}
