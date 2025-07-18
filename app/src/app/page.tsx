import GridShape from "@/components/common/GridShape";
import Image from "next/image";
import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";

export default function Home() {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
        <SignInForm />
        <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:flex items-center justify-center hidden px-10">
          <div className="relative z-10 max-w-2xl text-center text-white">
            <GridShape/>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-snug">
              Modern Transport Management System <br /> for Logistics Teams
            </h2>
            <p className="mb-6 text-sm sm:text-base">
              Plan, Track & Optimize Every Shipment — All in One Place
            </p>

            <Image
              width={800}
              height={400}
              src="/images/logo/signup.png"
              alt="Dashboard Preview"
              className="rounded-md shadow-lg w-full max-w-[700px] mx-auto"
            />
          </div>
        </div>
      </div>
    </div>

  );
}
