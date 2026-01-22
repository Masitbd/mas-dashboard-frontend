/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from "axios";
import { getSession } from "next-auth/react";
const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// Add a request interceptor
instance.interceptors.request.use(
  async function (config) {
    const token = await getSession();
    if (token?.token) {
      config.headers.authorization = token?.token;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  //@ts-expect-error
  function (response) {
    const responseObject = {
      data: response?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },
  async function (error) {
    if (error?.response?.status === 403) {
    } else {
      const responseObject = {
        statusCode: error?.response?.data?.statusCode || 500,
        message: error?.response?.data?.message || "Something went wrong",
        errorMessages: error?.response?.data?.message,
        error: error?.response?.data?.message || "Something went wrong",
      };
      return responseObject;
    }

    // return Promise.reject(error);
  }
);

export { instance };
