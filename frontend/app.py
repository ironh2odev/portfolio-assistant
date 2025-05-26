import streamlit as st
import requests
import pandas as pd
import ast

st.set_page_config(page_title="Portfolio Assistant", layout="centered")

st.title("📊 Financial Portfolio Assistant")
st.markdown("Upload your portfolio or enter stock symbols to analyze.")

# --- CSV Upload ---
uploaded_file = st.file_uploader("📂 Upload Portfolio CSV (Symbol, Allocation)", type=["csv"])

symbols = ""
allocations = {}

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    if "Symbol" in df.columns and "Allocation" in df.columns:
        symbols = ",".join(df["Symbol"].astype(str).tolist())
        allocations = dict(zip(df["Symbol"], df["Allocation"]))
    else:
        st.error("CSV must have 'Symbol' and 'Allocation' columns.")
else:
    symbols = st.text_input("Enter stock symbols (comma-separated)", "AAPL,GOOG")

# --- Analyze Button ---
if st.button("📡 Analyze Portfolio"):
    params = {"symbols": symbols}
    if allocations:
        params["allocations"] = str(allocations)  # Send as stringified dict

    response = requests.get("http://localhost:8000/market", params=params)

    if response.status_code == 200:
        result = response.json()

        for symbol, data in result.items():
            st.markdown(f"### {symbol}")

            # Show prices
            st.markdown("**Price History (Last 5 days)**")
            price_df = pd.DataFrame(data["prices"])
            st.dataframe(price_df)

            # Risk metrics
            risk = data.get("risk", {})
            if risk:
                st.markdown("**📉 Risk Analysis**")
                st.metric("Sharpe Ratio", risk.get("sharpe_ratio", "N/A"))
                st.metric("Volatility", round(risk.get("volatility", 0) * 100, 2))
                st.metric("Max Drawdown", f"{round(risk.get('max_drawdown', 0) * 100, 2)}%")

            # Explanation
            if "explanation" in data:
                st.markdown("**🧠 Insight**")
                st.info(data["explanation"])

            # Rebalance suggestion
            if "rebalance_suggestion" in data:
                st.markdown("**🔄 Rebalance Tip**")
                st.warning(data["rebalance_suggestion"])

            st.markdown("---")
    else:
        st.error("❌ Failed to fetch data from backend.")
