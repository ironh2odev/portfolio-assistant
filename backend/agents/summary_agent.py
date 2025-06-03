# backend/agents/summary_agent.py

import os
import openai
from typing import Dict

openai.api_key = os.getenv("OPENAI_API_KEY")

class AISummaryAgent:
    def __init__(self, analysis_result: Dict):
        self.analysis_result = analysis_result

    def generate_summary(self) -> str:
        messages = [
            {"role": "system", "content": "You are a financial advisor AI that explains portfolio performance in simple, actionable language."},
            {"role": "user", "content": f"Summarize this portfolio:\n\n{self.analysis_result}"}
        ]

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=300
            )
            return response.choices[0].message["content"].strip()
        except Exception as e:
            print("OpenAI Summary Error:", str(e))
            return "⚠️ Summary unavailable at the moment. Please try again later."
