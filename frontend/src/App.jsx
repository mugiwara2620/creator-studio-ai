import React from 'react';
import { ScriptStudio } from './components/ScriptStudio';
import './App.css';
import { ScriptGenerator } from './components/ScriptGenerator';
function App() {
  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* <ScriptStudio /> */}
      <ScriptStudio />
      <ScriptGenerator />
    </div>
  );
}

export default App;