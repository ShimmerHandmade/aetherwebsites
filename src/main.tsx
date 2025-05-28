
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Wrap in StrictMode for better development experience but handle production gracefully
const AppWrapper = () => {
  if (import.meta.env.DEV) {
    return (
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
  return <App />;
};

root.render(<AppWrapper />);
