// Utility functions for parsing Dialogflow CX responses

// Define types for Dialogflow response structures
type DialogflowValue = {
  stringValue?: string;
  numberValue?: number;
  boolValue?: boolean;
  structValue?: { fields: Record<string, DialogflowValue> };
  listValue?: { values: DialogflowValue[] };
  kind?: string;
};

// This type is compatible with the actual Dialogflow response structure
// Using a more flexible type to accommodate the Dialogflow response structure
type DialogflowResponseMessage = any;

// More specific type for internal use
interface DialogflowTextResponse {
  responseType?: string;
  text?: { text?: string[] };
}

interface DialogflowPayloadResponse {
  responseType?: string;
  payload?: { fields?: Record<string, DialogflowValue> };
};

export interface Product {
  id: string;
  title: string;
  description: string;
  product_url: string;
  image_url: string;
  availability: boolean;
  unit_of_measure: string;
  keywords: string[];
  delivery_options: string[];
  categories: Array<Array<{ name: string; id: string }>>;
}

/**
 * Recursively extracts string value from nested Dialogflow structure
 */
function extractStringValue(field: DialogflowValue | undefined): string | undefined {
  if (!field) return undefined;
  
  if (typeof field === 'string') return field;
  if (field.stringValue) return field.stringValue;
  if (field.kind === 'stringValue' && field.stringValue) return field.stringValue;
  
  return undefined;
}

/**
 * Recursively extracts boolean value from nested Dialogflow structure
 */
function extractBoolValue(field: DialogflowValue | undefined): boolean | undefined {
  if (!field) return undefined;
  
  if (typeof field === 'boolean') return field;
  if (field.boolValue !== undefined) return field.boolValue;
  if (field.kind === 'boolValue' && field.boolValue !== undefined) return field.boolValue;
  
  return undefined;
}

/**
 * Recursively extracts array values from nested Dialogflow structure
 */
function extractListValue(field: DialogflowValue | undefined): DialogflowValue[] {
  if (!field) return [];
  
  if (Array.isArray(field)) return field;
  if (field.listValue && field.listValue.values) return field.listValue.values;
  if (field.kind === 'listValue' && field.listValue && field.listValue.values) return field.listValue.values;
  
  return [];
}

/**
 * Extracts struct/object values from nested Dialogflow structure
 */
function extractStructValue(field: DialogflowValue | undefined): Record<string, DialogflowValue> | undefined {
  if (!field) return undefined;
  
  if (field.structValue && field.structValue.fields) return field.structValue.fields;
  if (field.kind === 'structValue' && field.structValue && field.structValue.fields) return field.structValue.fields;
  
  return undefined;
}

/**
 * Parses categories from the nested Dialogflow structure
 */
function parseCategories(categoriesField: DialogflowValue | undefined): Array<Array<{ name: string; id: string }>> {
  const categoryValues = extractListValue(categoriesField);
  
  return categoryValues.map(categoryGroup => {
    const groupValues = extractListValue(categoryGroup);
    return groupValues.map(category => {
      const categoryStruct = extractStructValue(category);
      return {
        name: extractStringValue(categoryStruct?.name) || 'Unknown',
        id: extractStringValue(categoryStruct?.id) || 'unknown'
      };
    });
  });
}

/**
 * Parses keywords from the nested Dialogflow structure
 */
function parseKeywords(keywordsField: DialogflowValue | undefined): string[] {
  const keywordValues = extractListValue(keywordsField);
  return keywordValues.map(keyword => extractStringValue(keyword)).filter((keyword): keyword is string => keyword !== undefined);
}

/**
 * Extracts a single product from a Dialogflow rich content item
 */
