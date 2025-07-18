"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Success } from "@/icons";
import { Error } from "@/icons";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const router = useRouter();

  useEffect(() => {
    if (message) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [message]);

  const handleSubmit = async () => {
    if (!showOtpSection) {
      if (!email) return alert("Please enter your email.");
      setLoading(true);
      setMessage("");
      setMessageType("");

      try {
        const res = await fetch("http://localhost:5000/api/auth/generate-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage(`OTP sent to ${email}`);
          setMessageType("success");
          setShowOtpSection(true);
        } else {
          setMessage(data.message || "Failed to send OTP.");
          setMessageType("error");
        }
      } catch (err) {
        setMessage("Something went wrong while sending OTP.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    } else {
      if (!otp || !newPassword || !confirmPassword) {
        return alert("Please fill in all fields.");
      }

      if (newPassword !== confirmPassword) {
        return alert("Passwords do not match.");
      }

      setLoading(true);
      setMessage("");
      setMessageType("");

      try {
        const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage("Password changed successfully.");
          setMessageType("success");

          // Delay before redirecting to login
          setTimeout(() => {
            router.push("/"); // or "/signin"
          }, 2000);
        } else {
          setMessage(data.message || "Failed to reset password.");
          setMessageType("error");
        }
      } catch (err) {
        setMessage("Something went wrong.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="flex justify-left mb-10">
          <Link href="/">
            <Image
              src="/images/logo/auth-logo.svg"
              alt="TMS Logo"
              width={185}
              height={40}
              priority
            />
          </Link>
        </div>

        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Forgot Your Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email linked to your account, and we’ll send you an OTP to reset your password securely.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {message && (
              <div
                className={`p-3 rounded-2xl border text-sm mb-4 flex ${
                  messageType === "success"
                    ? "bg-green-50 border-green-300 text-green-800"
                    : "bg-red-50 border-red-300 text-red-800"
                }`}
              >
                {messageType === "success" && <Success className="w-6 mr-2" />}
    {messageType === "error" && <Error className="w-6 mr-2" />}
                {message}
              </div>
            )}

            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {showOtpSection && (
              <>
                <div>
                  <Label>OTP</Label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                </div>

                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}

            <div>
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : showOtpSection
                  ? "Reset Password"
                  : "Send OTP"}
              </Button>
            </div>
          </form>

          <div className="flex flex-col items-center gap-2 mt-5">
            <p className="text-sm text-center text-gray-700 dark:text-gray-400">
              If you remember your password,{" "}
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
