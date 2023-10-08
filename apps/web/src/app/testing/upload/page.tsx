"use client";
import { Input } from "@/components/ui/input";

const UploadTestPage = () => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileSize = e.target.files?.[0].size;
    const kb = Math.round(fileSize ? fileSize / 1024 : 0);
    const mb = Math.round((kb / 1024) * 100) / 100;
    console.log({ mb, kb });
  };

  return (
    <div className="max-w-xl self-center w-full p-16 space-y-4">
      <h1>Upload Test Page</h1>
      <Input onChange={onChange} type="file" />
    </div>
  );
};

export default UploadTestPage;
