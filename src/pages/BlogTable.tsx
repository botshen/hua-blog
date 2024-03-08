import React, { useState } from "react";
import { Button, Modal, Space, Table } from "antd";
import { TableProps } from "antd";
import s from "./BlogTable.module.scss";
import useSWR from "swr";
import { useAjax } from "../lib/ajax";
import dayjs from "dayjs";
import { useSWRConfig } from "swr";
import { Link, useNavigate } from "react-router-dom";

interface DataType {
  key: string;
  title: string;
  created_at: string;
  updated_at: string;
  id: number;
}

const BlogTable: React.FC = () => {
  const nav = useNavigate();
  const [currentId, setCurrentId] = useState<number | null>(null);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "标题",
      dataIndex: "title",
      key: "id ",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      render: (text) => (
        <span>{dayjs(text).format("YYYY-MM-DD HH:mm:ss")}</span>
      ),
    },

    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/blog/${record.id}`}>查看博客</Link>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            删除博客
          </Button>
        </Space>
      ),
    },
  ];
  const { destroy, get } = useAjax();
  const { mutate } = useSWRConfig();
  const { data } = useSWR(
    "/api/v1/blogs",
    async (path) => (await get<Resource<any>>(path)).data.resource
  );

  const handleDelete = async (id: number) => {
    setCurrentId(id); // 将当前博客 ID 存储在状态中

    setOpen(true);
  };
  const handleTableChange = async (
    _pagination: any,
    filters: any,
    sorter: { order: string },
    extra: any
  ) => {
    const res = await get(`/api/v1/blogs?order=${sorter.order}`);
    mutate("/api/v1/blogs", res.data.resource, false);
  };
  const handleAddBlog = () => {
    nav("/blog/new");
  };
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("确定删除这篇博客吗？");
  const handleOk = async () => {
    if (currentId === null) return;
    setConfirmLoading(true);
    await destroy(`/api/v1/blogs/${currentId}`);
    mutate("/api/v1/blogs");
    setCurrentId(null); // 删除完成后将博客 ID 置为空

    setConfirmLoading(false);
    setOpen(false); // 关闭模态框
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  return (
    <>
      <div className={s.wrapper}>
        <Button
          style={{ marginBottom: "20px" }}
          onClick={handleAddBlog}
          type="primary"
        >
          新建博客
        </Button>
        <Table
          columns={columns}
          onChange={handleTableChange}
          dataSource={data}
          rowKey={(data) => data.id}
        />
      </div>
      <Modal
        title="提示"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};

export default BlogTable;
