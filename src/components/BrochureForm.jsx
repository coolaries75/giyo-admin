import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { DEFAULT_WHATSAPP_CTA, USER_ROLES } from '@/lib/constants';

const BrochureForm = ({
  isOpen,
  onClose,
  onSubmit,
  brochure,
  branches,
  currentUserRole,
  formType = 'create', // 'create', 'edit', 'duplicate'
}) => {
  const { toast } = useToast();
  const initialFormData = {
    title: '',
    description: '',
    price: '',
    slug: '',
    image: '', // This will store the image URL or a placeholder string
    startDate: '',
    endDate: '',
    alwaysActive: false,
    whatsAppCTA: DEFAULT_WHATSAPP_CTA,
    branchId: branches.length > 0 ? branches[0].id : '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null); // For displaying selected image file

  useEffect(() => {
    if (brochure) {
      setFormData({
        title: brochure.title || '',
        description: brochure.description || '',
        price: brochure.price || '',
        slug: brochure.slug || '',
        code: brochure.code || '', // Read-only
        image: brochure.image || '', // Existing image URL or placeholder
        startDate: brochure.startDate ? brochure.startDate.split('T')[0] : '',
        endDate: brochure.endDate ? brochure.endDate.split('T')[0] : '',
        alwaysActive: brochure.alwaysActive || false,
        whatsAppCTA: brochure.whatsAppCTA || DEFAULT_WHATSAPP_CTA,
        branchId: brochure.branchId || (branches.length > 0 ? branches[0].id : ''),
      });
      // If there's an existing image URL, use it for preview in edit/duplicate mode
      if (brochure.image && typeof brochure.image === 'string') {
        setImagePreview(brochure.image); 
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
    }

    if (formType === 'duplicate' && brochure) {
      setFormData(prev => ({ ...prev, title: `${brochure.title} (Copy)`, slug: `${brochure.slug}-copy`, code: '' }));
    }
    
    // Reset image preview if form is closed or type changes to create
    if (!isOpen || formType === 'create') {
        setImagePreview(null);
    }

  }, [brochure, isOpen, formType, branches]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // For simplicity, we'll use a placeholder URL. In a real app, you'd upload and get a URL.
      // For local preview, we can use FileReader.
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview for display
        // Store a placeholder or actual URL if uploaded. Here, just a name for demo.
        // In a real app, this would be the URL returned after upload.
        // For now, let's simulate a Unsplash URL based on the name for variety.
        const randomImageId = Math.floor(Math.random() * 1000);
        setFormData(prev => ({ ...prev, image: `https://source.unsplash.com/random/400x300?product&sig=${randomImageId}` }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      toast({
        title: 'Error',
        description: 'Title and Price are required.',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(formData); // formData.image now contains the URL or placeholder
    onClose();
    toast({
      title: 'Success!',
      description: `Brochure ${formType === 'create' || formType === 'duplicate' ? 'created' : 'updated'} successfully.`,
    });
  };

  const isSuperAdmin = currentUserRole === USER_ROLES.SUPER_ADMIN;
  const isImageUploadDisabled = formType === 'edit' || formType === 'duplicate';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader>
            <DialogTitle>
              {formType === 'create' && 'Create New Brochure'}
              {formType === 'edit' && 'Edit Brochure'}
              {formType === 'duplicate' && 'Duplicate Brochure'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" value={formData.price} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input id="code" name="code" value={formData.code} readOnly disabled className="bg-muted" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="image">Image</Label>
              <Input id="image" name="imageFile" type="file" onChange={handleImageChange} disabled={isImageUploadDisabled} accept="image/*" />
              {isImageUploadDisabled && <p className="text-xs text-muted-foreground mt-1">Image upload is disabled for existing brochures. Current image is shown below.</p>}
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Image Preview:</p>
                  <img-replace src={imagePreview} alt="Brochure preview" className="rounded-lg shadow-md max-h-48 w-auto object-contain" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} disabled={formData.alwaysActive} />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} disabled={formData.alwaysActive} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="alwaysActive" name="alwaysActive" checked={formData.alwaysActive} onCheckedChange={(checked) => handleSelectChange('alwaysActive', checked)} />
              <Label htmlFor="alwaysActive">∞ Always Active (overrides dates)</Label>
            </div>
            <div>
              <Label htmlFor="whatsAppCTA">WhatsApp CTA</Label>
              <Input id="whatsAppCTA" name="whatsAppCTA" value={formData.whatsAppCTA} onChange={handleChange} disabled={!isSuperAdmin} />
              {!isSuperAdmin && <p className="text-xs text-muted-foreground mt-1">Only Super Admin can edit WhatsApp CTA.</p>}
            </div>
            {(formType === 'duplicate' && isSuperAdmin && branches.length > 0) && (
              <div>
                <Label htmlFor="branchId">Branch</Label>
                <Select name="branchId" value={formData.branchId} onValueChange={(value) => handleSelectChange('branchId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
             {(formType === 'create' && branches.length > 0) && (
              <div>
                <Label htmlFor="branchId">Branch</Label>
                <Select name="branchId" value={formData.branchId} onValueChange={(value) => handleSelectChange('branchId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {formType === 'create' && 'Create Brochure'}
                {formType === 'edit' && 'Save Changes'}
                {formType === 'duplicate' && 'Duplicate Brochure'}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BrochureForm;
