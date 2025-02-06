# Use an official Python runtime as a parent image.
FROM python:3.10-slim

# Set the working directory in the container.
WORKDIR /app

# Copy requirements.txt and install dependencies.
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code.
COPY populate_db.py /app/

# Run the Python script.
CMD ["python", "populate_db.py"]
