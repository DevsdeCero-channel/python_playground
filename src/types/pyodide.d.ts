declare global {
  interface Window {
    loadPyodide: (options?: { indexURL?: string }) => Promise<Pyodide>;
    pyodide: Pyodide;
  }
}

export interface PyProxy {
  toJs: (options?: { dict_converter?: (obj: any) => any }) => any;
  [key: string]: any;
}

export interface Pyodide {
  runPython: (code: string, globals?: any) => any;
  runPythonAsync: (code: string, globals?: any) => Promise<any>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  globals: PyProxy;
}

// To make this a module
export {};
