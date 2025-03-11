import typesense

from app.utils.config import TYPESENSE_CONFIG


client = typesense.Client({
    "nodes": [{"host": TYPESENSE_CONFIG["host"], "port": TYPESENSE_CONFIG["port"], "protocol": TYPESENSE_CONFIG["protocol"]}],
    "api_key": TYPESENSE_CONFIG["api_key"],
    "connection_timeout_seconds": 5
})



# Crear la colección de medicamentos en Typesense
def create_meds_collection():
    schema = {
        "name": "medications",
        "fields": [
            {"name": "name", "type": "string"},
        ]
    }
    client.collections.create(schema)


# Función para buscar medicamentos con autocompletado
def search_medications(query: str):
    search_parameters = {
      'q'         : query,
      'query_by'  : 'name',
      "prefix": True  # Permite autocompletado
    }

    result = client.collections['medications'].documents.search(search_parameters)
    return result['hits']
