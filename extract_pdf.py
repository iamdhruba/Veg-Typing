from pypdf import PdfReader
reader = PdfReader('Unicode Key Map.pdf')
text = ''.join(page.extract_text() + '\n' for page in reader.pages)
with open('pdf_text.txt', 'w', encoding='utf-8') as f:
    f.write(text)
