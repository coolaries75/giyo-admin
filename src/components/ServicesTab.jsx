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
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search, RotateCcw } from 'lucide-react';
import ServiceForm from '@/components/ServiceForm';
import { useServiceData } from '@/hooks/useServiceData';
import { USER_ROLES } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';

const ServicesTab = ({ currentUserRole }) => {
  const {
    services, addService, editService, archiveService: archiveSvc, deleteService: deleteSvc, generateSlug
  } = useServiceData();
  const { toast } = useToast();

  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormType, setServiceFormType] = useState('create');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');

  const isSuperAdmin = currentUserRole === USER_ROLES.SUPER_ADMIN;

  const handleCreateService = () => {
    setEditingService(null);
    setServiceFormType('create');
    setIsServiceFormOpen(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceFormType('edit');
    setIsServiceFormOpen(true);
  };

  const handleServiceFormSubmit = (data) => {
    if (serviceFormType === 'edit' && editingService) {
      editService(editingService.id, data);
    } else {
      addService(data);
    }
    setIsServiceFormOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id, title) => {
    if (isSuperAdmin) {
      deleteSvc(id);
      toast({ title: 'Service Deleted', description: `Service "${title}" has been permanently deleted.`, variant: 'destructive' });
    } else {
      archiveSvc(id);
      toast({ title: 'Service Archived', description: `Service "${title}" has been archived.` });
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => 
      !service.isArchived && (
      service.title.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      (service.slug && service.slug.toLowerCase().includes(serviceSearchTerm.toLowerCase()))
      )
    );
  }, [services, serviceSearchTerm]);
  
  const archivedServices = useMemo(() => services.filter(s => s.isArchived), [services]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Card className="mb-6 bg-gradient-to-br from-card via-slate-50 to-sky-50 shadow-xl">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-0">
            Manage Services
          </CardTitle>
          <Button onClick={handleCreateService} className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Service
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search active services (Title, Slug)..."
                value={serviceSearchTerm}
                onChange={(e) => setServiceSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price (KWD)</TableHead>
                  <TableHead className="hidden md:table-cell">Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredServices.length > 0 ? filteredServices.map((service) => (
                    <motion.tr
                      key={service.id} layout
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>{service.price ? `${service.price} KWD` : 'N/A'}</TableCell>
                      <TableCell className="hidden md:table-cell">{service.slug}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditService(service)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                  <Trash2 className="mr-2 h-4 w-4" /> {isSuperAdmin ? 'Delete' : 'Archive'}
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {isSuperAdmin 
                                      ? `This will permanently delete the service "${service.title}". This action cannot be undone.`
                                      : `This will archive the service "${service.title}". You can restore it later.`}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteService(service.id, service.title)} className={isSuperAdmin ? "bg-destructive hover:bg-destructive/90" : ""}>
                                    Yes, {isSuperAdmin ? 'delete it' : 'archive it'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No active services found.
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
           {archivedServices.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3 text-muted-foreground">Archived Services</h3>
               <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Slug</TableHead>
                       <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {archivedServices.map(service => (
                      <TableRow key={service.id} className="bg-muted/30 hover:bg-muted/50">
                        <TableCell className="font-medium text-muted-foreground">{service.title}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{service.slug}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" onClick={() => {
                              const { id, ...serviceDataToRestore } = service;
                              addService({...serviceDataToRestore, title: `${service.title} (Restored)`});
                              toast({ title: 'Service Restored', description: `A new service based on "${service.title}" has been created.` });
                           }}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Restore as New
                          </Button>
                          {isSuperAdmin && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the archived service "{service.title}". This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteSvc(service.id)} className="bg-destructive hover:bg-destructive/90">
                                    Yes, delete it
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
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
      {isServiceFormOpen && (
        <ServiceForm
          isOpen={isServiceFormOpen}
          onClose={() => setIsServiceFormOpen(false)}
          onSubmit={handleServiceFormSubmit}
          service={editingService}
          formType={serviceFormType}
          generateSlug={generateSlug}
        />
      )}
    </motion.div>
  );
};

export default ServicesTab;