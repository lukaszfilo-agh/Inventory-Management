# Use an official Python runtime as a parent image
FROM python:3.12.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY api/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI app code into the container
COPY api/ .

# Expose port 8000 for the FastAPI app
EXPOSE 8000

# Command to run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]