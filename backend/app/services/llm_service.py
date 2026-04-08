import os
from gpt4all import GPT4All

class LLMService:
    def __init__(self, model_name="Llama-3.2-1B-Instruct-Q4_0.gguf"):
        # Create a directory locally inside the backend to store the downloaded model
        model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "models")
        os.makedirs(model_dir, exist_ok=True)
        print(f"Checking for model in {model_dir}... Loading into memory (this is not a download, just reading the local file)...")
        
        # This will securely download the model to the 'models' directory if it doesn't already exist.
        # It runs completely offline after the initial download and is optimized for CPU inference!
        self.model = GPT4All(model_name=model_name, model_path=model_dir, allow_download=True)
        print("Local LLM model successfully loaded into memory.")
        
    def generate_answer(self, query: str, context: str) -> str:
        try:
            if not context:
                return "I don't have any relevant context to answer this query."
                
            system_prompt = f"""You are a highly restricted, secure AI assistant for Vault AI. Your ONLY purpose is to extract and summarize information directly from the provided text below.
CRITICAL RULES:
1. DO NOT use your internal training data, internet links, or external knowledge under any circumstances.
2. If the user's question cannot be explicitly answered using ONLY the context below, you MUST say exactly: "I cannot find the answer to that in your documents."
3. If you find the answer, you MUST cite the exact source filename and page using exactly the [Source: ..., Page: ...] tags provided in the context.

Context Data: 
{context}"""
            
            with self.model.chat_session(system_prompt=system_prompt):
                # The generate method natively handles chat templating within a session
                response = self.model.generate(query, max_tokens=300, temp=0.01)
                
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
