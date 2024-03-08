import { createHashRouter } from "react-router-dom";
import BlogDetail from "../pages/BlogDetail";
import BlogNew from "../pages/BlogNew";
import BlogEdit from "../pages/BlogEdit";
import WrappedBlogTable from "../pages/BlogTable";

export const router = createHashRouter([
  { path: "/blog", element: <WrappedBlogTable /> },
  { path: "/blog/:id", element: <BlogDetail /> },
  { path: "/blog/:id/edit", element: <BlogEdit /> },
  { path: "/blog/new", element: <BlogNew /> },
  { path: "*", element: <WrappedBlogTable /> },
]);
