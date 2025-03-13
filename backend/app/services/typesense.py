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
        delete_medications_collection()
        print(f"La colección '{collection_name}' ya existe. No se creará nuevamente.")
    
    schema = {
        "name": collection_name,
        "fields": [
            {"name": "name", "type": "string"},
        ]
    }
    client.collections.create(schema)
    print(f"Creada la colección '{collection_name}' exitosamente.")
    
    # Insertar medicamentos
    insert_meds()

def delete_medications_collection():
    try:
        client.collections["medications"].delete()
        print("La colección 'medications' ha sido eliminada.")
    except Exception as e:
        print(f"Error al eliminar la colección: {e}")

def insert_meds():
    medications = [
        {"name": "Paracetamol"},
        {"name": "Ibuprofeno"},
        {"name": "Amoxicilina"},
        {"name": "Omeprazol"},
        {"name": "Metformina"},
        {"name": "Acenocumarol"},
        {"name": "Adalimumab"},
        {"name": "Ácido Acetilsalicílico"},
        {"name": "Ácido Zoledrónico"},
        {"name": "Atorvastatina"},
        {"name": "Amlodipino"},
        {"name": "Amiodarona"},
        {"name": "Azitromicina"},
        {"name": "Budesonida"},
        {"name": "Carbamazepina"},
        {"name": "Cefalexina"},
        {"name": "Ceftriaxona"},
        {"name": "Ciprofloxacino"},
        {"name": "Claritromicina"},
        {"name": "Clonazepam"},
        {"name": "Clopidogrel"},
        {"name": "Codeína"},
        {"name": "Dabigatrán"},
        {"name": "Diclofenaco"},
        {"name": "Diltiazem"},
        {"name": "Diosmina"},
        {"name": "Doxiciclina"},
        {"name": "Duloxetina"},
        {"name": "Enalapril"},
        {"name": "Escitalopram"},
        {"name": "Esomeprazol"},
        {"name": "Etoricoxib"},
        {"name": "Fentanilo"},
        {"name": "Fluconazol"},
        {"name": "Furosemida"},
        {"name": "Gabapentina"},
        {"name": "Glibenclamida"},
        {"name": "Hidroxicloroquina"},
        {"name": "Insulina Glargina"},
        {"name": "Lansoprazol"},
        {"name": "Latanoprost"},
        {"name": "Levodopa/Carbidopa"},
        {"name": "Levotiroxina"},
        {"name": "Loratadina"},
        {"name": "Losartán"},
        {"name": "Metotrexato"},
        {"name": "Metronidazol"},
        {"name": "Mometasona"},
        {"name": "Naproxeno"},
        {"name": "Nifedipino"},
        {"name": "Oxicodona"},
        {"name": "Pantoprazol"},
        {"name": "Perindopril"},
        {"name": "Pregabalina"},
        {"name": "Quetiapina"},
        {"name": "Rivaroxabán"},
        {"name": "Rosuvastatina"},
        {"name": "Sertralina"},
        {"name": "Sildenafilo"},
        {"name": "Simvastatina"},
        {"name": "Spironolactona"},
        {"name": "Tamsulosina"},
        {"name": "Tramadol"},
        {"name": "Valsartán"},
        {"name": "Venlafaxina"},
        {"name": "Warfarina"},
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
