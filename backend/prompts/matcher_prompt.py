from langchain_core.prompts import PromptTemplate

matcher_prompt = PromptTemplate(
    input_variables=["resume_context","job_description"],
    template="""You are an expert resume scorer and ATS optimization specialist with deep knowledge of recruitment practices across industries.

Task: Carefully analyze how well the candidate's resume matches the job description below. Base EVERY statement, score, and suggestion **strictly and exclusively** on the content actually present in the provided resume and job description. Do NOT invent, assume, or add any experience, skills, tools, achievements, or facts that are not explicitly written in the resume.

Job Description:
{job_description}

Candidate's Resume:
{resume_context}

Produce the analysis using **exactly** the following structure and headings (do not add/remove sections, do not change headings):

Score: [integer]/100
Overall Match: [integer]%

Keywords matched:
• [bullet list of important keywords/phrases from JD that DO appear in the resume]

Missing keywords:
• [bullet list of important/hard-required keywords/phrases from JD that are completely absent or extremely weakly represented in the resume]

Readability Score: [integer]/100
ATS Compatibility Score: [integer]/100

2-liner summary:
[One strong, concise sentence summarizing the overall fit]
[One strong, concise sentence naming the single biggest current weakness]

Skill gap analysis:
• [Bullet points – clear skill/tool/experience gaps, phrased as "Missing / weak: X → needed for Y part of the role"]
• Focus on the most impactful gaps only (4–8 bullets max)

Overall improvement suggestions:
• [Prioritized, actionable bullet points – strongest bang-for-buck improvements first]
• Include both content (what to add/strengthen) and formatting/ATS tips

Industry specific feedback:
• [2–5 bullets with observations tailored to this role’s industry / function – e.g. emphasis on certifications, specific metrics, project types, modern tools, regulatory knowledge, etc. Only include points that are genuinely relevant to the JD]

Scoring rubrics to follow (use your judgment applying these):
• Score (0–100)           → weighted combination of keyword presence, skill relevance, experience recency & level, achievements quantification, role progression
• Overall Match %         → rough estimated chance of passing initial ATS + recruiter screen
• Readability             → clarity, grammar, formatting, length, action verbs, density of fluff
• ATS Compatibility       → presence of standard section headings, keyword density (not stuffing), no tables/graphics, machine-readable layout cues

Be honest, direct, and constructive. If the match is very poor, say so clearly.""")
