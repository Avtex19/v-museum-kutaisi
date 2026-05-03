FROM python:3.12-slim

# შემოგვაქვს uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# სამუშაო საქაღალდე
WORKDIR /app

# ოპტიმიზაციები
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ფაილების კოპირება
COPY pyproject.toml uv.lock ./

# 1. ჯერ ვქმნით requirements.txt ფაილს
# 2. მერე ვაინსტალირებთ სისტემურად
RUN uv export --frozen --format requirements-txt > requirements.txt && \
    uv pip install --system -r requirements.txt

# პროექტის კოდის კოპირება
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]