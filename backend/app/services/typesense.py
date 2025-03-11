import typesense

from app.utils.config import TYPESENSE_CONFIG


client = typesense.Client({
    "nodes": [{"host": TYPESENSE_CONFIG["host"], "port": TYPESENSE_CONFIG["port"], "protocol": TYPESENSE_CONFIG["protocol"]}],
    "api_key": TYPESENSE_CONFIG["api_key"],
    "connection_timeout_seconds": 5
})


# Crear la colección de medicamentos en Typesense si no existe
def create_meds_collection():
    collection_name = "medications"

    # Obtener la lista de colecciones existentes
    existing_collections = [col["name"] for col in client.collections.retrieve()]

    if collection_name in existing_collections:
        print(f"La colección '{collection_name}' ya existe. No se creará nuevamente.")
        return

    schema = {
        "name": collection_name,
        "fields": [
            {"name": "name", "type": "string"},
        ]
    }

    client.collections.create(schema)
    print(f"Creada la colección '{collection_name}' exitosamente.")
    insert_meds()

def insert_meds():
    medications = [
        {"name": "Paracetamol"},
        {"name": "Ibuprofeno"},
        {"name": "Amoxicilina"},
        {"name": "Omeprazol"},
        {"name": "Metformina"}
    ]
    
    try:
        client.collections["medications"].documents.import_(medications, {'action': 'upsert'})
        print("Medicamentos insertados correctamente en la colección.")
    except Exception as e:
        print(f"Error al insertar medicamentos: {e}")


# Función para buscar medicamentos con autocompletado
def search_medications(query: str):
    search_parameters = {
      'q'         : query,
      'query_by'  : 'name',
      "prefix": True  # Permite autocompletado
    }

    result = client.collections['medications'].documents.search(search_parameters)
    return result
