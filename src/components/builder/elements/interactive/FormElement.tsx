
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
  isPreviewMode?: boolean;
}

const FormElement: React.FC<ElementProps> = ({ element, isPreviewMode = false }) => {
  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-medium mb-4">{element.content || "Form"}</h3>
      <div className="space-y-4">
        {(element.props?.fields || ['name', 'email']).includes('name') && (
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Your name" disabled={isPreviewMode} />
          </div>
        )}
        {(element.props?.fields || ['name', 'email']).includes('email') && (
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Your email" disabled={isPreviewMode} />
          </div>
        )}
        {(element.props?.fields || ['name', 'email']).includes('message') && (
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea className="w-full px-3 py-2 border rounded" rows={3} placeholder="Your message" disabled={isPreviewMode}></textarea>
          </div>
        )}
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
      </div>
    </div>
  );
};

export default FormElement;
