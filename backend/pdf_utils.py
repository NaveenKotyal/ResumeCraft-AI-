# pdf_utils.py

from langchain_community.document_loaders import PyPDFLoader
import tempfile
import os

async def extract_pdf_text(file):

    # Read file asynchronously
    contents = await file.read()

    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(contents)
        path = tmp.name

    # Load PDF
    loader = PyPDFLoader(path)
    docs = loader.load()

    text = "\n\n".join(
        [d.page_content for d in docs]
    )

    os.remove(path)

    return text
