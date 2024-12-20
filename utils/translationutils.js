import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import fs from 'fs';

const client = new DocumentProcessorServiceClient();

const projectId = 'myflightproject'; 
const location = 'us'; 
const processorId = 'acb78b0f787e9ccc'; 

export async function processDocument(filePath) {
  try {
    const documentContent = fs.readFileSync(filePath);

    const request = {
      name: `projects/${projectId}/locations/${location}/processors/${processorId}`,
      rawDocument: {
        content: documentContent,
        mimeType: 'application/pdf',
      },
    };

    const [result] = await client.processDocument(request);

    const documentText = result.document.text;

    console.log('Document processed successfully:', documentText);
    return documentText; // Return the processed text
  } catch (error) {
    console.error('Error processing document:', error);
    throw new Error('Failed to process the document');
  }
}
