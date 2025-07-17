"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!showOtpSection) {
      if (!email) return alert("Please enter an email.");
      console.log("OTP sent to:", email);
      setShowOtpSection(true); // Show OTP & new password fields
    } else {
      if (!otp || !newPassword) return alert("Fill both OTP and new password.");
      console.log("OTP entered:", otp);
      console.log("New Password:", newPassword);
      alert("Password reset simulated!");
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
              Enter your email linked to your account, and we’ll email you a link to reset your password securely.
            </p>
          </div>

          {/* ✅ FORM */}
          <form className="space-y-6">
            {/* Email Field */}
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

            {/* OTP Section */}
            {showOtpSection && (
              <>
                <div className="p-3 bg-green-50 border border-green-300 rounded text-green-700 text-sm">
                  ✅ OTP has been sent to <strong>{email}</strong>
                </div>

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
              </>
            )}

            {/* Submit Button */}
            <div>
              <Button className="w-full" onClick={handleSubmit}>
                {showOtpSection ? "Reset Password" : "Send OTP"}
              </Button>
            </div>
          </form>

          {/* Sign In link */}
          <div className="flex flex-col items-center gap-2 mt-5">
            <p className="text-sm text-center text-gray-700 dark:text-gray-400">
              If you remember the password,{" "}
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
