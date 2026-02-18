from backend.llm import load_llm
from backend.prompts.analyzer_prompt import analyzer_prompt

model = load_llm()



def analyze_resume_service(resume_context:str):
    prompt = analyzer_prompt.invoke(
        {"resume_context":resume_context}
    )
    response = model.invoke(prompt)
    return response.content