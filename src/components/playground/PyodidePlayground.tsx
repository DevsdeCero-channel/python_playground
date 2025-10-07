"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import type { Pyodide, PyProxy } from "@/types/pyodide";
import { exercises } from "@/lib/exercises.json";
import { explainCode, type ExplainCodeInput, type ExplainCodeOutput } from "@/ai/flows/explain-code-flow";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Play, AlertCircle, CheckCircle, Lightbulb, ArrowRight, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "../ui/label";
import CodeEditor from "@uiw/react-textarea-code-editor";


type OutputState = {
  type: "success" | "error" | "info";
  message: string;
} | null;

const successMessages = [
  "¡Lo has clavado! ¿Seguro que no eres un bot?",
  "¡Código perfecto! Ni una pega. Sigue así, máquina.",
  "¡Correcto! ¿No serás tú Guido Van Rossum?.",
  "¡Funciona! Eres imparable. Pero no te flipes que hay que seguir estudiando.",
  "¡Ni un fallo! No te relajes crack, se aprende más de los errores.",
];

const getRandomSuccessMessage = () => {
    return successMessages[Math.floor(Math.random() * successMessages.length)];
}

export default function PyodidePlayground() {
  const [pyodide, setPyodide] = useState<Pyodide | null>(null);
  const [isLoadingPyodide, setIsLoadingPyodide] = useState(true);
  const [isEvaluating, startTransition] = useTransition();
  const [isExplaining, setIsExplaining] = useState(false);
  
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0].id);
  const currentExercise = exercises.find(ex => ex.id === selectedExerciseId) || exercises[0];
  const currentExerciseIndex = exercises.findIndex(ex => ex.id === selectedExerciseId);
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  const [code, setCode] = useState(currentExercise.defaultCode);
  const [output, setOutput] = useState<OutputState>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  const playgroundRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    async function initPyodide() {
      if (typeof window.loadPyodide === 'function') {
        try {
          const pyodideInstance = await window.loadPyodide();
          setPyodide(pyodideInstance);
          console.log("Pyodide listo.");
        } catch (error) {
          console.error("Failed to load Pyodide:", error);
          setOutput({ type: "error", message: "No se pudo cargar el entorno de Python. Por favor, refresca la página." });
        } finally {
          setIsLoadingPyodide(false);
        }
      }
    }
    initPyodide();
  }, []);

  useEffect(() => {
    const exercise = exercises.find(ex => ex.id === selectedExerciseId) || exercises[0];
    setCode(exercise.defaultCode);
    setOutput(null);
    setLastError(null);
    setErrorCount(0);
    setShowHint(false);
  }, [selectedExerciseId]);

  const handleEvaluate = () => {
    if (!pyodide) return;
    
    startTransition(async () => {
      setOutput(null);
      setShowHint(false);

      try {
        const fullCode = `${code}\n\n${currentExercise.testHarness}`;
        const result: string = await pyodide.runPythonAsync(fullCode);
        const resultType = result.startsWith("✅") ? "success" : "error";
        
        if (resultType === "success") {
          setOutput({ type: "success", message: getRandomSuccessMessage() });
          setLastError(null);
          setErrorCount(0);
        } else {
          setOutput({ type: "error", message: result });
          if (result === lastError) {
            setErrorCount(prev => prev + 1);
            if (errorCount + 1 >= 2) {
              setShowHint(true);
            }
          } else {
            setLastError(result);
            setErrorCount(1);
          }
        }
      } catch (error: any) {
        let userFriendlyMessage = "¡Ups! Algo no está bien en tu código.\n\n";
        const pyError = error as PyProxy;
        const rawErrorMessage = pyError.message || 'Ocurrió un error desconocido en Python.';

        if (rawErrorMessage.includes("SyntaxError")) {
          userFriendlyMessage += "Parece que hay un error de sintaxis. Revisa si te faltan dos puntos ':', paréntesis '()' o si hay alguna palabra mal escrita.";
        } else if (rawErrorMessage.includes("NameError")) {
          userFriendlyMessage += "Parece que estás usando una variable que no ha sido definida. ¿Te aseguraste de escribir bien su nombre?";
        } else if (rawErrorMessage.includes("IndentationError")) {
            userFriendlyMessage += "Python es sensible a los espacios. Revisa la indentación (los espacios al inicio de las líneas).";
        } else {
            userFriendlyMessage += "Revisa tu código en busca de errores y vuelve a intentarlo.";
        }
        
        setOutput({ type: 'error', message: userFriendlyMessage });
        if (userFriendlyMessage === lastError) {
          setErrorCount(prev => prev + 1);
           if (errorCount + 1 >= 2) {
              setShowHint(true);
            }
        } else {
          setLastError(userFriendlyMessage);
          setErrorCount(1);
        }
      }
    });
  };

  const handleExplainCode = async () => {
    if (!code) {
        setOutput({ type: 'info', message: 'No hay código que explicar. Escribe algo en el editor primero.' });
        return;
    }
    setIsExplaining(true);
    setOutput(null);
    setShowHint(false);
    try {
        const result = await explainCode({ code });
        setOutput({ type: 'info', message: result.explanation });
    } catch (error: any) {
        console.error(error);
        const errorMessage = error.message && error.message.toLowerCase().includes('api key') 
            ? 'La clave de API de Gemini no es válida o no se ha configurado. Asegúrate de añadirla como variable de entorno `GEMINI_API_KEY` en tu proyecto de Vercel y en un archivo .env.local para desarrollo.'
            : 'Ha ocurrido un error al contactar con la IA. Por favor, inténtalo de nuevo más tarde.';
        setOutput({ type: 'error', message: errorMessage });
    } finally {
        setIsExplaining(false);
    }
  };


  const handleNextExercise = () => {
    if (!isLastExercise) {
      const nextExerciseId = exercises[currentExerciseIndex + 1].id;
      setSelectedExerciseId(nextExerciseId);
      playgroundRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isReady = !isLoadingPyodide && pyodide;
  const isBusy = isEvaluating || isExplaining;

  return (
    <div className="space-y-6" ref={playgroundRef}>
      <div className="space-y-6">
         <Card>
          <CardHeader>
              <CardTitle>Selecciona un Ejercicio</CardTitle>
          </CardHeader>
          <CardContent>
              <Label htmlFor="exercise-select" className="sr-only">Selecciona un ejercicio</Label>
               <Select
                  value={selectedExerciseId}
                  onValueChange={setSelectedExerciseId}
                  disabled={!isReady}
              >
                  <SelectTrigger id="exercise-select">
                      <SelectValue placeholder="Selecciona un ejercicio" />
                  </SelectTrigger>
                  <SelectContent>
                      {exercises.map(exercise => (
                          <SelectItem key={exercise.id} value={exercise.id}>
                              {exercise.title}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </CardContent>
         </Card>

        <Card>
          <CardHeader>
            <CardTitle>{currentExercise.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" dangerouslySetInnerHTML={{ __html: currentExercise.description.replace(/`([^`]+)`/g, '<code>$1</code>') }} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tu Código</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <CodeEditor
                  value={code}
                  language="python"
                  placeholder="Escribe tu código Python aquí..."
                  onChange={(evn) => setCode(evn.target.value)}
                  padding={15}
                  disabled={!isReady}
                  style={{
                    fontSize: 14,
                    backgroundColor: "#0D1117",
                    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
                    minHeight: 250,
                    minWidth: '100%',
                    width: 'fit-content',
                    whiteSpace: 'pre',
                    overflowWrap: 'normal'
                  }}
                  data-color-mode="dark"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Button onClick={handleEvaluate} disabled={!isReady || isBusy} size="lg">
              {isEvaluating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isLoadingPyodide ? "Cargando Entorno..." : isEvaluating ? "Evaluando..." : "Probar Código"}
            </Button>
            <Button onClick={handleExplainCode} disabled={!isReady || isBusy} size="lg" className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                {isExplaining ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <WandSparkles className="mr-2 h-4 w-4" />
                )}
                {isExplaining ? "Explicando..." : "Explicar Código"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            {(isBusy) && !output && <Skeleton className="h-20 w-full" />}
            {!isBusy && !output && (
              <div className="text-sm text-muted-foreground p-4 text-center border-dashed border rounded-lg">
                Haz clic en "Probar Solución" o "Explicar Código" para ver el resultado.
              </div>
            )}
            {output && (
              <Alert variant={output.type === 'error' ? 'destructive' : output.type === 'success' ? 'default' : 'default'} className={cn(output.type === 'success' && "border-green-500/50 text-green-700 dark:text-green-400", output.type === 'info' && "border-blue-500/50 text-blue-700 dark:text-blue-400")}>
                {output.type === 'success' ? <CheckCircle className="h-4 w-4" /> : output.type === 'info' ? <WandSparkles className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{output.type === 'success' ? 'Éxito' : output.type === 'info' ? 'Explicación de la IA' : 'Error'}</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap font-code text-sm text-foreground">
                  {output.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center">
            <Button 
                onClick={handleNextExercise} 
                disabled={isLastExercise} 
                variant="outline"
                className="hover:bg-[#F8F8F8] dark:hover:bg-white/10"
            >
                Siguiente Ejercicio
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>

        {showHint && currentExercise.hint && (
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                <span>¿Necesitas una pista?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p 
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: currentExercise.hint.replace(/`([^`]+)`/g, '<code class=\"font-bold\">$1</code>') }} 
              />
            </CardContent>
           </Card>
        )}
      </div>
    </div>
  );
}

    