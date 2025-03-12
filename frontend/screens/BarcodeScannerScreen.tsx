import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScannerScreen() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => setError("Error accediendo a la cámara: " + err.message));

    const startScanning = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        if (videoDevices.length === 0) {
          setError("No se encontraron cámaras.");
          return;
        }

        const selectedDeviceId = videoDevices[0].deviceId; // Usa la primera cámara disponible

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              setScannedCode(result.getText());
            }
          }
        );
      } catch (err) {
        setError("Error al iniciar escaneo: " + err.message);
      }
    };

    startScanning();

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Escáner de Código de Barras</h2>

      {/* 📷 Cámara */}
      <video ref={videoRef} autoPlay className="w-full max-w-md border-2 border-gray-300 rounded-lg shadow-lg" />

      {/* 🔹 Código escaneado */}
      {scannedCode && (
        <p className="mt-4 p-2 bg-green-200 text-green-800 rounded text-lg font-semibold">
          Código Escaneado: {scannedCode}
        </p>
      )}

      {/* ⚠️ Errores */}
      {error && (
        <p className="mt-4 p-2 bg-red-200 text-red-800 rounded text-lg font-semibold">
          Error: {error}
        </p>
      )}
    </div>
  );
}
