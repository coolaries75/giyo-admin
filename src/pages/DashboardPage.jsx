import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Briefcase, BadgeInfo as InfoIcon } from 'lucide-react';
import BrochuresTab from '@/components/BrochuresTab';
import ServicesTab from '@/components/ServicesTab';
import InfoTab from '@/components/InfoTab';
import { USER_ROLES } from '@/lib/constants'; // Assuming USER_ROLES is defined here

const DashboardPage = ({ currentUserRole, currentUserName }) => {
  // This component now receives currentUserRole and currentUserName as props
  // It passes currentUserRole down to the tabs that need it.

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-6 lg:p-8"
    >
      <Tabs defaultValue="brochures" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-6 rounded-lg shadow-sm">
          <TabsTrigger value="brochures" className="text-sm md:text-base data-[state=active]:bg-primary/10 data-[state=active]:shadow-inner">
            <Package className="mr-2 h-4 w-4" />Brochures
          </TabsTrigger>
          <TabsTrigger value="services" className="text-sm md:text-base data-[state=active]:bg-primary/10 data-[state=active]:shadow-inner">
            <Briefcase className="mr-2 h-4 w-4" />Services
          </TabsTrigger>
          <TabsTrigger value="info" className="text-sm md:text-base data-[state=active]:bg-primary/10 data-[state=active]:shadow-inner">
            <InfoIcon className="mr-2 h-4 w-4" />Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brochures">
          <BrochuresTab currentUserRole={currentUserRole} />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab currentUserRole={currentUserRole} />
        </TabsContent>
        
        <TabsContent value="info">
          <InfoTab currentUserRole={currentUserRole} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DashboardPage;
