"use client";

import { useState } from "react";
import { Formik } from "formik";
import { Input } from "@/components/helper/Input";
import { Button } from "@/components/helper/Button";
import { useRouter } from "next/navigation";
import { useClient } from "@/hooks/useClient";
import Cookie from "js-cookie";
import Loader from "@/components/helper/Loader";

type Form = {
  email?: string;
  password?: string;
  name?: string;
};

export default function Auth() {
  const router = useRouter();
  const apiClient = useClient();
  const [haveAccount, setHaveAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm((prev) => {
  //     return {
  //       ...prev,
  //       [e.target.name]: e.target.value,
  //     };
  //   });
  // };

  const authenticateHandler = async (
    values: Form,
    onSuccess: (data: any) => void,
    onError: () => void
  ) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post(
        haveAccount ? "/auth/login" : "/auth/register",
        values
      );
      localStorage.setItem("accessToken", data.data[0].token);
      Cookie.set("accessToken", data.data[0].token);
      onSuccess(data);
      router.push("/");
      router.refresh();
    } catch (error) {
      onError();
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex pt-32 justify-center items-center">
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        validate={(values) => {
          const errors: Form = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!haveAccount) {
            if (!values.name) {
              errors.name = "Required";
            } else if (values.name.length < 5) {
              errors.name = "Name should be of min 4 length";
            }
          }
          if (!values.password) {
            errors.password = "Required";
          } else if (values.password.length < 8) {
            errors.password = "Password should be of min 8 length";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          authenticateHandler(
            values,
            () => {
              setSubmitting(false);
            },
            () => {
              setSubmitting(false);
            }
          );
        }}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="bg-[#262522] w-[90%] md:w-[70%] lg:w-[50%] px-8 py-5 rounded-md"
          >
            <h6 className="text-2xl md:text-3xl text-[#739552] text-center font-bold mb-3">
              {haveAccount ? "Login" : "Sign-up"}
            </h6>
            {!haveAccount && (
              <Input
                onChange={handleChange}
                placeholder="name"
                title="Full name"
                value={values.name}
                name="name"
                errorText={errors.name}
              />
            )}
            <Input
              onChange={handleChange}
              placeholder="Email"
              title="Email address"
              value={values.email}
              name="email"
              errorText={errors.email}
            />
            <Input
              name="password"
              onChange={handleChange}
              placeholder="****"
              title="Password"
              value={values.password}
              type="password"
              errorText={errors.password}
            />
            <div className="flex justify-between items-center">
              <p
                onClick={() => setHaveAccount((prev) => !prev)}
                className="text-xs md:text-sm text-[#739552] font-bold cursor-pointer"
              >
                {haveAccount
                  ? "Don't have account?"
                  : "Already have an account?"}
              </p>
              <Button type="submit" onClick={() => {}}>
                {haveAccount ? "Login" : "Create"}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
