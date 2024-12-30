# 1) Scegli un’immagine Python ufficiale, con la versione che ti serve
FROM python:3.11.4-slim

# 2) Imposta la cartella di lavoro
WORKDIR /app

# 3) Copia il contenuto del tuo progetto (inclusi i file .py e requirements.txt) in /app
COPY . .

# 4) Installa le dipendenze
# --no-cache-dir evita di salvare i file di build nella cache (immagine più piccola)
RUN pip install --no-cache-dir -r requirements.txt

# 5) Espone la porta (a scopo documentativo; Railway userà $PORT ma è buona prassi esporre)
EXPOSE 8000

# 6) Avvia Gunicorn
#   - Sostituisci "code_base:app" con "NOME_FILE:app" se il file si chiama diversamente 
#   - Se usi Flask, in code_base.py hai: app = Flask(__name__)
#   - Se usi FastAPI, in code_base.py hai: app = FastAPI()
#
#   NOTA: Gunicorn ascolterà sulla porta 8000; Railway redirige $PORT verso 8000 automaticamente
CMD ["gunicorn", "code_base:app", "--bind", "0.0.0.0:8000"]
