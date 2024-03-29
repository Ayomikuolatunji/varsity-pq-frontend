import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import axios from "axios";
import { message } from "antd";

import { setAuth } from "../src/features/users/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { auth } = useSelector((state) => state.persistedReducer);
  const dispatch = useDispatch();
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/dj-rest-auth/login/`,
        values
      );
      const { data } = await res;
      console.log(data);
      dispatch(
        setAuth({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          account: data.user,
        })
      );
      router.push("/dashboard");
    } catch (error) {
      if (error.response.data) {
        setLoginErrorMessage(error.response.data.non_field_errors[0]);
      }
      setLoginError(true);
      setLoading(false);
    }
  };

  const messageError = () => {
    message.error(loginErrorMessage, 4, () => {
      return setLoginError(false);
    });
  };

  useEffect(() => {
    if (loginError) {
      messageError();
    }
  }, [loginError]);

  return (
    <div className="grid items-center justify-center gap-y-5 pt-24">
      <h2 className="text-center text-4xl">Login</h2>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            prefix={<AiOutlineUser className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
          className="!mb-0"
        >
          <Input.Password
            prefix={<AiOutlineLock className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item className="!mb-3">
          <Link href={"/password-reset"}>
            <a className="login-form-forgot !mt-1 inline-block font-semibold text-black">
              Forgot password?
            </a>
          </Link>
        </Form.Item>

        <Form.Item className="">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="login-form-button w-full text-black"
          >
            Log in
          </Button>
          <p className="!mt-2">
            Or{" "}
            <span>
              <Link href={"/volunteer/volunteer-request"}>
                <a className="inline-block font-semibold text-black">
                  become a volunteer!
                </a>
              </Link>
            </span>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
