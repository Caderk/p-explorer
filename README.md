# Deployment instructions

To build and deploy, navigate to the project directory (same diretory as docker-compose.yml) and run:

```bash
docker-compose up --build
```

Database population might take some time, but once its done you should be able to visit:
http://localhost:5173/items to access the application.

To stop and remove containers and volumes just run:
```bash
docker-compose down -v
```