"use client";
import { useState } from "react";
import axiosInstance from "../lib/axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [emailBodyTemplate, setEmailBodyTemplate] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!file || !emailBodyTemplate || !campaignName) {
      setMessage("Please fill all fields.");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("emailBodyTemplate", emailBodyTemplate);
    formData.append("campaignName", campaignName);

    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      const err = error as any;
      setMessage("Error: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Email Campaign Uploader</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
        <input type="text" placeholder="Campaign Name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} className="border p-2 w-full" />
        <textarea placeholder="Email Body Template (Use {Name} and {TrackingUrl})" value={emailBodyTemplate} onChange={(e) => setEmailBodyTemplate(e.target.value)} className="border p-2 w-full h-32"></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload & Send Emails</button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
