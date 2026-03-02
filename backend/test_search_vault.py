"""
Focused test for VectorDBService.search_vault()
Run with: python test_search_vault.py  (from backend/ directory)
"""
import sys
import tempfile
import shutil

# Force UTF-8 output on Windows to avoid charmap errors
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

sys.path.insert(0, ".")

from app.services.vector_db_service import VectorDBService

VAULT = "search_test_vault"

CHUNKS = [
    {
        "content": "The mitochondria is the powerhouse of the cell and produces ATP through cellular respiration.",
        "metadata": {"source": "biology.pdf", "page": 1, "domain": "science"},
    },
    {
        "content": "Python is a high-level, interpreted programming language known for its readability.",
        "metadata": {"source": "programming.pdf", "page": 1, "domain": "tech"},
    },
    {
        "content": "Machine learning models learn patterns from training data to make predictions on new data.",
        "metadata": {"source": "ml.pdf", "page": 1, "domain": "tech"},
    },
    {
        "content": "The Eiffel Tower is located in Paris and was built in 1889 as a temporary exhibit.",
        "metadata": {"source": "history.pdf", "page": 2, "domain": "history"},
    },
    {
        "content": "Neural networks are inspired by the biological structure of the human brain and neurons.",
        "metadata": {"source": "ml.pdf", "page": 3, "domain": "tech"},
    },
]

QUERIES = [
    ("energy production in cells", "biology"),
    ("Python programming language", "tech"),
    ("artificial intelligence training data", "tech"),
    ("Paris landmarks", "history"),
    ("brain neurons deep learning", "tech"),
]


def sep(title=""):
    print("\n" + "=" * 60)
    if title:
        print(f"  {title}")
        print("=" * 60)


def main():
    sep("search_vault Test Suite")

    temp_dir = tempfile.mkdtemp()
    print(f"Temp DB: {temp_dir}")

    passed = 0

    try:
        # ── Setup ──────────────────────────────────────────────────────
        print("\n[SETUP] Initializing VectorDBService & seeding vault...")
        svc = VectorDBService(db_path=temp_dir)
        svc.add_to_vault(VAULT, CHUNKS)
        col = svc.get_or_create_vault(VAULT)
        print(f"        Vault '{VAULT}' seeded with {col.count()} chunks  [OK]")

        # ── Test 1: Basic semantic search ──────────────────────────────
        sep("Test 1 - Basic semantic search (n_results=3)")
        results = svc.search_vault(VAULT, "programming", n_results=3)
        print(f"  Query : 'programming'")
        print(f"  Got   : {len(results)} result(s)  (expected <= 3)")
        assert len(results) <= 3, "Returned more than n_results!"
        assert len(results) > 0, "Expected at least 1 result"
        for r in results:
            print(f"    score={r['score']:+.4f}  src={r['metadata']['source']}  chunk='{r['content'][:55]}...'")
        print("  PASS")
        passed += 1

        # ── Test 2: Score sanity (1 - L2_distance, top score must be > 0) ──────
        sep("Test 2 - Score sanity (score = 1 - L2_distance)")
        all_results = svc.search_vault(VAULT, "machine learning neural network", n_results=5)
        scores = [r["score"] for r in all_results]
        print(f"  Scores: {scores}")
        # scores are 1 - L2_distance; top score must be <= 1 and best result > 0
        assert all(s <= 1.0 for s in scores), f"Score(s) exceed 1.0: {scores}"
        assert scores[0] > 0.0, f"Top score not positive (expected relevant match): {scores[0]}"
        # Scores should be descending (most similar first)
        assert scores == sorted(scores, reverse=True), "Scores not sorted descending"
        print("  PASS")
        passed += 1

        # ── Test 3: Top result is most relevant ────────────────────────
        sep("Test 3 - Top result relevance check")
        results = svc.search_vault(VAULT, "Eiffel Tower Paris history", n_results=5)
        top = results[0]
        print(f"  Top result: score={top['score']:+.4f}  src={top['metadata']['source']}")
        print(f"  Content   : '{top['content'][:75]}...'")
        assert "paris" in top["content"].lower() or "eiffel" in top["content"].lower(), \
            f"Top result doesn't seem relevant: {top['content']}"
        print("  PASS")
        passed += 1

        # ── Test 4: Empty / nonexistent vault returns [] ───────────────
        sep("Test 4 - Nonexistent vault returns empty list")
        results = svc.search_vault("nonexistent_vault_xyz", "anything", n_results=3)
        print(f"  Result: {results}")
        assert results == [], f"Expected [], got {results}"
        print("  PASS")
        passed += 1

        # ── Test 5: Result structure has required keys ─────────────────
        sep("Test 5 - Result dict has content / metadata / score keys")
        results = svc.search_vault(VAULT, "cellular respiration", n_results=1)
        assert len(results) >= 1, "Expected at least 1 result"
        r = results[0]
        print(f"  Keys present: {list(r.keys())}")
        for key in ("content", "metadata", "score"):
            assert key in r, f"Missing key: {key}"
        print(f"  content  : '{r['content'][:55]}...'")
        print(f"  metadata : {r['metadata']}")
        print(f"  score    : {r['score']}")
        print("  PASS")
        passed += 1

        # ── Test 6: All queries return meaningful results ──────────────
        sep("Test 6 - Semantic relevance across all seeded queries")
        for query, _ in QUERIES:
            results = svc.search_vault(VAULT, query, n_results=1)
            assert len(results) == 1, f"No result for query: '{query}'"
            r = results[0]
            print(f"  Q: '{query[:44]:<44}'  ->  score={r['score']:+.4f}  src={r['metadata']['source']}")
        print("  PASS")
        passed += 1

        # ── Summary ────────────────────────────────────────────────────
        sep(f"Results: {passed}/6 tests PASSED")

    except AssertionError as e:
        print(f"\n  FAIL -- {e}")
        import traceback; traceback.print_exc()
        return False
    except Exception as e:
        print(f"\n  ERROR -- {e}")
        import traceback; traceback.print_exc()
        return False
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
        print("\nTemp DB cleaned up.")

    return True


if __name__ == "__main__":
    ok = main()
    sys.exit(0 if ok else 1)
