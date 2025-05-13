import React from "react";
import { BuilderElement } from "@/contexts/BuilderContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ElementProps {
  element: BuilderElement;
}

const FormElement: React.FC<ElementProps> = ({ element }) => {
  const fields = element.props?.fields || [
    { name: "name", label: "Your Name", type: "text", required: true },
    { name: "email", label: "Your Email", type: "email", required: true },
    { name: "message", label: "Your Message", type: "textarea", required: true }
  ];
  
  const submitText = element.props?.submitText || "Submit";
  const layout = element.props?.layout || "vertical";
  const className = element.props?.className || "";
  
  return (
    <form className={`space-y-6 ${className}`} onSubmit={(e) => e.preventDefault()}>
      {layout === "inline" ? (
        <div className="flex gap-2 items-end">
          {fields.map((field, index) => (
            <div key={index} className="flex-1">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input 
                id={field.name} 
                name={field.name} 
                type={field.type} 
                placeholder={field.label}
                required={field.required}
              />
            </div>
          ))}
          <Button type="submit">{submitText}</Button>
        </div>
      ) : (
        <>
          {fields.map((field, index) => (
            <div key={index}>
              <Label htmlFor={field.name} className="mb-2 block">{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea 
                  id={field.name} 
                  name={field.name} 
                  placeholder={field.label}
                  required={field.required}
                  rows={4}
                />
              ) : field.type === "checkbox" ? (
                <div className="flex items-center gap-2">
                  <Checkbox id={field.name} name={field.name} />
                  <Label htmlFor={field.name} className="text-sm font-normal">{field.label}</Label>
                </div>
              ) : (
                <Input 
                  id={field.name} 
                  name={field.name} 
                  type={field.type} 
                  placeholder={field.label}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <Button type="submit">{submitText}</Button>
        </>
      )}
    </form>
  );
};

export default FormElement;
