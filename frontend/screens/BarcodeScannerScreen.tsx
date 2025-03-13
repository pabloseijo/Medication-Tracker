import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import MedicineForm from "../components/MedicineForm"; // Importamos el formulario

export default function BarcodeScannerScreen() {
  const videoRef = useRef(null);
  const [scannedCode, setScannedCode] = useState(null);
  const [error, setError] = useState(null);
  const [medData, setMedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medName, setMedName] = useState(""); // Estado para el nombre del medicamento

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
      
      // 🔹 Extraer la primera palabra del nombre
      const firstWord = data.nombre ? data.nombre.split(" ")[0] : "";
  
      setMedData(data);
      setMedName(data.nombre || ""); // Guardar el nombre del medicamento
    } catch (err) {
      setError("Error obteniendo datos del medicamento: " + err.message);
    }
  };
  
  const handleSave = async (medData: any) => {
    try {
      console.log("✅ Medicamento guardado correctamente.");
      setIsModalOpen(false); // Cerrar el modal después de guardar
    } catch (error) {
      console.error("❌ Error al guardar el medicamento:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* 🔹 Escáner */}
      <div className="flex flex-col items-center justify-center flex-none h-auto sticky top-0 bg-gray-100 z-10">
        <h2 className="text-xl font-bold mt-8 mb-4">Escáner de Código de Barras</h2>
        <div className="relative w-4/5 max-w-md flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-auto border-2 border-gray-300 rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* 🔹 Sección de información */}
      <div className="flex-grow overflow-y-auto px-4 pt-4">
        {scannedCode && (
          <p className="mb-4 p-2 bg-green-200 text-green-800 rounded text-lg font-semibold">
            Código Escaneado: {scannedCode}
          </p>
        )}

        {medData && (
          <div className="mb-16 p-4 bg-blue-200 text-blue-800 rounded-lg text-lg font-semibold shadow">
            <p><strong>Medicamento:</strong> {medData.nombre}</p>
            <p><strong>Principios Activos:</strong> {medData.pactivos}</p>
            <p><strong>Laboratorio:</strong> {medData.labtitular}</p>
            <p><strong>Prescripción:</strong> {medData.cpresc}</p>
            <p><strong>Forma Farmacéutica:</strong> {medData.formaFarmaceutica?.nombre}</p>
            <p><strong>Vía de Administración:</strong> {medData.viasAdministracion?.map(via => via.nombre).join(", ")}</p>
            <p>
              <strong>Información Adicional:</strong>
              <a href={medData.docs?.[0]?.urlHtml} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Ficha Técnica
              </a>
            </p>

            <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-800 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Añadir al formulario
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 p-2 bg-red-200 text-red-800 rounded text-lg font-semibold">
            Error: {error}
          </p>
        )}
      </div>

      {/* 🔹 Modal de `MedicineForm` */}
      {isModalOpen && (
        <MedicineForm 
          isVisible={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave}
          loadItemsForDay={async (day) => { /* Implement the function or pass the appropriate handler */ }}
          selectedMeal={"desayuno"}
          selectedDate={new Date()} // Pasa la fecha actual
        />
      )}
    </div>
  );
}
