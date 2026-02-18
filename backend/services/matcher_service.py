# services/matcher_service.py

from backend.llm  import load_llm
from backend.prompts.matcher_prompt import matcher_prompt

model = load_llm()

def match_jd_service(resume_context: str, job_description: str):

    prompt = matcher_prompt.invoke({
        "resume_context": resume_context,
        "job_description": job_description
    })

    response = model.invoke(prompt)

    return response.content
