import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import * as Speech from 'expo-speech';

const API_URL = "http://localhost:8000/messages"; // Reemplaza con la URL de tu API

const quickQuestions = [
  "¿Cómo añado un nuevo medicamento?",
  "¿Cómo configuro recordatorios para mis tomas?",
  "¿Puedo ver un historial de mis medicamentos?",
  "¿Cómo edito o elimino un medicamento?",
];

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(""); 
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // Hook de reconocimiento de voz
  const { text, isListening, startListening, stopListening, hasRecognitionSupport } =
    useSpeechRecognition();

  // 🔹 Cuando el reconocimiento de voz detecta texto, solo actualiza el input
  useEffect(() => {
    if (text) {
      setInput(text); // 📝 Solo escribe el texto en el input, no lo envía
    }
  }, [text]);

  // Función para enviar mensaje
  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { text: input, sender: "user" }]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      //  Enviar mensaje a la API
      const response = await fetch(API_URL, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input, author: "user" }),
      });

      if (!response.ok) {
          throw new Error("Error al obtener la respuesta del chatbot");
      }

      // Obtener la respuesta del chatbot
      const data = await response.json();
      const botResponse: { text: string; sender: "user" | "bot" } = {
          text: data.text,
          sender: "bot",
      };

      // Agregar la respuesta del chatbot al estado
      setMessages((prevMessages) => [...prevMessages, botResponse]);

      // Reproducir la respuesta del bot en voz alta
      Speech.speak(botResponse.text, {
        language: 'es-ES', // Código de idioma para español de España
        pitch: 1.0,        // Tono de la voz
        rate: 1.0,         // Velocidad de la voz
      });      

      // Si se produce un error ponemos un mensaje de error en el chat
    } catch (error) {
      console.error("Error al comunicarse con la API:", error);
      const botErrorResponse: { text: string; sender: "user" | "bot" } = {
          text: "Lo siento, no pude procesar tu solicitud.",
          sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botErrorResponse]);

      // Reproducir el mensaje de error en voz alta
      Speech.speak(botErrorResponse.text, {
        language: 'es-ES', // Código de idioma para español de España
        pitch: 1.0,        // Tono de la voz
        rate: 1.0,         // Velocidad de la voz
      });      
  }

    setInput(""); // 🔹 Limpiar el input después de enviar
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* ✅ Preguntas rápidas */}
      {messages.length === 0 && (
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Preguntas Rápidas</Text>
          <View className="flex-row flex-wrap">
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                className="bg-blue-500 p-2 rounded-lg m-1"
                onPress={() => {setInput(question); console.log("Input: ", question)}} // 🔹 Llena el input en lugar de enviar
              >
                <Text className="text-white text-sm">{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ✅ Área de mensajes */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 mb-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-3 my-1 rounded-lg max-w-[80%] ${
              msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-300 self-start"
            }`}
          >
            <Text className={msg.sender === "user" ? "text-white" : "text-black"}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* ✅ Input + Botón de Enviar + Micrófono */}
      <View className="px-4 pb-3" style={{ paddingBottom: insets.bottom + 10 }}>
        <View
          className="flex-row items-center bg-white p-2 shadow-md"
          style={{
            borderRadius: 30,
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          {/* Input de texto */}
          <TextInput
            className="flex-1 bg-gray-100 p-3 text-black"
            style={{ borderRadius: 25 }}
            placeholder="Escribe un mensaje..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage} // 🔹 Presionar "Enter" envía el mensaje
            returnKeyType="send"
          />

          {/* Botón de micrófono (si el dispositivo lo soporta) */}
          {hasRecognitionSupport && (
            <TouchableOpacity onPress={isListening ? stopListening : startListening} className="ml-2">
              <Ionicons name={isListening ? "mic-off" : "mic"} size={24} color="gray" />
            </TouchableOpacity>
          )}

          {/* Botón de enviar */}
          <TouchableOpacity
            className="bg-blue-500 px-4 py-3 ml-2"
            style={{ borderRadius: 20 }}
            onPress={sendMessage} // 🔹 Ahora el mensaje solo se envía al presionar
          >
            <Text className="text-white font-bold">Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;