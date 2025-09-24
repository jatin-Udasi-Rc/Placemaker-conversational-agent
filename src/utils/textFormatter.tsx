import React from 'react';

/**
 * Formats text response from Dialogflow into styled JSX
 * Converts bullet points and line breaks into proper HTML elements
 */
export function formatResponseText(text: string): React.ReactNode {
  if (!text) return null;

  // Split the text by lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  const formattedContent: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listIndex = 0;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Check if this line is a bullet point (starts with - or •)
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      // Remove the bullet point marker
      const listItem = trimmedLine.substring(2).trim();
      currentList.push(listItem);
    } else {
      // If we have accumulated list items, render them as a list
      if (currentList.length > 0) {
        formattedContent.push(
          <ul key={`list-${listIndex}`} className="space-y-2 mt-2 mb-3 text-sm">
            {currentList.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start space-x-2">
                <span className="text-accent mt-1 font-bold">•</span>
                <span className="text-gray-700 leading-relaxed flex-1">{item}</span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
        listIndex++;
      }
      
      // Add regular text as paragraph
      if (trimmedLine) {
        // Check if this looks like a heading (ends with colon)
        const isHeading = trimmedLine.endsWith(':');
        formattedContent.push(
          <p key={`text-${index}`} className={`leading-relaxed ${
            isHeading 
              ? 'font-semibold text-primary mb-1 text-sm' 
              : 'mb-2 text-sm'
          }`}>
            {trimmedLine}
          </p>
        );
      }
    }
  });

  // Handle any remaining list items
  if (currentList.length > 0) {
    formattedContent.push(
      <ul key={`list-${listIndex}`} className="space-y-2 mt-2 mb-3 text-sm">
        {currentList.map((item, itemIndex) => (
          <li key={itemIndex} className="flex items-start space-x-2">
            <span className="text-accent mt-1 font-bold">•</span>
            <span className="text-gray-700 leading-relaxed flex-1">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <div className="formatted-response">{formattedContent}</div>;
}

/**
 * Simple text formatter for cases where we just want to handle line breaks
 */
export function formatSimpleText(text: string): React.ReactNode {
  if (!text) return null;

  return text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
}