function extractProductFromItem(item: DialogflowValue): Product | null {
  try {
    // Extract the main item structure
    const itemStruct = extractStructValue(item);
    if (!itemStruct) return null;

    // Check if it's a product info type
    const itemType = extractStringValue(itemStruct.type);
    if (itemType !== 'info') return null;

    // Extract metadata
    const metadataStruct = extractStructValue(itemStruct.metadata);
    if (!metadataStruct) return null;

    // Extract all product fields
    const title = extractStringValue(metadataStruct.title) || extractStringValue(itemStruct.title) || 'Product';
    const description = extractStringValue(itemStruct.subtitle) || 'No description available';
    const product_url = extractStringValue(metadataStruct.url) || extractStringValue(itemStruct.actionLink) || '#';
    const image_url = extractStringValue(metadataStruct.image_url) || '';
    const availability = extractBoolValue(metadataStruct.availability) ?? true;
    const unit_of_measure = extractStringValue(metadataStruct.unit_of_measure) || 'each';
    const keywords = parseKeywords(metadataStruct.keywords);
    const categories = parseCategories(metadataStruct.categories);

    // Generate unique ID
    const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      title,
      description,
      product_url,
      image_url,
      availability,
      unit_of_measure,
      keywords,
      delivery_options: ['courier', 'clickAndCollect'], // Default delivery options
      categories,
    };
  } catch (error) {
    console.error('Error extracting product from item:', error);
    return null;
  }
}

/**
 * Main function to extract all products from Dialogflow CX response messages
 */
export function extractProductsFromDialogflowResponse(responseMessages: DialogflowResponseMessage[]): Product[] {
  const products: Product[] = [];

  try {
    if (!Array.isArray(responseMessages)) {
      console.log('Response messages is not an array');
      return products;
    }

    // Find all payload responses with rich content
    const payloadResponses = responseMessages.filter(msg => 
      msg && msg.responseType === 'HANDLER_PROMPT' && msg.payload?.fields?.richContent
    );

    if (payloadResponses.length === 0) {
      console.log('No payload responses with rich content found');
      return products;
    }

    console.log(`Found ${payloadResponses.length} payload responses with rich content`);

    // Process each payload response
    payloadResponses.forEach((payloadResponse, responseIndex) => {
      // Extract rich content from the nested structure
      const richContentField = payloadResponse.payload?.fields.richContent;
      const richContentValues = extractListValue(richContentField);

      console.log(`Response ${responseIndex}: Rich content values length:`, richContentValues.length);

      // Navigate through the nested structure
      richContentValues.forEach((contentGroup: DialogflowValue, groupIndex: number) => {
        const contentGroupValues = extractListValue(contentGroup);
        
        console.log(`Response ${responseIndex}, Group ${groupIndex}: Found ${contentGroupValues.length} items`);
        
        contentGroupValues.forEach((item: DialogflowValue, itemIndex: number) => {
          console.log(`Processing item ${responseIndex}-${groupIndex}-${itemIndex}`);
          
          const product = extractProductFromItem(item);
          if (product) {
            console.log(`Successfully extracted product: ${product.title} (ID: ${product.id})`);
            products.push(product);
          }
        });
      });
    });

    console.log(`Total products extracted: ${products.length}`);
    return products;

  } catch (error) {
    console.error('Error extracting products from Dialogflow response:', error);
    return products;
  }
}

/**
 * Extracts the text response from Dialogflow CX response messages
 */
export function extractTextFromDialogflowResponse(responseMessages: DialogflowResponseMessage[]): string {
  if (!Array.isArray(responseMessages)) {
    return 'I apologize, but I couldn\'t process your request right now.';
  }

  // Find the first text response in responseMessages
  const textResponse = responseMessages.find(msg => 
    msg && msg.responseType === 'HANDLER_PROMPT' && 
    msg.text && Array.isArray(msg.text.text) && msg.text.text.length > 0
  ) as DialogflowTextResponse | undefined;

  if (textResponse?.text?.text?.[0]) {
    return textResponse.text.text[0];
  }

  return 'I apologize, but I couldn\'t process your request right now.';
}
