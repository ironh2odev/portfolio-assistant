from fastapi import APIRouter, Query
from llama_index.core import load_index_from_storage, StorageContext

router = APIRouter()

# Load pre-created index
storage_context = StorageContext.from_defaults(persist_dir="mock_index")
index = load_index_from_storage(storage_context)
query_engine = index.as_query_engine()

@router.get("/sentiment")
def get_sentiment_analysis(symbols: str = Query("AAPL,GOOG")):
    """
    Uses LlamaIndex query engine to summarize sentiment for the provided symbols.
    """
    symbol_list = [sym.strip().upper() for sym in symbols.split(",")]
    query = f"Summarize the recent market sentiment for: {', '.join(symbol_list)}"

    response = query_engine.query(query)

    return {symbol: {"summary": str(response)} for symbol in symbol_list}
