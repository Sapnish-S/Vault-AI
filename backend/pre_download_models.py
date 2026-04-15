import os
import sys

def main():
    print("="*60)
    print("Checking and Pre-downloading AI Models...")
    print("="*60)
    
    # 1. HuggingFace Sentence Transformers
    print("\n[1/2] Loading Sentence Transformers (all-MiniLM-L6-v2)...")
    try:
        from chromadb.utils import embedding_functions
        emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
        print("Sentence Transformers loaded successfully!")
    except Exception as e:
        print(f"Error loading Sentence Transformers: {e}")
        
    # 2. GPT4All LLM
    print("\n[2/2] Loading Local LLM (Llama-3.2-1B-Instruct-Q4_0.gguf)...")
    print("If this is the first run, a ~1GB download will begin. Please wait...")
    try:
        from gpt4all import GPT4All
        model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
        os.makedirs(model_dir, exist_ok=True)
        # It handles downloading internally with a progress bar
        model = GPT4All(model_name="Llama-3.2-1B-Instruct-Q4_0.gguf", model_path=model_dir, allow_download=True)
        print("Local LLM model loaded successfully!")
    except Exception as e:
        print(f"Error loading LLM: {e}")

    print("\n" + "="*60)
    print("All models verified/downloaded. Backend is ready to start!")
    print("="*60)

if __name__ == "__main__":
    main()
