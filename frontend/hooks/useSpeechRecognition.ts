import { useState, useEffect } from "react";

let recognition: any = null;
if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // 🔹 Sigue escuchando hasta que lo detengas
    recognition.interimResults = false; // 🔹 Solo guarda resultados finales
    recognition.lang = "es-ES";
}

const useSpeechRecognition = () => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);
    let timeoutId: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            console.log("onresult event: ", event);

            // 🔹 Tomamos solo el último resultado disponible y lo sobreescribimos
            const lastResultIndex = event.results.length - 1;
            const lastTranscript = event.results[lastResultIndex][0].transcript;
            setText(lastTranscript);

            // 🔹 Reiniciar el temporizador cada vez que se recibe un resultado
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                console.log("No se detectó voz en 3 segundos. Deteniendo reconocimiento...");
                stopListening();
            }, 3000);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event);
            stopListening();
        };

        recognition.onend = () => {
            if (isListening) {
                recognition.start(); // 🔹 Reactivar si el usuario no lo ha detenido
            }
        };

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isListening]);

    const startListening = () => {
        setText(""); // 🔹 Limpia el campo antes de empezar
        setIsListening(true);
        recognition.start();

        // 🔹 Iniciar el temporizador cuando empieza a escuchar
        timeoutId = setTimeout(() => {
            console.log("No se detectó voz en 3 segundos. Deteniendo reconocimiento...");
            stopListening();
        }, 3000);
    };

    const stopListening = () => {
        setIsListening(false);
        recognition.stop();

        // 🔹 Limpiar el temporizador si se detiene manualmente
        if (timeoutId) clearTimeout(timeoutId);
    };

    return {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
    };
};

export default useSpeechRecognition;
