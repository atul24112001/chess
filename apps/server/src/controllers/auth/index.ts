import * as yup from "yup";

export * from "./login";
export * from "./register";
export * from "./verify";

export const authBody = yup.object({
  name: yup.string().max(100),
  email: yup
    .string()
    .required("Please Provide email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
    .max(100),
  password: yup
    .string()
    .min(8)
    .max(18)
    .required("Password length should be between 8 to 18"),
});
