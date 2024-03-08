import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ajax = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
// ajax.interceptors.request.use((config) => {
//   const jwt = localStorage.getItem("jwt") || "";
//   config.headers = config.headers || {};
//   if (jwt) {
//     config.headers.Authorization = `Bearer ${jwt}`;
//   }
//   return config;
// });

type Options = {
  showLoading?: boolean;
  handleError?: boolean;
};
export const useAjax = (options?: Options) => {
  const table: Record<string, undefined | (() => void)> = {
    401: () => {
      nav("/sign_in");
    },
    402: () => {
      window.alert("请付费后观看");
    },
    403: () => {
      window.alert("没有权限");
    },
  };
  const handleError = options?.handleError ?? true;
  const nav = useNavigate();
  const onError = (error: AxiosError) => {
    if (error.response) {
      if (handleError) {
        const { status } = error.response;
        const fn = table[status];
        fn?.();
      }
    }
    throw error;
  };
  return {
    get: <T>(path: string, config?: AxiosRequestConfig<any>) => {
      return ajax
        .get<T>(path, config)
        .catch(onError)
        .finally(() => {});
    },
    post: <T>(path: string, data: JSONValue) => {
      return ajax
        .post<T>(path, data)
        .catch(onError)
        .finally(() => {});
    },
    patch: <T>(path: string, data: JSONValue) => {
      return ajax
        .patch<T>(path, data)
        .catch(onError)
        .finally(() => {});
    },
    destroy: <T>(path: string) => {
      return ajax
        .delete<T>(path)
        .catch(onError)
        .finally(() => {});
    },
  };
};
