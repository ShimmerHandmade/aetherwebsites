
import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";

interface ElementProps {
  element: BuilderElement;
}

const PricingElement: React.FC<ElementProps> = ({ element }) => {
  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">{element.content || "Basic Plan"}</h3>
        <div className="text-3xl font-bold mb-2">{element.props?.price || "$9.99"}</div>
        <p className="text-sm text-gray-500 mb-4">{element.props?.period === 'yearly' ? 'per year' : 'per month'}</p>
        <ul className="mb-6 text-left space-y-2">
          {(element.props?.features || ["Feature 1", "Feature 2"]).map((feature: string, i: number) => (
            <li key={i} className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> {feature}
            </li>
          ))}
        </ul>
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded">Select Plan</button>
      </div>
    </div>
  );
};

export default PricingElement;
