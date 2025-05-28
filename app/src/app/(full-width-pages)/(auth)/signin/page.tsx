import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " SignIn Page | TenXAdmin ",
  description: "This is Signin Page TenxAdmin Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
