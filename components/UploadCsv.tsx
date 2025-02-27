// components/UploadCsv.tsx
"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

const UploadCsv = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file || !user) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      complete: async (results: { data: any; }) => {
        const data = results.data;
        const userCollection = collection(db, "users", user.id, "simulatedData");

        try {
          for (const row of data) {
            await addDoc(userCollection, {
              Time: row.Time,
              Voltage: parseFloat(row.Voltage),
              Current: parseFloat(row.Current),
              Energy: parseFloat(row.Energy),
              uploadedAt: new Date(),
            });
          }
          alert("CSV uploaded successfully!");
        } catch (error) {
          console.error("Error uploading CSV:", error);
        } finally {
          setUploading(false);
        }
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
        setUploading(false);
      },
    });
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Upload CSV Data</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
};

export default UploadCsv;
