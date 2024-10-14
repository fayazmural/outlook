# Email Synchronization

This project demonstrates a basic email synchronization system that fetches emails from an Outlook account and displays them in real-time on the web page. The system updates the email list in response to user actions within Outlook, such as marking emails as read or moving them to different folders.

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/outlook.git
   cd outlook
   ```

2. **Install Backend Dependencies**:

   If you're using a Node.js backend, you can install the required dependencies:

   ```bash
   npm install
   ```

3. **Set up Elasticsearch with Docker**:

   a. Make sure you have Docker and Docker Compose installed on your system.

   b. Create a `docker-compose.yml` file in the root of your project with the following content:

   ```yaml
   version: "3"
   services:
     elasticsearch:
       image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
       environment:
         - discovery.type=single-node
       ports:
         - 9200:9200
       volumes:
         - esdata:/usr/share/elasticsearch/data

   volumes:
     esdata:
       driver: local
   ```

   c. Start Elasticsearch:

   ```bash
   docker-compose up -d
   ```

   This command will download the Elasticsearch image and start it in detached mode.

   d. Verify that Elasticsearch is running:

   ```bash
   curl http://localhost:9200
   ```

   You should see a JSON response with Elasticsearch version information.

4. **Start the Backend**:

   If you are running a local Node.js server:

   ```bash
   npm run dev
   ```

5. **Run using Docker**:

   If you prefer to run the entire application using Docker:

   a. Build the Docker image:

   ```bash
   docker-compose build
   ```

   b. Start the application:

   ```bash
   docker-compose up
   ```

   This will start both your application and Elasticsearch in containers.

## Accessing the Application

Once the setup is complete and the server is running, you can access the application by opening a web browser and navigating to `http://localhost:3000` (or the appropriate port if you've configured it differently).

## Troubleshooting

- If you encounter any issues with Elasticsearch, make sure the Docker container is running:

  ```bash
  docker ps
  ```

- Check Elasticsearch logs:

  ```bash
  docker-compose logs elasticsearch
  ```

- If you need to reset Elasticsearch data, you can remove the volume and recreate it:

  ```bash
  docker-compose down -v
  docker-compose up -d
  ```

Remember to configure your application to connect to Elasticsearch at `http://localhost:9200` when running locally, or `http://elasticsearch:9200` when running inside Docker.
