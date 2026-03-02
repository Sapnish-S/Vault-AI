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

    def search_vault(self, vault_name:str, query_text:str, n_results: int=5):
        try:
            # Access the specific vault
            collection= self.get_or_create_vault(vault_name)

            #Perform the semantic search
            results= collection.query(
                query_texts=[query_text],
                n_results=n_results
            )
            # We have to turn nested list into a clean list of dicts
            formatted_results=[]
            # results['documents'][0] contains the text
            # results['metadatas'][0] contains the source/page
            # results['distances'][0] is the "distance" (lower = more similar)
            list_of_docs= results['documents'][0]
            list_of_metadatas= results['metadatas'][0]
            list_of_dists= results['distances'][0]
            if not results['documents'] or not results['documents'][0]:
                return []
            for doc, meta, dist in zip(list_of_docs, list_of_metadatas, list_of_dists):
                formatted_results.append({
                    "content": doc,
                    "metadata": meta,
                    "score": round(1-dist,4)
                })
            return formatted_results

        except Exception as e:
            print(f"Search failed:{e}")
            return[]
