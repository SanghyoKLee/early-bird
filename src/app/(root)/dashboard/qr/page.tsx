"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type QrCodeData = {
  code: string;
  qrUrl?: string;
};

export default function QRPage() {
  const { status } = useSession();
  const [qr, setQr] = useState<QrCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  // Fetch QR on mount
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    fetch("/api/qr")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.qr) {
          setQr(data.qr);
          console.log(data);
          setLoading(false);
        } else {
          // Create if not found
          const res = await fetch("/api/qr", { method: "POST" });
          const newData = await res.json();
          setQr(newData.qr);
          console.log(newData);
          setLoading(false);
        }
      });
  }, [status, router]);

  if (status === "loading" || loading) {
    return <div>Loading QR code...</div>;
  }
  if (status === "unauthenticated") {
    return <div>You must be signed in to access this page.</div>;
  }

  const qrValue = qr?.qrUrl ?? "";

  // Print handler: print the QR only
  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 pt-8">
      <h1 className="text-2xl font-bold mb-2 ">Your Wake-Up QR Code</h1>
      {/* QR code print area */}
      <div className="shadow-lg p-6 border border-primary bg-white">
        <div className="print-area  flex flex-col items-center">
          <QRCode value={qrValue} size={200} />
        </div>
      </div>

      {/* Print button is hidden on print */}
      <div className="flex flex-col items-center print:hidden">
        <Button
          onClick={handlePrint}
          className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 py-2 mt-2 hover:cursor-pointer shadow duration-75"
        >
          Print QR Code
        </Button>
      </div>
      <Card className="mt-8 bg-surface p-6 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary">
            How to Use Your QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2 text-lg text-balance ">
            <li>
              Print your QR code and place it where you want to be first thing
              in the morning (e.g., bathroom, kitchen, etc.).
            </li>
            <li>
              When you wake up each morning, scan your QR code to log your wake
              time. <br />
              You&apos;ll have a few minutes after your wake time to get to your
              location to scan in time.
            </li>
            <li>
              Placing your QR code away from your bed helps you build a strong
              “get up” habit!
            </li>
            <li>Check your dashboard to see your streak and stats.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
