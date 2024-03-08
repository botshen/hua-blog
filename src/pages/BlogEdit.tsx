import { Button, Form, Input, type FormProps } from "antd";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import useSWR from "swr";
import { useAjax } from "../lib/ajax";
import s from "./BlogDetail.module.scss";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  title?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const BlogEdit = () => {
  const nav = useNavigate();
  const { get } = useAjax();
  const { id } = useParams();
  const { data } = useSWR(
    "/api/v1/blogs/" + id,
    async (path) => (await get<Resource<any>>(path)).data.resource
  );
  const [value, setValue] = useState(data?.content);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    axios
      .patch("http://localhost:3000/api/v1/blogs/" + id, {
        title: values.title,
        content: value,
      })
      .then((res) => {
        if (res.status === 200) {
          nav("/blog");
        }
      });
  };
  const [form] = Form.useForm<FieldType>();
  useEffect(() => {
    form.setFieldsValue({
      title: data?.title,
    });
  }, [data]);
  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);
  return (
    <div className={s.wrapper}>
      <Form
        form={form}
        name="basic"
        initialValues={{
          title: data?.title,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="博客标题"
          name="title"
          rules={[{ required: true, message: "请输入博客标题!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <SimpleMDE
            placeholder="Description"
            value={data?.content}
            onChange={onChange}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginRight: "10px",
            }}
          >
            更新博客
          </Button>
          <Button onClick={() => nav("/blog")}>取消</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BlogEdit;
