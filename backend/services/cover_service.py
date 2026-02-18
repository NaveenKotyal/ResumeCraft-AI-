# services/cover_service.py

from backend.llm  import load_llm
from backend.prompts.cover_prompt import cover_prompt

model = load_llm()

def generate_cover_letter_service(
    resume_context: str,
    job_description: str
):

    prompt = cover_prompt.invoke({
        "resume_context": resume_context,
        "job_description": job_description
    })

    response = model.invoke(prompt)

    return response.content
