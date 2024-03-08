import { Button, Form, Input, type FormProps } from "antd";
import "easymde/dist/easymde.min.css";
import { useCallback, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import axios from "axios";

import s from "./BlogNew.module.scss";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  title?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const BlogNew = () => {
  const nav = useNavigate();
  const [value, setValue] = useState("");
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    axios
      .post("http://localhost:3000/api/v1/blogs", {
        title: values.title,
        content: value,
      })
      .then((res) => {
        if (res.status === 201) {
          nav("/blog");
        }
      });
  };
  const onChange = useCallback((value: string) => {
    setValue(value);
  }, []);
  return (
    <div className={s.wrapper}>
      <Form
        name="basic"
        initialValues={{ remember: true }}
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
            value={value}
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
            创建博客
          </Button>
          <Button onClick={() => nav("/blog")}>取消</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BlogNew;
