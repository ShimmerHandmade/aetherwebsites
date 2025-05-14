import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, File, Trash, Edit, ChevronRight, Home } from "lucide-react";
import { useWebsite } from "@/hooks/useWebsite";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "@/lib/uuid";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Page {
  id: string;
  title: string;
  slug: string;
  isHomePage?: boolean;
}

const BuilderPages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    website, 
    isLoading, 
    websiteName,
    saveWebsite
  } = useWebsite(id, navigate);
  
  const [pages, setPages] = useState<Page[]>([]);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editIsHomePage, setEditIsHomePage] = useState(false);

  // Initialize pages from website settings if available
  useEffect(() => {
    if (website?.settings && website.settings.pages) {
      setPages(website.settings.pages);
    } else if (pages.length === 0) {
      // Create a default home page if no pages exist
      setPages([
        { id: uuidv4(), title: 'Home', slug: '/', isHomePage: true }
      ]);
    }
  }, [website]);

  const handleAddPage = async () => {
    if (!newPageTitle.trim()) {
      toast.error("Page title cannot be empty");
      return;
    }
    
    // Create slug from title
    const slug = newPageTitle.toLowerCase().replace(/\s+/g, '-');
    
    const newPage: Page = {
      id: uuidv4(),
      title: newPageTitle,
      slug: `/${slug}`
    };
    
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    setNewPageTitle('');
    setIsCreating(false);
    
    // Save pages to website settings
    await savePagesToDB(updatedPages);
    
    toast.success(`Page "${newPageTitle}" created`);
  };

  const handleDeletePage = async (pageId: string) => {
    // Don't allow deleting the homepage
    const pageToDelete = pages.find(p => p.id === pageId);
    if (pageToDelete?.isHomePage) {
      toast.error("Cannot delete the home page");
      return;
    }
    
    const updatedPages = pages.filter(page => page.id !== pageId);
    setPages(updatedPages);
    
    // Delete page content as well
    if (website?.settings) {
      const pagesContent = { ...(website.settings.pagesContent || {}) };
      const pagesSettings = { ...(website.settings.pagesSettings || {}) };
      
      delete pagesContent[pageId];
      delete pagesSettings[pageId];
      
      // Save updated pages and remove page content
      await saveWebsite(website.content, website.pageSettings, {
        pages: updatedPages,
        pagesContent,
        pagesSettings
      });
    } else {
      // Just save the updated pages
      await savePagesToDB(updatedPages);
    }
    
    toast.success("Page deleted");
  };

  const handleEditPage = (page: Page) => {
    setEditingPage(page);
    setEditTitle(page.title);
    setEditIsHomePage(!!page.isHomePage);
  };

  const handleSaveEdit = async () => {
    if (!editingPage || !editTitle.trim()) {
      toast.error("Page title cannot be empty");
      return;
    }
    
    // If setting a new homepage, unset the current one
    let updatedPages = [...pages];
    if (editIsHomePage) {
      updatedPages = updatedPages.map(p => ({
        ...p, 
        isHomePage: p.id === editingPage.id
      }));
    } else {
      // Make sure we still have a homepage
      const hasAnotherHomePage = updatedPages.some(p => p.id !== editingPage.id && p.isHomePage);
      if (!hasAnotherHomePage && editingPage.isHomePage) {
        toast.error("You must have a home page. Please set another page as home before removing this one.");
        return;
      }
      
      // Update just this page
      updatedPages = updatedPages.map(p => 
        p.id === editingPage.id 
          ? { ...p, title: editTitle, isHomePage: editIsHomePage }
          : p
      );
    }
    
    setPages(updatedPages);
    setEditingPage(null);
    
    // Save pages to website settings
    await savePagesToDB(updatedPages);
    
    toast.success("Page updated");
  };

  const savePagesToDB = async (updatedPages: Page[]) => {
    try {
      setIsSaving(true);
      
      // Update website settings with pages
      const updatedSettings = {
        ...website?.settings,
        pages: updatedPages
      };
      
      // Save to database
      await saveWebsite(website?.content || [], {
        ...website?.pageSettings,
        title: website?.pageSettings?.title || websiteName
      }, updatedSettings);
      
    } catch (error) {
      console.error("Error saving pages:", error);
      toast.error("Failed to save pages");
    } finally {
      setIsSaving(false);
    }
  };

  const navigateToPage = (pageId: string) => {
    // Navigate to builder with query param for page
    navigate(`/builder/${id}?pageId=${pageId}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-r-blue-600 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Website not found</h2>
          <p className="text-gray-600 mb-6">The website you're looking for doesn't exist or you don't have permission to access it.</p>
          <Button onClick={() => navigate("/dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(`/builder/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Pages - {websiteName}</h1>
            <Button 
              onClick={() => setIsCreating(true)} 
              className="flex items-center gap-1"
              disabled={isSaving}
            >
              <Plus className="h-4 w-4" /> Add Page
            </Button>
          </div>
          
          {isCreating && (
            <div className="mb-6 p-4 border border-blue-100 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-medium mb-3">Create New Page</h2>
              <div className="flex gap-3">
                <Input 
                  placeholder="Page title" 
                  value={newPageTitle} 
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddPage} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSaving}
                >
                  Create
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {pages.map(page => (
              <Card key={page.id} className="border border-gray-200 hover:border-gray-300">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {page.isHomePage ? (
                      <Home className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <File className="h-5 w-5 text-blue-500 mr-3" />
                    )}
                    <div>
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm text-gray-500">{page.slug}</div>
                    </div>
                    {page.isHomePage && (
                      <span className="ml-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Home Page
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeletePage(page.id)}
                      disabled={page.isHomePage || isSaving}
                    >
                      <Trash className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditPage(page)}
                      disabled={isSaving}
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigateToPage(page.id)}
                    >
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pages.length === 0 && (
            <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No pages created yet</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Page Dialog */}
      <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>
              Update the details for this page
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-page-title">Page Title</Label>
              <Input 
                id="edit-page-title" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="home-page" 
                checked={editIsHomePage}
                onCheckedChange={setEditIsHomePage}
                disabled={editingPage?.isHomePage}
              />
              <Label htmlFor="home-page">Set as Home Page</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPage(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuilderPages;
