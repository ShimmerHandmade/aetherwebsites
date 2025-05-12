
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UniqueCategory } from "@/types/product";

interface CategoriesDialogProps {
  categories: UniqueCategory[];
  newCategory: string;
  onNewCategoryChange: (value: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (name: string) => void;
  trigger: React.ReactNode;
}

const CategoriesDialog: React.FC<CategoriesDialogProps> = ({
  categories,
  newCategory,
  onNewCategoryChange,
  onAddCategory,
  onDeleteCategory,
  trigger
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Categories</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => onNewCategoryChange(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={onAddCategory}>Add</Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-2 border rounded-md">
                  <span>{category.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDeleteCategory(category.name)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-2">No categories yet</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoriesDialog;
