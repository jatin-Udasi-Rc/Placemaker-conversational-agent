import { NextRequest, NextResponse } from 'next/server';
import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { v4 as uuidv4 } from 'uuid';

// Initialize the Dialogflow CX session client
let sessionClient: SessionsClient;

try {
  // Initialize using the environment variable that points to the service account key
  sessionClient = new SessionsClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  });
} catch (error) {
  console.error('Failed to initialize Dialogflow client:', error);
  console.error('Please ensure GOOGLE_APPLICATION_CREDENTIALS and GOOGLE_CLOUD_PROJECT_ID are set correctly');
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

    // Create the request object
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US', // or your preferred language
        },
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

    console.log('Dialogflow response:', {
      intent: result?.intent?.displayName,
      fulfillmentText: result?.fulfillmentText?.substring(0, 100),
    });

    // Extract the response text
    const responseMessage = result?.fulfillmentText || 'I apologize, but I couldn\'t process your request right now.';

    // You can also extract other information from the response
    const intent = result?.intent?.displayName;
    const parameters = result?.parameters;
    const confidence = result?.intentDetectionConfidence;

    // Return the response
    return NextResponse.json({
      message: responseMessage,
      intent,
      parameters,
      confidence,
      // For now, we'll return empty products array since this is Dialogflow
      // You can enhance this later to integrate with your product catalog
      products: [],
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
