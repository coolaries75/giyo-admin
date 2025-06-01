import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';

const ServiceForm = ({
  isOpen,
  onClose,
  onSubmit,
  service,
  formType = 'create', // 'create', 'edit'
  generateSlug,
}) => {
  const { toast } = useToast();
  const initialFormData = {
    title: '',
    price: '',
    slug: '',
    description: '',
    slugManuallyEdited: false, // Track if slug was manually changed
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (service) {
        setFormData({
          title: service.title || '',
          price: service.price || '',
          slug: service.slug || (service.title ? generateSlug(service.title) : ''),
          description: service.description || '',
          slugManuallyEdited: !!service.slug, // If existing service has a slug, assume it was intentional
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [service, isOpen, generateSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'title' && !prev.slugManuallyEdited) {
        newFormData.slug = generateSlug(value);
      }
      return newFormData;
    });
  };
  
  const handleSlugChange = (e) => {
    setFormData(prev => ({
      ...prev,
      slug: e.target.value,
      slugManuallyEdited: true, // Mark slug as manually edited
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast({
        title: 'Error',
        description: 'Title is required for a service.',
        variant: 'destructive',
      });
      return;
    }
    // Remove slugManuallyEdited before submitting
    const { slugManuallyEdited, ...dataToSubmit } = formData;
    onSubmit(dataToSubmit);
    onClose();
    toast({
      title: 'Success!',
      description: `Service ${formType === 'create' ? 'created' : 'updated'} successfully.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader>
            <DialogTitle>
              {formType === 'create' ? 'Create New Service' : 'Edit Service'}
            </DialogTitle>
            {formType === 'edit' && (
              <DialogDescription className="flex items-center text-orange-600 bg-orange-50 p-2 rounded-md mt-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Editing will create a new service and archive the old version.
              </DialogDescription>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="price">Price (KWD)</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Optional" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleSlugChange} placeholder="Auto-generated from title, editable" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Optional service details" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
