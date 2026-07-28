FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (needed for compiling some python packages like bcrypt, numpy)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend files
COPY . .

# Expose port (Render/Railway use PORT env var, typically default to 8000 if not set)
EXPOSE 8000

# Run uvicorn (Render sets the PORT environment variable)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
