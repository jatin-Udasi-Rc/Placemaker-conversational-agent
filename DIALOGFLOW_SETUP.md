# PlaceMakers Conversational Chat - Dialogflow Integration

This project integrates Google Cloud Dialogflow with a Next.js application to create a conversational AI assistant for PlaceMakers.

## Prerequisites

1. **Google Cloud Project**: You need access to the Google Cloud project `commerce-tools-b2b-services`
2. **Dialogflow Agent**: The conversational agent should be configured at:
   ```
   https://conversational-agents.cloud.google.com/projects/commerce-tools-b2b-services/locations/global/agents/56b4b974-11cf-49e9-bc74-99643d260250/
   ```

## Setup Instructions

### 1. Install Dependencies

```bash
cd placemakers-conversational-chat
npm install
```

### 2. Service Account Configuration

**IMPORTANT SECURITY NOTE:**
Service account keys contain sensitive credentials and should NEVER be committed to version control. The `service-account-key.json` file is already added to `.gitignore` to prevent accidental commits.

**Option A: Using Service Account Key File (Recommended for Local Development Only)**

1. Download the service account key file from Google Cloud Console
2. Place it in the project root as `service-account-key.json` (this file is gitignored)
3. Make sure the service account has "Dialogflow API Client" role
4. Use the provided `service-account-key.example.json` as a template

**Option B: Using Environment Variables (Recommended for Production)**

1. Create a `.env.local` file with (this file is gitignored):
   ```
   GOOGLE_PROJECT_ID=commerce-tools-b2b-services
   GOOGLE_CLIENT_EMAIL=your-service-account@commerce-tools-b2b-services.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   ```

2. Update the API route to use environment variables instead of the key file

### 3. Configure Dialogflow API Route

The API route is located at `src/app/api/chat/route.ts`. By default, it uses:
- Project ID: `commerce-tools-b2b-services`
- Service Account Key: `./service-account-key.json`

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Features

- **Conversational UI**: Beautiful chat interface matching PlaceMakers branding
- **Dialogflow Integration**: Real-time communication with your Dialogflow agent
- **Intent Recognition**: Shows detected intents and confidence scores (in development mode)
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error handling for API failures

## Project Structure

```
placemakers-conversational-chat/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts      # Dialogflow API integration
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       ├── ChatInterface.tsx      # Main chat component
│       └── Navbar.tsx            # PlaceMakers navigation
├── package.json
├── tailwind.config.ts
├── service-account-key.json      # (Add this file, gitignored)
└── service-account-key.example.json  # Template for service account key
```

## API Endpoint

The chat API is available at `/api/chat` and accepts POST requests with:

```json
{
  "message": "User's message text"
}
```

Response format:
```json
{
  "message": "Dialogflow response text",
  "intent": "detected.intent.name",
  "confidence": 0.95,
  "parameters": {},
  "products": []
}
```

## Customization

### Adding Product Integration

To integrate with a product catalog, modify the API route to:
1. Parse Dialogflow parameters for product-related queries
2. Call your product search API
3. Return products in the response

### Extending Intents

Configure additional intents in your Dialogflow agent:
- Product search intents
- Store location intents
- Order status intents
- Technical support intents

## Troubleshooting

### Common Issues

1. **Authentication Error**: Ensure your service account key is valid and has proper permissions
2. **Project ID Mismatch**: Verify the project ID matches your Dialogflow agent
3. **CORS Issues**: The API route handles CORS automatically for Next.js
4. **GitHub Push Protection**: If you accidentally commit the service account key file, GitHub will block the push due to security concerns. To resolve:
   - Remove the file from git tracking with `git rm --cached service-account-key.json`
   - Add the file to `.gitignore`
   - Commit these changes
   - For more details, see [GitHub's documentation on push protection](https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line#resolving-a-blocked-push)

### Debug Mode

In development mode, the chat interface shows:
- Detected intent names
- Confidence scores
- Detailed error messages

## Deployment

For production deployment:
1. Use environment variables instead of service account key files
2. Set up proper security headers
3. Configure session management for multi-user support
4. Implement rate limiting

## Support

For questions about the Dialogflow integration, refer to:
- [Dialogflow Documentation](https://cloud.google.com/dialogflow/docs)
- [Google Cloud Client Libraries](https://cloud.google.com/nodejs/docs/reference/dialogflow/latest)
