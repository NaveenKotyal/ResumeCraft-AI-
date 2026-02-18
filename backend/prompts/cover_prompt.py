from langchain_core.prompts import PromptTemplate

cover_prompt = PromptTemplate(
    input_variables=["resume_context","job_description"],
    template="""Write a professional, compelling cover letter (300–450 words) tailored specifically to the job description below.

Emphasize the candidate's most relevant experience, skills, achievements and qualifications that directly match or exceed the job requirements.
Use concrete examples from the resume where possible.
Show enthusiasm for the role and company without fabricating information.
Structure the letter in standard business format:
- Header (date, employer's contact if known, or just salutation)
- Opening paragraph: state the position and how you found it + brief why you're a strong fit
- 1–2 body paragraphs: highlight strongest matching qualifications with evidence
- Closing paragraph: reiterate interest, call to action, thanks

Job Description:
{job_description}

Candidate's Resume:
{resume_context}

Do not invent any experience, skills or facts not present in the resume.""")
