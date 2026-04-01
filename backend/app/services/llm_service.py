import os
from gpt4all import GPT4All

class LLMService:
    def __init__(self, model_name="Llama-3.2-1B-Instruct-Q4_0.gguf"):
        # Create a directory locally inside the backend to store the downloaded model
        model_dir = os.path.join(os.getcwd(), "models")
        os.makedirs(model_dir, exist_ok=True)
        print(f"Loading local model {model_name} into {model_dir}...")
        
        # This will securely download the model to the 'models' directory if it doesn't already exist.
        # It runs completely offline after the initial download and is optimized for CPU inference!
        self.model = GPT4All(model_name=model_name, model_path=model_dir, allow_download=True)
        print("Local LLM Service initialized successfully.")
        
    def generate_answer(self, query: str, context: str) -> str:
        try:
            if not context:
                return "I don't have any relevant context to answer this query."
                
            system_prompt = f"""You are a secure AI assistant for Vault AI. Answer the user's question based strictly on the provided context retrieved from their secure documents.
If the context does not contain the answer, say "I cannot find the answer to that in your documents." Keep answers concrete and short.

Context: 
{context}"""
            
            with self.model.chat_session(system_prompt=system_prompt):
                # The generate method natively handles chat templating within a session
                response = self.model.generate(query, max_tokens=256, temp=0.1)
                
            return response.strip()
        except Exception as e:
            print(f"LLM Generation Error: {e}")
            return "An error occurred while generating a response."

    def generate_chat_title(self, query: str) -> str:
        try:
            prompt = f"Summarize the following user query in 3 to 4 words. Do not include quotes, periods, or extra text.\n\nQuery: {query}"
            with self.model.chat_session(system_prompt="You are a helpful assistant that summarizes text concisely."):
                response = self.model.generate(prompt, max_tokens=10, temp=0.3)
            title = response.strip().replace('"', '').replace("'", "")
            return title[:50]
        except Exception as e:
            print(f"Title Generation Error: {e}")
            return query[:30] + '...' if len(query) > 30 else query
