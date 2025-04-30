# WhatsApp Business API Microservice

This microservice provides a containerized solution for running the WhatsApp Business API client and managing your WhatsApp Business account.

## Prerequisites

- Docker and Docker Compose installed
- WhatsApp Business API account
- Phone number certificate (.pem file)
- WhatsApp Business API access token

## Setup

1. Create a `.env` file in the root directory with the following variables:
   ```
   WHATSAPP_PHONE_NUMBER=your_phone_number
   WHATSAPP_DISPLAY_NAME=your_display_name
   WHATSAPP_ACCESS_TOKEN=your_access_token
   WEBHOOK_URL=your_webhook_url
   WEBHOOK_VERIFY_TOKEN=your_verify_token
   ```

2. Place your WhatsApp Business API certificate in the `whatsapp/certificates` directory as `certificate.pem`

3. Start the services:
   ```bash
   docker-compose up -d
   ```

## API Endpoints

### Admin Service (Port 3000)

- `GET /health` - Health check endpoint
- `GET /status` - Get WhatsApp account status
- `POST /upload-certificate` - Upload and verify certificate
  ```json
  {
    "certificate": "your-certificate-content"
  }
  ```
- `POST /send-test` - Send a test message
  ```json
  {
    "to": "recipient_phone_number",
    "message": "test message"
  }
  ```

### WhatsApp API Client (Port 8080)

The WhatsApp Business API client exposes the standard WhatsApp Business API endpoints as documented in the official API documentation.

## Monitoring

- Check the status of your WhatsApp account:
  ```bash
  curl http://localhost:3000/status
  ```

- Send a test message:
  ```bash
  curl -X POST http://localhost:3000/send-test \
    -H "Content-Type: application/json" \
    -d '{"to": "recipient_phone_number", "message": "test message"}'
  ```

## Troubleshooting

1. Check container logs:
   ```bash
   docker-compose logs whatsapp-api
   docker-compose logs whatsapp-admin
   ```

2. Verify certificate:
   ```bash
   curl -X POST http://localhost:3000/upload-certificate \
     -H "Content-Type: application/json" \
     -d '{"certificate": "your-certificate-content"}'
   ```

3. Check account status:
   ```bash
   curl http://localhost:3000/status
   ``` 