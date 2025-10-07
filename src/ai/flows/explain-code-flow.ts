'use server';
/**
 * @fileOverview Un agente de IA que explica fragmentos de código.
 *
 * - explainCode - Una función que maneja el proceso de explicación del código.
 * - ExplainCodeInput - El tipo de entrada para la función explainCode.
 * - ExplainCodeOutput - El tipo de retorno para la función explainCode.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('El fragmento de código Python que se debe explicar.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z
    .string()
    .describe('La explicación del fragmento de código, formateada como Markdown.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `Eres un programador Python experto y un excelente profesor. Tu tarea es explicar el siguiente fragmento de código Python de una manera muy clara, concisa y amigable para un principiante absoluto.

Organiza tu explicación en las siguientes secciones:
- **¿Qué hace el código?:** Una descripción de alto nivel de lo que logra el código en una o dos frases.
- **Paso a paso:** Una explicación línea por línea o bloque por bloque de lo que hace cada parte.
- **Conceptos clave:** Define brevemente cualquier concepto de programación importante que aparezca en el código (por ejemplo, variables, bucles, funciones).

Aquí está el código:
\`\`\`python
{{{code}}}
\`\`\`
`,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No se pudo generar una explicación.');
    }
    return output;
  }
);
