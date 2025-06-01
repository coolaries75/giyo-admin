
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const CreateBranchModal = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  const initialFormData = {
    name: '',
    region: '',
    whatsApp: '',
    fbLink: '',
    igLink: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.region) {
      toast({
        title: 'Error',
        description: 'Branch Name and Region are required.',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(formData);
    setFormData(initialFormData); // Reset form
    onClose();
    toast({
      title: 'Success!',
      description: 'Branch created successfully.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Branch Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Input id="region" name="region" value={formData.region} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="whatsApp">WhatsApp Number</Label>
              <Input id="whatsApp" name="whatsApp" value={formData.whatsApp} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="fbLink">Facebook Link</Label>
              <Input id="fbLink" name="fbLink" value={formData.fbLink} onChange={handleChange} placeholder="Optional" />
            </div>
            <div>
              <Label htmlFor="igLink">Instagram Link</Label>
              <Input id="igLink" name="igLink" value={formData.igLink} onChange={handleChange} placeholder="Optional" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Branch</Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBranchModal;
  