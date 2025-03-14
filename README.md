# Medication Tracker

Este proyecto es una aplicación para el seguimiento de medicación, desarrollada con una arquitectura de frontend y backend. La aplicación permite a los usuarios buscar información sobre medicamentos de manera rápida y sencilla, ya sea mediante el escaneo de un código QR o a través de un buscador de texto. Además, los usuarios pueden registrar un medicamento y su dosis, ya sea de forma esporádica o como parte de un tratamiento recurrente, lo que les permite llevar un control preciso de su medicación. La aplicación también ofrece una vista detallada del historial de medicamentos tomados en un día específico, facilitando el seguimiento diario del tratamiento.



Para mejorar la accesibilidad, la aplicación cuenta con un asistente virtual integrado, que guía a los usuarios en el uso de la aplicación, aunque sin proporcionar asesoramiento médico. También ofrece servicios de comunicación por voz, lo que permite a los usuarios interactuar con la plataforma sin necesidad de utilizar la interfaz táctil, mejorando la accesibilidad para personas con dificultades visuales o motoras.



Además, la experiencia de usuario (UX) está diseñada para ser intuitiva y sin esfuerzo, asegurando que cualquier persona, independientemente de su condición médica o edad, pueda utilizar la aplicación de manera sencilla y efectiva. También se incluyen funcionalidades dirigidas a profesionales sanitarios, quienes pueden añadir pacientes, monitorizar su consumo de medicamentos y revisar datos clínicos relevantes, permitiéndoles brindar un mejor seguimiento y control de los tratamientos prescritos.



## Tecnologías Utilizadas



- **Frontend**: React Native, Expo, TypeScript, TailwindCSS

- **Backend**: FastAPI, MongoDB, Typesense

- **Otros**: Docker, Pipenv



## Estructura del Proyecto



- **frontend**: Contiene el código del frontend de la aplicación.

    - `components/`: Componentes reutilizables de la interfaz de usuario.

    - `screens/`: Pantallas principales de la aplicación.

    - `hooks/`: Hooks personalizados.

    - `app/`: Configuración de la aplicación y archivos de entrada.

    - `global.css`: Estilos globales utilizando TailwindCSS.

    - `package.json`: Dependencias y scripts del proyecto frontend.

    - `Dockerfile`: Configuración de Docker para el frontend.

    - `.dockerignore`: Archivos y carpetas a ignorar por Docker.



- **backend**: Contiene el código del backend de la aplicación.

    - `app/`: Código fuente del backend.

    - `crud/`: Operaciones CRUD para la base de datos.

    - `routes/`: Rutas de la API.

    - `schemas/`: Esquemas de datos utilizando Pydantic.

    - `services/`: Servicios externos y lógica de negocio.

    - `utils/`: Utilidades y funciones auxiliares.

    - `Pipfile`: Dependencias del proyecto backend.

    - `Dockerfile`: Configuración de Docker para el backend.

    - `.dockerignore`: Archivos y carpetas a ignorar por Docker.



- **docker-compose.yml**: Configuración de Docker Compose para orquestar los servicios del proyecto.



## Instalación y Ejecución



### Requisitos Previos



- Docker y Docker Compose

- Node.js y npm

- Python 3.13 y Pipenv



### Pasos para Ejecutar el Proyecto



1. **Clonar el repositorio**:

    ```sh

    git clone https://github.com/pabloseijo/Medication-Tracker.git

    cd Medication-Tracker

    ```



2. **Configurar el entorno**:

    Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

    ```env

    MONGO_URI=mongodb://mongo:27017

    DATABASE_NAME=medication_tracker

    TYPESENSE_API_KEY=your_typesense_api_key

    SECRET_KEY=your_secret_key

    ```



3. **Iniciar los servicios con Docker Compose en segundo plano**:

    ```sh

    sudo docker-compose up --build -d

    ```



4. **Iniciar el frontend**:

    ```sh

    cd frontend

    npm install

    npx expo start --clear

    ```



