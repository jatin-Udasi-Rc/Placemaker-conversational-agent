import { NextRequest, NextResponse } from 'next/server';
import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { v4 as uuidv4 } from 'uuid';
import { extractProductsFromDialogflowResponse, extractTextFromDialogflowResponse, Product } from '../../utils/dialogflowParser';

// Initialize the Dialogflow CX session client
let sessionClient: SessionsClient;

try {
  // Create credentials object from environment variables
  const credentials = {
    type: process.env.GOOGLE_CLIENT_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
  };

  // Initialize using the credentials object
  sessionClient = new SessionsClient({
    credentials: credentials,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  });
} catch (error) {
  console.error('Failed to initialize Dialogflow client:', error);
  console.error('Please ensure all Google Cloud environment variables are set correctly');
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (!sessionClient) {
      return NextResponse.json(
        { error: 'Dialogflow client not initialized. Please check your credentials.' },
        { status: 500 }
      );
    }

    // Generate a unique session ID for each conversation
    // In production, you might want to maintain sessions per user
    const sessionId = uuidv4();
    
    // Use the project ID from environment variables
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'commerce-tools-b2b-services';
    
    // Create the session path for Dialogflow CX
    // Format: projects/PROJECT_ID/locations/LOCATION/agents/AGENT_ID/sessions/SESSION_ID
    const agentId = '56b4b974-11cf-49e9-bc74-99643d260250'; // Your agent ID
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'global';
    const sessionPath = `projects/${projectId}/locations/${location}/agents/${agentId}/sessions/${sessionId}`;

    // Create the request object for Dialogflow CX
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
        },
        languageCode: 'en', // Dialogflow CX uses 'en' instead of 'en-US'
      },
      // Add query parameters to request more products
      queryParams: {
        parameters: {
          fields: {
            max_products: {
              numberValue: 5, // Request 5 products
              kind: 'numberValue'
            }
          }
        }
      },
    };

    console.log('Sending request to Dialogflow:', {
      sessionId,
      projectId,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
    });

    // Send the request to Dialogflow
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Extract the response text and products using utility functions
    let responseMessage = 'I apologize, but I couldn\'t process your request right now.';
    let products: Product[] = [];
    
    if (result?.responseMessages && result.responseMessages.length > 0) {
      // Extract text response
      responseMessage = extractTextFromDialogflowResponse(result.responseMessages);
      
      // Extract products from rich content
      products = extractProductsFromDialogflowResponse(result.responseMessages);
      
      console.log(`Extracted ${products.length} products from response`);
    }

    // You can also extract other information from the response
    const intent = result?.intent?.displayName;
    const parameters = result?.parameters;
    const confidence = result?.intentDetectionConfidence;

    // Return the response
    return NextResponse.json({
      message: responseMessage,
      intent,
      actualResponse: result?.responseMessages,
      parameters,
      confidence,
      products, // Return the extracted products from rich content
    });

  } catch (error) {
    console.error('Error calling Dialogflow API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process your request. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
