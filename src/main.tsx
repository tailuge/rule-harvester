import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("App Environment:", process.env.NODE_ENV);

createRoot(document.getElementById("root")!).render(<App />);
