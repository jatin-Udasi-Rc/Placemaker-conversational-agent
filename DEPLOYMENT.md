# PlaceMakers Conversational Chat - Deployment Guide

This document provides instructions for deploying the PlaceMakers Conversational Chat application to a production environment.

## Prerequisites

1. **Node.js**: Version 16.x or higher
2. **Google Cloud Project**: Access to the Google Cloud project `commerce-tools-b2b-services`
3. **Dialogflow Agent**: The conversational agent should be configured

## Environment Variables Setup

For security reasons, this application uses environment variables instead of service account key files for authentication. You'll need to set up the following environment variables in your deployment environment:

### Required Environment Variables

```
# Google Cloud Project Settings
GOOGLE_CLOUD_PROJECT_ID=commerce-tools-b2b-services
GOOGLE_CLOUD_LOCATION=global

# Search Engine Settings
SEARCH_ENGINE_ID=test-chat_1758026836631
SEARCH_DATA_STORE_ID=placemakers-poc-tahsin_1757690914822

# Service Account Credentials
GOOGLE_CLIENT_TYPE=service_account
GOOGLE_PROJECT_ID=commerce-tools-b2b-services
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@commerce-tools-b2b-services.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
GOOGLE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40commerce-tools-b2b-services.iam.gserviceaccount.com
GOOGLE_UNIVERSE_DOMAIN=googleapis.com
```

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

### 3. Start the Application

```bash
npm start
```

## Deployment Options

### Option 1: Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy the application

### Option 2: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t placemakers-chat .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 --env-file .env placemakers-chat
   ```

### Option 3: Traditional Server Deployment

1. Set up a Node.js environment on your server
2. Clone the repository
3. Install dependencies and build the application
4. Use a process manager like PM2 to run the application:
   ```bash
   npm install -g pm2
   pm2 start npm --name "placemakers-chat" -- start
   ```

## Security Considerations

1. **Environment Variables**: Ensure that environment variables containing sensitive information are properly secured in your deployment environment
2. **HTTPS**: Configure HTTPS for all traffic to the application
3. **Rate Limiting**: Consider implementing rate limiting to prevent abuse
4. **Monitoring**: Set up monitoring and logging to track application performance and errors

## Troubleshooting

### Common Deployment Issues

1. **Authentication Errors**: Ensure all Google Cloud environment variables are correctly set
2. **CORS Issues**: If deploying to a different domain, ensure CORS is properly configured
3. **Memory Issues**: If the application is running out of memory, consider increasing the memory allocation or implementing better memory management

## Support

For questions about deployment, please contact the development team.
