import React, { useState, useRef } from "react";
import { View, ScrollView, Text, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const scrollViewRef = useRef<ScrollView>(null); // ✅ Referencia para el ScrollView

  // Simulación de enviar mensaje
  const sendMessage = (message: string) => {
    if (!message.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { text: message, sender: "user" }]);

    // Desplazar al final después de que React actualice el estado
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulación de respuesta del bot
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Esto es una respuesta automática del bot.", sender: "bot" },
      ]);

      // Desplazar de nuevo al recibir respuesta
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);

    setInput(""); // Limpiar input después de enviar
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* ✅ Preguntas rápidas (SOLO SI NO HAY MENSAJES) */}
      {messages.length === 0 && (
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Preguntas Rápidas</Text>
          <View className="flex-row flex-wrap">
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                className="bg-blue-500 p-2 rounded-lg m-1"
                onPress={() => sendMessage(question)}
              >
                <Text className="text-white text-sm">{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ✅ Área de mensajes con desplazamiento automático */}
      <ScrollView
        ref={scrollViewRef} // 🔹 Asignamos la referencia
        className="flex-1 mb-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })} // 🔹 Auto-scroll al actualizar
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-3 my-1 rounded-lg max-w-[80%] ${
              msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-300 self-start"
            }`}
          >
            <Text className={`${msg.sender === "user" ? "text-white" : "text-black"}`}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* ✅ Input para escribir mensajes */}
      <View className="px-4 pb-3" style={{ paddingBottom: insets.bottom + 10 }}>
        <View
          className="flex-row items-center bg-white p-2 shadow-md"
          style={{
            borderRadius: 30, // Hace que el contenedor sea redondeado
            elevation: 3, // Sombra en Android
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4, // Sombra en iOS
          }}
        >
          <TextInput
            className="flex-1 bg-gray-100 p-3 text-black"
            style={{
              borderRadius: 25, // Bordes redondeados para el input
            }}
            placeholder="Escribe un mensaje..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
          />
          <TouchableOpacity
            className="bg-blue-500 px-4 py-3 ml-2"
            style={{
              borderRadius: 20, // Botón redondeado
            }}
            onPress={() => sendMessage(input)}
          >
            <Text className="text-white font-bold">Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
