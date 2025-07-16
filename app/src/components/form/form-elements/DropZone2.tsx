"use client";
import React from "react";
import { useDropzone } from "react-dropzone";

const DropzoneComponent2: React.FC = () => {
  const onDrop = (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`w-[220px] h-[140px] flex flex-col items-center justify-center border border-dashed rounded-md transition-all cursor-pointer
      ${
        isDragActive
          ? "border-blue-500 bg-gray-100 dark:bg-gray-800"
          : "border-gray-300 bg-white dark:bg-gray-900"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-blue-500 underline text-sm font-medium">
        Upload a file
      </p>
      <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
    </div>
  );
};

export default DropzoneComponent2;
