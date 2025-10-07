import { explainCode, type ExplainCodeInput } from "@/ai/flows/explain-code-flow";

export async function explainCodeAction(input: ExplainCodeInput) {
  try {
    const result = await explainCode(input);
    return { success: true, explanation: result.explanation };
  } catch (error: any) {
    console.error('Error in explainCodeAction:', error);
    const errorMessage = error.message && error.message.toLowerCase().includes('api key') 
      ? 'La clave de API de Gemini no es válida o no se ha configurado. Asegúrate de añadirla como variable de entorno `GEMINI_API_KEY` en tu proyecto de Vercel y en un archivo .env.local para desarrollo.'
      : 'Ha ocurrido un error al contactar con la IA. Por favor, inténtalo de nuevo más tarde.';
    return { success: false, error: errorMessage };
  }
}
