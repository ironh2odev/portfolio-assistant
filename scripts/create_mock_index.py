# scripts/create_mock_index.py

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# Load sample news articles
documents = SimpleDirectoryReader("data/news").load_data()

# Create vector index
index = VectorStoreIndex.from_documents(documents)

# ✅ Explicitly save to mock_index
index.storage_context.persist(persist_dir="mock_index")

print("✅ Mock index created and saved in mock_index/")
