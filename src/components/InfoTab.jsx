import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useInfoData } from '@/hooks/useInfoData';
import { useBrochureData } from '@/hooks/useBrochureData'; // For branches
import { USER_ROLES } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';
import { Save, ExternalLink, PlusCircle } from 'lucide-react';
import CreateBranchModal from '@/components/CreateBranchModal';

const InfoTab = ({ currentUserRole }) => {
  const { infoData, updateInfoData } = useInfoData();
  const { addBranch } = useBrochureData(); // Use addBranch from brochure data hook
  const { toast } = useToast();
  
  const [formData, setFormData] = useState(infoData);
  const [hasChanges, setHasChanges] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const isSuperAdmin = currentUserRole === USER_ROLES.SUPER_ADMIN;

  useEffect(() => {
    setFormData(infoData);
    setHasChanges(false); 
  }, [infoData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSaveInfo = () => {
    updateInfoData(formData);
    toast({
      title: 'Information Updated',
      description: 'The general information has been saved successfully.',
    });
    setHasChanges(false);
  };

  const handleMapLinkClick = () => {
    if (formData.mapLocationUrl) {
      window.open(formData.mapLocationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBranchFormSubmit = (branchData) => {
    addBranch(branchData); // This now comes from useBrochureData
    setIsBranchModalOpen(false);
    // Toast for branch creation is handled in CreateBranchModal or useBrochureData
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Card className="bg-gradient-to-br from-card via-slate-50 to-indigo-50 shadow-xl">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
              General Information
            </CardTitle>
            <CardDescription>Manage your clinic's public details and branches.</CardDescription>
          </div>
          {isSuperAdmin && (
            <Button onClick={() => setIsBranchModalOpen(true)} variant="outline" className="mt-4 md:mt-0 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Branch
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="mapLocationUrl" className="text-base">Map Location URL</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="mapLocationUrl"
                name="mapLocationUrl"
                value={formData.mapLocationUrl}
                onChange={handleChange}
                placeholder="e.g., https://maps.google.com/?q=29.3759,47.9774"
                disabled={!isSuperAdmin}
                className="flex-grow"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleMapLinkClick}
                disabled={!formData.mapLocationUrl}
                aria-label="Open map link"
              >
                <ExternalLink className="h-5 w-5" />
              </Button>
            </div>
            {!isSuperAdmin && <p className="text-xs text-muted-foreground">View only. Contact Super Admin to edit.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutUs" className="text-base">About Us</Label>
            <Textarea
              id="aboutUs"
              name="aboutUs"
              value={formData.aboutUs}
              onChange={handleChange}
              placeholder="Tell us about your clinic..."
              rows={5}
              disabled={!isSuperAdmin}
            />
            {!isSuperAdmin && <p className="text-xs text-muted-foreground">View only. Contact Super Admin to edit.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicAddress" className="text-base">Clinic Address</Label>
            <Input
              id="clinicAddress"
              name="clinicAddress"
              value={formData.clinicAddress}
              onChange={handleChange}
              placeholder="e.g., 123 Health St, Wellness City, KW"
              disabled={!isSuperAdmin}
            />
            {!isSuperAdmin && <p className="text-xs text-muted-foreground">View only. Contact Super Admin to edit.</p>}
          </div>

          {isSuperAdmin && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveInfo} disabled={!hasChanges} size="lg">
                <Save className="mr-2 h-5 w-5" /> Save Info Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isBranchModalOpen && isSuperAdmin && (
        <CreateBranchModal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          onSubmit={handleBranchFormSubmit}
        />
      )}
    </motion.div>
  );
};

export default InfoTab;