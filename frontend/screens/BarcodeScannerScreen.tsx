import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScannerScreen() {
  const videoRef = useRef(null);
  const [scannedCode, setScannedCode] = useState(null);
  const [error, setError] = useState(null);
  const [medData, setMedData] = useState(null);

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

        const selectedDeviceId = videoDevices[0].deviceId;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const scannedText = result.getText();
              setScannedCode(scannedText);
              const extractedCode = extractCodeFromURL(scannedText);
              if (extractedCode) {
                fetchMedData(extractedCode);
              }
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

  const extractCodeFromURL = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split("/").pop();
    } catch (err) {
      setError("URL inválida");
      return null;
    }
  };

  const fetchMedData = async (code) => {
    try {
      const response = await fetch(`http://localhost:8000/meds?code=${code}`);
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      const data = await response.json();
      setMedData(data);
    } catch (err) {
      setError("Error obteniendo datos del medicamento: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Escáner de Código de Barras</h2>
      <video ref={videoRef} autoPlay className="w-full max-w-md border-2 border-gray-300 rounded-lg shadow-lg" />

      {scannedCode && (
        <p className="mt-4 p-2 bg-green-200 text-green-800 rounded text-lg font-semibold">
          Código Escaneado: {scannedCode}
        </p>
      )}

      {medData && (
          <div className="mt-4 p-4 bg-blue-200 text-blue-800 rounded text-lg font-semibold">
          <p><strong>Medicamento:</strong> {medData.nombre}</p>
          <p><strong>Principios Activos:</strong> {medData.pactivos}</p>
          <p><strong>Laboratorio:</strong> {medData.labtitular}</p>
          <p><strong>Prescripción:</strong> {medData.cpresc}</p>
          <p><strong>Forma Farmacéutica:</strong> {medData.formaFarmaceutica?.nombre}</p>
          <p><strong>Vía de Administración:</strong> {medData.viasAdministracion?.map(via => via.nombre).join(", ")}</p>
          <p><strong>Información Adicional:</strong> <a href={medData.docs?.[0]?.urlHtml} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Ficha Técnica</a></p>
          {medData.fotos?.length > 0 && (
              <img src={medData.fotos[0].url} alt="Medicamento" className="mt-4 w-32 h-32 object-cover" />
          )}
          </div>
      )}
      {error && (
        <p className="mt-4 p-2 bg-red-200 text-red-800 rounded text-lg font-semibold">
          Error: {error}
        </p>
      )}
    </div>
  );
}
