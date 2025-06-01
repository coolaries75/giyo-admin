import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, PlusCircle, Edit, Copy, Archive, Trash2, Facebook, Instagram, Search, RotateCcw, Eye, MessageSquare } from 'lucide-react';
import BrochureForm from '@/components/BrochureForm';
import { useBrochureData } from '@/hooks/useBrochureData';
import { USER_ROLES, BROCHURE_STATUS, DEFAULT_WHATSAPP_CTA } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';

const BrochuresTab = ({ currentUserRole }) => {
  const { 
    brochures, addBrochure, updateBrochure, archiveBrochure, unarchiveBrochure, deleteBrochure, 
    branches, getBranchNameById, getBrochureStatus
  } = useBrochureData();
  const { toast } = useToast();

  const [isBrochureFormOpen, setIsBrochureFormOpen] = useState(false);
  const [editingBrochure, setEditingBrochure] = useState(null);
  const [brochureFormType, setBrochureFormType] = useState('create');
  const [brochureSearchTerm, setBrochureSearchTerm] = useState('');

  const isSuperAdmin = currentUserRole === USER_ROLES.SUPER_ADMIN;

  const handleCreateBrochure = () => {
    setEditingBrochure(null);
    setBrochureFormType('create');
    setIsBrochureFormOpen(true);
  };

  const handleEditBrochure = (brochure) => {
    setEditingBrochure(brochure);
    setBrochureFormType('edit');
    setIsBrochureFormOpen(true);
  };

  const handleDuplicateBrochure = (brochure) => {
    setEditingBrochure(brochure);
    setBrochureFormType('duplicate');
    setIsBrochureFormOpen(true);
  };

  const handleArchiveBrochure = (id) => {
    archiveBrochure(id);
    toast({ title: 'Brochure Archived', description: 'The brochure has been moved to archives.' });
  };
  
  const handleUnarchiveBrochure = (id) => {
    unarchiveBrochure(id);
    toast({ title: 'Brochure Restored', description: 'The brochure has been restored from archives.' });
  };

  const handleDeleteBrochure = (id) => {
    deleteBrochure(id);
    toast({ title: 'Brochure Deleted', description: 'The brochure has been permanently deleted.', variant: 'destructive' });
  };

  const handleBrochureFormSubmit = (data) => {
    if (brochureFormType === 'edit' && editingBrochure) {
      updateBrochure(editingBrochure.id, data);
    } else { 
      addBrochure(data);
    }
    setIsBrochureFormOpen(false);
    setEditingBrochure(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case BROCHURE_STATUS.ACTIVE: return 'text-green-500';
      case BROCHURE_STATUS.COMING_SOON: return 'text-orange-500';
      case BROCHURE_STATUS.NOT_AVAILABLE: return 'text-gray-500';
      case BROCHURE_STATUS.ARCHIVED: return 'text-purple-500';
      default: return 'text-gray-700';
    }
  };

  const filteredBrochures = useMemo(() => {
    return brochures.filter(brochure => 
      !brochure.isArchived && (
      brochure.title.toLowerCase().includes(brochureSearchTerm.toLowerCase()) ||
      brochure.code.toLowerCase().includes(brochureSearchTerm.toLowerCase()) ||
      getBranchNameById(brochure.branchId).toLowerCase().includes(brochureSearchTerm.toLowerCase())
      )
    );
  }, [brochures, brochureSearchTerm, getBranchNameById]);
  
  const archivedBrochures = useMemo(() => brochures.filter(b => b.isArchived), [brochures]);

  const handleWhatsAppContact = (brochure) => {
    const whatsAppNumber = brochure.whatsAppCTA || DEFAULT_WHATSAPP_CTA;
    const message = `I'm interested in your brochure: ${brochure.title} (${brochure.slug})`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    toast({
      title: 'WhatsApp Contact',
      description: `Opening WhatsApp for "${brochure.title}".`,
    });
  };

  const handleViewBrochure = (brochure) => {
    // Simulate a public preview URL. In a real app, this would be a proper route.
    // For local, it could be /brochure/{slug} or /brochure/{id}
    const publicUrl = `/brochure-preview/${brochure.slug || brochure.id}`;
    toast({
      title: 'Simulating Public View',
      description: `Opening preview for "${brochure.title}" at ${publicUrl}. This would be the client-facing page.`,
    });
    // In a real app, you might navigate or open a new tab:
    // window.open(publicUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Card className="mb-6 bg-gradient-to-br from-card via-slate-50 to-purple-50 shadow-xl">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-0">
            Manage Brochures
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button onClick={handleCreateBrochure} className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Brochure
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search active brochures (Title, Code, Branch)..."
                value={brochureSearchTerm}
                onChange={(e) => setBrochureSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 hidden sm:table-cell">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Code</TableHead>
                  <TableHead className="hidden lg:table-cell">Branch</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredBrochures.length > 0 ? filteredBrochures.map((brochure) => {
                    const status = getBrochureStatus(brochure);
                    return (
                    <motion.tr
                      key={brochure.id} layout
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <TableCell className="hidden sm:table-cell">
                        {brochure.image ? (
                          <img-replace 
                            src={brochure.image} 
                            alt={brochure.title} 
                            className="h-12 w-12 object-cover rounded-md shadow-sm" 
                          />
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">No Img</div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{brochure.title}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)} bg-opacity-20 ${
                          status === BROCHURE_STATUS.ACTIVE ? 'bg-green-100' :
                          status === BROCHURE_STATUS.COMING_SOON ? 'bg-orange-100' :
                          status === BROCHURE_STATUS.ARCHIVED ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                          {status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{brochure.code}</TableCell>
                      <TableCell className="hidden lg:table-cell">{getBranchNameById(brochure.branchId)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewBrochure(brochure)}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditBrochure(brochure)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {isSuperAdmin && (
                              <DropdownMenuItem onClick={() => handleDuplicateBrochure(brochure)}>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                            )}
                             <DropdownMenuItem onClick={() => handleWhatsAppContact(brochure)}>
                              <MessageSquare className="mr-2 h-4 w-4 text-green-500" /> Contact on WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchiveBrochure(brochure.id)}>
                              <Archive className="mr-2 h-4 w-4" /> Archive
                            </DropdownMenuItem>
                            {isSuperAdmin && (
                              <>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the brochure "{brochure.title}".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteBrochure(brochure.id)} className="bg-destructive hover:bg-destructive/90">
                                        Yes, delete it
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                              <Facebook className="mr-2 h-4 w-4" /> Post to Facebook
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                              <Instagram className="mr-2 h-4 w-4" /> Post to Instagram
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  )}) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No active brochures found.
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          {archivedBrochures.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3 text-muted-foreground">Archived Brochures</h3>
               <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 hidden sm:table-cell">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Code</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {archivedBrochures.map(brochure => (
                      <TableRow key={brochure.id} className="bg-muted/30 hover:bg-muted/50">
                        <TableCell className="hidden sm:table-cell">
                          {brochure.image ? (
                            <img-replace 
                              src={brochure.image} 
                              alt={brochure.title} 
                              className="h-10 w-10 object-cover rounded-md shadow-sm"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-muted-foreground/20 rounded-md flex items-center justify-center text-muted-foreground text-xs">No Img</div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-muted-foreground">{brochure.title}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{brochure.code}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" onClick={() => handleUnarchiveBrochure(brochure.id)}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isBrochureFormOpen && (
        <BrochureForm
          isOpen={isBrochureFormOpen}
          onClose={() => setIsBrochureFormOpen(false)}
          onSubmit={handleBrochureFormSubmit}
          brochure={editingBrochure}
          branches={branches}
          currentUserRole={currentUserRole}
          formType={brochureFormType}
        />
      )}
    </motion.div>
  );
};

export default BrochuresTab;