5. **Acceder a la aplicación**:

    - Frontend: [http://localhost:8081](http://localhost:8081)

    - Backend: [http://localhost:8000](http://localhost:8000)



## Funcionalidades



Medication Tracker ofrece una serie de funcionalidades diseñadas para facilitar el seguimiento de la medicación, asegurando una experiencia fluida y accesible para todos los usuarios:



- **Escaneo de Códigos QR y Barras**  

  Permite a los usuarios obtener información de un medicamento escaneando su código QR o código de barras con la cámara del dispositivo.



- **Búsqueda Inteligente de Medicamentos**  

  Los usuarios pueden buscar medicamentos manualmente a través de un buscador de texto avanzado, accediendo a información detallada sobre cada uno.



- **Registro y Seguimiento de Medicación**  

  Los usuarios pueden registrar medicamentos y su dosis, ya sea como una **toma esporádica** o como parte de un **tratamiento recurrente**, asegurando un control preciso.



- **Historial de Medicación**  

  Se puede visualizar un **registro detallado de los medicamentos tomados en un día determinado**, facilitando el monitoreo del cumplimiento del tratamiento.



- **Asistente Virtual Integrado**  

  La aplicación incluye un asistente virtual que guía a los usuarios en el uso de la plataforma, mejorando la accesibilidad. *(Nota: No ofrece asesoramiento médico).*



- **Notificaciones y Recordatorios de Medicación** *(En desarrollo)*  

  Sistema de alertas y notificaciones para recordar la toma de medicamentos dentro de un rango de tiempo predefinido.



- **Funcionalidades para Profesionales Sanitarios**  

  Los profesionales de la salud pueden **añadir pacientes a la plataforma, monitorizar su consumo de medicamentos y acceder a sus datos clínicos relevantes**, permitiendo un mejor seguimiento de los tratamientos.



- **Comunicación por Voz**  

  La aplicación cuenta con **servicios de comunicación por voz**, facilitando la interacción sin necesidad de usar la pantalla táctil, especialmente útil para personas mayores o con dificultades motoras.



Cada una de estas funcionalidades ha sido diseñada para mejorar la adherencia al tratamiento y garantizar que tanto pacientes como profesionales sanitarios puedan gestionar la medicación de forma sencilla y eficiente.  



## Mejoras Futuras



A medida que Medication Tracker evoluciona, estamos explorando nuevas funcionalidades para mejorar la experiencia de los usuarios y la gestión de la medicación. Entre las principales mejoras planeadas, se incluyen:



### 🔹Integración con Sistemas de Salud (SERGAS y similares)

Se planea conectar la aplicación con sistemas de salud públicos y privados, como **SERGAS**, para automatizar procesos clave:

- **Sincronización automática de recetas médicas**, permitiendo a los pacientes recibir directamente sus tratamientos en la app.

- **Actualización de informes clínicos**, permitiendo a los profesionales sanitarios un acceso más eficiente al historial del paciente.

- **Carga automática de dosis y calendario de medicación**, eliminando la necesidad de introducir manualmente los tratamientos.



### 🔹Implementación de Alertas Inteligentes

Mejoraremos el sistema de recordatorios con alertas escalonadas para asegurar que los pacientes tomen sus medicamentos a tiempo:

- **Asignación de una franja horaria flexible** para la toma de cada medicamento.

- **Notificaciones progresivas**, comenzando con un recordatorio suave y aumentando su insistencia hasta que el usuario confirme la toma.

- **Alarmas de emergencia** si el tiempo límite de la toma se supera, con sonidos distintivos o alertas visuales para mayor efectividad.



### 🔹Uso de Inteligencia Artificial para Análisis de Medicación

Queremos incorporar modelos de **Machine Learning** que ayuden a mejorar la adherencia al tratamiento y detectar posibles problemas, como:

- **Interacciones entre medicamentos**, alertando al usuario antes de que pueda haber un efecto adverso.

- **Ajuste de horarios de toma** basado en los hábitos del paciente y optimización de la efectividad del medicamento.

- **Detección de olvidos recurrentes**, avisando al paciente o a un contacto de emergencia si se detectan múltiples omisiones.

- **Sugerencias de reposición de medicamentos**, recordando con antelación cuándo recargar el stock antes de que se agoten.



Estas mejoras están en nuestra hoja de ruta y esperamos implementarlas en futuras versiones de la aplicación. 🚀💊





## Contribuciones



Las contribuciones son bienvenidas. Por favor, sigue los pasos a continuación para contribuir:



1. Haz un fork del repositorio.

2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).

3. Realiza los cambios necesarios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).

4. Sube los cambios a tu fork (`git push origin feature/nueva-funcionalidad`).

5. Abre un Pull Request en el repositorio original.



## Licencia



Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.



## Contacto



Para cualquier consulta o sugerencia, por favor contacta a [pabloseijo](https://github.com/pabloseijo).
