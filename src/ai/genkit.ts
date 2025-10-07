// This file is the single source of truth for the Genkit AI singleton.
// Please do not use any other AI instance in the app.
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
});
