import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import { useAjax } from "../lib/ajax";
import useSWR from "swr";
import { Button, Card } from "antd";
import dayjs from "dayjs";
import s from "./BlogDetail.module.scss";

const BlogDetail = () => {
  const { id } = useParams();
  const { get } = useAjax();

  const { data } = useSWR(
    "/api/v1/blogs/" + id,
    async (path) => (await get<Resource<any>>(path)).data.resource
  );
  console.log("data", data);
  const nav = useNavigate();

  return (
    <div className={s.wrapper}>
      <h1>博客详情</h1>
      <Button onClick={() => nav("/blog")}>返回</Button>

      {data && <h2>博客标题：{data.title}</h2>}
      {data && (
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          创建时间：{dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </div>
      )}
      {data && (
        <Card className="prose">
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </Card>
      )}
    </div>
  );
};

export default BlogDetail;
