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
  const [pageIndex, setPageIndex] = useState(1);
  const [order, setOrder] = useState("descend");

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
          <Link to={`/blog/${record.id}/edit`}>编辑博客</Link>
          <Button
            style={{ marginLeft: "-14px" }}
            type="link"
            onClick={() => handleDelete(record.id)}
          >
            删除博客
          </Button>
        </Space>
      ),
    },
  ];
  const { destroy, get } = useAjax();
  const { mutate } = useSWRConfig();
  const { data } = useSWR(
    `/api/v1/blogs?page=${pageIndex}&order=${order}`,
    async (path) => (await get<Resources<any>>(path)).data
  );

  const handleDelete = async (id: number) => {
    setCurrentId(id);
    setOpen(true);
  };
  const handleTableChange = async (
    _pagination: any,
    filters: any,
    sorter: { order: string },
    extra: any
  ) => {
    setOrder(sorter.order);
  };

  const handleAddBlog = () => {
    nav("/blog/new");
  };
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText] = useState("确定删除这篇博客吗？");
  const handleOk = async () => {
    if (currentId === null) return;
    setConfirmLoading(true);
    await destroy(`/api/v1/blogs/${currentId}`);
    if (data && data.resources && data.resources.length === 1) {
      // If the current page only had one item left before deletion,
      // navigate back to the first page after deletion.
      setPageIndex(1);

      // Mutate to re-fetch the first page.
      mutate(`/api/v1/blogs?page=1&order=${order}`);
    } else {
      // Otherwise, revalidate the current page.
      mutate(`/api/v1/blogs?page=${pageIndex}&order=${order}`);
    }

    // mutate(`/api/v1/blogs?page=${pageIndex}&order=${order}`);
    setCurrentId(null); // 删除完成后将博客 ID 置为空
    setConfirmLoading(false);
    setOpen(false); // 关闭模态框
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const getPageContent = async (page: number) => {
    setPageIndex(page); // Update current page before fetching data
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
          dataSource={data?.resources || []}
          rowKey={(data) => data.id}
          pagination={{
            current: pageIndex,
            total: data?.pager?.count || 0,
            pageSize: 5,
            onChange: getPageContent,
          }}
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
