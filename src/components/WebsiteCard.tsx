
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { deleteWebsite } from "@/api/websites";
import { Website } from "@/types/general";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WebsiteCardProps {
  website: Website;
  onWebsiteUpdate: () => void;
  onWebsiteDeleted?: () => void;
  onDelete?: () => Promise<void>;
}

const WebsiteCard = ({ website, onWebsiteUpdate, onWebsiteDeleted, onDelete }: WebsiteCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      if (onDelete) {
        await onDelete();
      } else {
        toast.loading("Deleting website and associated data...");
        const result = await deleteWebsite(website.id);
          
        if (!result.success) {
          toast.dismiss();
          toast.error(result.error || "Failed to delete website");
          return;
        }
        
        toast.dismiss();
        toast.success("Website and all associated data deleted successfully");
        
        // Call the appropriate callback
        if (onWebsiteDeleted) {
          onWebsiteDeleted();
        } else {
          onWebsiteUpdate();
        }
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.dismiss();
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const formattedDate = new Date(website.created_at).toLocaleDateString();

  // Function to get template image path
  const getTemplateImagePath = () => {
    if (website.template) {
      return `/templates/${website.template}.png`;
    }
    return null;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
          {website.template ? (
            <img
              src={getTemplateImagePath() || "/placeholder.svg"}
              alt={website.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if template image doesn't exist
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="text-gray-400 text-lg">No preview available</div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{website.name}</h3>
          <p className="text-sm text-gray-500 mb-3">Created on {formattedDate}</p>
          
          <div className="flex flex-wrap gap-2">
            {website.published ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Published
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Draft
              </span>
            )}
            {website.template && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {website.template.charAt(0).toUpperCase() + website.template.slice(1)}
              </span>
            )}
          </div>
          
          <div className="flex mt-4 space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => navigate(`/builder/${website.id}`)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            
            {website.published && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => window.open(`/site/${website.id}`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{website.name}" and all associated data including:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>All website content and settings</li>
                <li>All products linked to this website</li>
                <li>All uploaded images and files</li>
              </ul>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WebsiteCard;
