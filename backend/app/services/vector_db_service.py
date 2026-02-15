import chromadb
import os
from pathlib import Path
from chromadb.utils import embedding_functions

class VectorDBService:
    def __init__(self, db_path:str= "data/chroma_db"):
        self.db_path= Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

        # Initializing the Persistent Client
        self.client= chromadb.PersistentClient(path=str(self.db_path))

        # Initializing the Embedding Function(This will translate)
        # We will be using a model that is small, fast and great for our use
        self.emb_fn= embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

    def get_or_create_vault(self, vault_name:str):
        ''' We pass our embedding function here os Chroma handles
         vectorization for us'''
        return self.client.get_or_create_collection(
            name= vault_name,
            embedding_function=self.emb_fn
        )
    def add_to_vault(self, vault_name:str, processed_chunks: list[dict]):
        collection= self.get_or_create_vault(vault_name)
        # Before adding, we find and delete everything from this specific file.
        # This prevents "ghost chunks" from old versions.
        source_file = processed_chunks[0]["metadata"]["source"]

        # We use a 'where' filter to target only the chunks from this file
        collection.delete(where={"source": source_file})
        print(f"Deleted existing entries for: {source_file}")

        ids=[]
        documents=[]
        metadatas=[]

        for i, chunk in enumerate(processed_chunks):
            '''We will set the ID as source_filename + chunk index (e.g, manual.pdf_0)'''
            file_name= chunk["metadata"]["source"]
            unique_id= f"{file_name}_chunk_{i}"
            ids.append(unique_id)
            documents.append(chunk["content"])
            metadatas.append(chunk["metadata"])

        #Now we batch everything together and add it to the vault in one call
        collection.add(
            ids= ids,
            documents= documents,
            metadatas= metadatas
        )
        print(f"SSuccessfully added {len(documents)} chunks to vault: {vault_name}")