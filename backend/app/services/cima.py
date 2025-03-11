import requests
import PyPDF2
import os

# Ejemplo: 47178 (Actron Compuesto)


def obtener_medicamento_por_codigo(codigo_nacional):
    """
    Obtiene el JSON con la información de un medicamento a partir de su código nacional.
    """
    url = f"https://cima.aemps.es/cima/rest/medicamento?nregistro={codigo_nacional}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None


def obtener_medicamento_por_nombre(nombre):
    """
    Obtiene el JSON con la información de un medicamento a partir de su nombre.
    """
    url = f"https://cima.aemps.es/cima/rest/medicamento?nombre={nombre}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None


def mostrar_FichaTecnica(codigo_nacional):
    """
    Muestra los primeros 1000 caracteres de la ficha técnica de un medicamento a partir de su código nacional.
    """
    url = f"https://cima.aemps.es/cima/rest/medicamento?nregistro={codigo_nacional}"
    response = requests.get(url)
    if response.status_code == 200:
        medicamento = response.json()
        ficha_tecnica_url = medicamento["docs"][0]["url"]

        # Descargar el PDF de la ficha técnica
        pdf_response = requests.get(ficha_tecnica_url)
        pdf_path = f"FT_{codigo_nacional}.pdf"
        with open(pdf_path, "wb") as pdf_file:
            pdf_file.write(pdf_response.content)

        # Leer el contenido del PDF
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            texto = ""
            for page in reader.pages:
                texto += page.extract_text()

        # Eliminar el archivo PDF descargado
        os.remove(pdf_path)

        return texto[:1000]
    else:
        return None


def mostrar_Prospecto(codigo_nacional):
    """
    Muestra los primeros 1000 caracteres del prospecto de un medicamento a partir de su código nacional.
    """
    url = f"https://cima.aemps.es/cima/rest/medicamento?nregistro={codigo_nacional}"
    response = requests.get(url)
    if response.status_code == 200:
        medicamento = response.json()
        ficha_tecnica_url = medicamento["docs"][1]["url"]

        # Descargar el PDF de la ficha técnica
        pdf_response = requests.get(ficha_tecnica_url)
        pdf_path = f"FT_{codigo_nacional}.pdf"
        with open(pdf_path, "wb") as pdf_file:
            pdf_file.write(pdf_response.content)

        # Leer el contenido del PDF
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            texto = ""
            for page in reader.pages:
                texto += page.extract_text()

        # Eliminar el archivo PDF descargado
        os.remove(pdf_path)

        return texto[:1000]
    else:
        return None


def obtener_url_fichatecnica(codigo_nacional):
    """
    Obtiene la URL de la ficha tecnica del medicamento utilizando la API de CIMA.
    """
    url = f"https://cima.aemps.es/cima/rest/medicamento?nregistro={codigo_nacional}"
    response = requests.get(url)
    if response.status_code == 200:
        medicamento = response.json()
        # Suponiendo que el prospecto es el segundo documento en la lista
        fichatecnica_url = medicamento["docs"][0]["url"]
        return fichatecnica_url
    else:
        return None


def obtener_url_prospecto(codigo_nacional):
    """
    Obtiene la URL del prospecto del medicamento utilizando la API de CIMA.
    """
    url = f"https://cima.aemps.es/cima/rest/medicamento?nregistro={codigo_nacional}"
    response = requests.get(url)
    if response.status_code == 200:
        medicamento = response.json()
        # Suponiendo que el prospecto es el segundo documento en la lista
        prospecto_url = medicamento["docs"][1]["url"]
        return prospecto_url
    else:
        return None


def extraer_apartado_conservacion(prospecto_url):
    """
    Extrae el contenido del apartado "5. Conservación de <medicamento>" del prospecto PDF.
    """
    # Descargar el PDF del prospecto
    pdf_response = requests.get(prospecto_url)
    pdf_path = "prospecto_temp.pdf"
    with open(pdf_path, "wb") as pdf_file:
        pdf_file.write(pdf_response.content)

    # Leer el contenido del PDF
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        texto = ""
        for page in reader.pages:
            texto += page.extract_text()

    # Eliminar el archivo PDF descargado
    os.remove(pdf_path)

    # Buscar todas las ocurrencias de "5. Conservación"
    ocurrencias = []
    inicio = 0
    while True:
        inicio = texto.find("5. Conservación", inicio)
        if inicio == -1:
            break
        ocurrencias.append(inicio)
        inicio += len(
            "5. Conservación"
        )  # Moverse al siguiente lugar después de la ocurrencia encontrada

    if len(ocurrencias) >= 2:
        # Tomamos la segunda ocurrencia de "5. Conservación"
        inicio_apartado = ocurrencias[1]
        # Buscar el inicio de la siguiente sección "6. Contenido"
        siguiente_seccion = texto.find("6. Contenido", inicio_apartado)
        if siguiente_seccion != -1:
            # Extraer el texto entre el inicio de la segunda aparición de "5. Conservación" y "6. Contenido"
            conservacion_texto = texto[inicio_apartado:siguiente_seccion].strip()
            return conservacion_texto
        else:
            # Si no se encuentra la siguiente sección, devolver el texto hasta el final
            conservacion_texto = texto[inicio_apartado:].strip()
            return conservacion_texto
    else:
        return "No se encontró el segundo apartado 5 'Conservación' en el prospecto."
