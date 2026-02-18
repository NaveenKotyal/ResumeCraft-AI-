# services/chat_service.py

from backend.llm  import load_llm
from backend.prompts.chat_prompt import chat_template
from backend.redis_client import redis_client
from langchain_core.messages import HumanMessage, AIMessage
import json

model = load_llm()

def career_chat_service(user, resume_context, question):

    key = f"chat:{user}"

    history_json = redis_client.get(key)

    history = json.loads(history_json) if history_json else []

    messages = chat_template.format_messages(
        resume_context=resume_context,
        question=question
    )

    full_conversation = history + messages

    response = model.invoke(full_conversation)

    history.append(HumanMessage(content=question).dict())
    history.append(AIMessage(content=response.content).dict())

    redis_client.set(key, json.dumps(history))

    return response.content
