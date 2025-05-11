
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
  isPreviewMode?: boolean;
}

const ContactElement: React.FC<ElementProps> = ({ element, isPreviewMode = false }) => {
  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-xl font-medium mb-4">{element.content}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Your name" disabled={isPreviewMode} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full px-3 py-2 border rounded" placeholder="Your email" disabled={isPreviewMode} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea className="w-full px-3 py-2 border rounded" rows={4} placeholder="Your message" disabled={isPreviewMode}></textarea>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
      </div>
    </div>
  );
};

export default ContactElement;
