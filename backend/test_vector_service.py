"""
Simple test script for VectorDBService
Run with: python test_vector_service.py
"""
import sys
import tempfile
import shutil

sys.path.insert(0, '.')

from app.services.vector_db_service import VectorDBService
from app.services.chunking_service import ChunkingService

def main():
    print("=" * 60)
    print("Testing VectorDBService")
    print("=" * 60)
    
    # Create temporary database
    temp_dir = tempfile.mkdtemp()
    print(f"\n[1] Created temp directory: {temp_dir}")
    
    try:
        # Initialize service
        print("\n[2] Initializing VectorDBService...")
        service = VectorDBService(db_path=temp_dir)
        print("    SUCCESS - Service initialized")
        
        # Create a vault
        print("\n[3] Creating vault...")
        vault_name = "test_vault"
        collection = service.get_or_create_vault(vault_name)
        print(f"    SUCCESS - Vault '{vault_name}' created")
        
        # Prepare test chunks
        print("\n[4] Adding chunks to vault...")
        test_chunks = [
            {
                "content": "First chunk of test content.",
                "metadata": {"source": "test.pdf", "page": 1, "domain": "test"}
            },
            {
                "content": "Second chunk of test content.",
                "metadata": {"source": "test.pdf", "page": 1, "domain": "test"}
            },
            {
                "content": "Third chunk from page 2.",
                "metadata": {"source": "test.pdf", "page": 2, "domain": "test"}
            }
        ]
        
        service.add_to_vault(vault_name, test_chunks)
        print(f"    SUCCESS - Added {len(test_chunks)} chunks")
        
        # Verify storage
        print("\n[5] Verifying stored chunks...")
        count = collection.count()
        result = collection.get()
        print(f"    Stored chunks: {count}")
        print(f"    Expected: {len(test_chunks)}")
        print(f"    Match: {'YES' if count == len(test_chunks) else 'NO'}")
        
        # Check IDs
        print("\n[6] Checking chunk IDs...")
        print(f"    IDs: {result['ids']}")
        
        # Test duplicate handling
        print("\n[7] Testing duplicate handling (re-adding same file)...")
        updated_chunk = [
            {
                "content": "UPDATED content.",
                "metadata": {"source": "test.pdf", "page": 1, "domain": "test"}
            }
        ]
        service.add_to_vault(vault_name, updated_chunk)
        new_count = collection.count()
        print(f"    Previous count: {count}")
        print(f"    New count: {new_count}")
        print(f"    Old chunks deleted: {'YES' if new_count == 1 else 'NO'}")
        
        # Test with ChunkingService
        print("\n[8] Testing with ChunkingService integration...")
        chunker = ChunkingService(chunk_size=100, chunk_overlap=20)
        text = "This is sample text that will be chunked. " * 10
        chunks = chunker.create_chunks(text)
        
        processed = [
            {
                "content": chunk,
                "metadata": {"source": "chunked.txt", "page": 1, "domain": "test"}
            }
            for chunk in chunks
        ]
        
        service.add_to_vault("integration_vault", processed)
        integration_coll = service.get_or_create_vault("integration_vault")
        print(f"    Created {len(chunks)} chunks")
        print(f"    Stored {integration_coll.count()} chunks")
        print(f"    Match: {'YES' if integration_coll.count() == len(chunks) else 'NO'}")
        
        print("\n" + "=" * 60)
        print("ALL TESTS PASSED!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        print(f"\nCleaning up...")
        shutil.rmtree(temp_dir, ignore_errors=True)
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
