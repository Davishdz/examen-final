import { GoogleGenAI } from "@google/genai";

export default async (req, context) => {
  try {
    const { pregunta, respuestaEstudiante, rubrica } = await req.json();
    
    const genAI = new GoogleGenAI({}); 

    const prompt = `
      Eres un profesor de matemática de sexto grado. Evalúa la respuesta del estudiante.
      Pregunta: "${pregunta}"
      Rúbrica: "${rubrica}"
      Respuesta del estudiante: "${respuestaEstudiante}"
      
      Devuelve un objeto JSON con esta estructura exacta:
      {
        "nota": <número entre 0 y 1>,
        "feedback": "<explicación breve>",
      }
    `;

    const response = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return new Response(response.text, { 
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      nota: 0, feedback: "Error al calificar. El profesor revisará manualmente."
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const config = { path: "/api/calificar" };