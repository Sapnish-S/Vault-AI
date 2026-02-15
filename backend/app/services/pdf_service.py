import pdfplumber
from pathlib import Path

class PDFProcessor:
    def __init__(self, chunking_service):
        self.chunking_service= chunking_service
    def process_pdf(self, file_path: str, domain: str) -> list[dict]:
        all_structured_chunks=[]
        source_filename= Path(file_path).name

        # We will now use "with" to ensure the PDF is closed correctly
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                '''we will add 1 in page number as it will start from 0, but we
                as humans starts counting at 1.'''
                page_number= i+1

                #1. Extract the raw text from the 'page' object
                raw_text= page.extract_text()
                #Skip empty/image only pages
                if not raw_text or not raw_text.strip():
                    continue

                # Here now we start chunking
                chunks= self.chunking_service.create_chunks(raw_text)

                for chunk_content in chunks:
                    payload={
                        "content":chunk_content,
                        "metadata":{
                            "source":source_filename,
                            "page": page_number,
                            "domain": domain
                        }
                    }
                    all_structured_chunks.append(payload)

        return  all_structured_chunks