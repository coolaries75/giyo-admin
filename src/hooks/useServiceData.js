import React, { useState, useEffect, useCallback } from 'react';

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '');
};

export const useServiceData = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const storedServices = localStorage.getItem('services');
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      // Initialize with some dummy data
      const initialServices = [
        { id: 's1', title: 'Basic Consultation', price: '50', slug: 'basic-consultation', description: 'A one-hour basic consultation.', isArchived: false },
        { id: 's2', title: 'Premium Package', price: '200', slug: 'premium-package', description: 'Comprehensive premium service package.', isArchived: false },
        { id: 's3', title: 'Quick Fix', price: '25', slug: 'quick-fix', description: 'For minor issues.', isArchived: true },
      ];
      setServices(initialServices);
      localStorage.setItem('services', JSON.stringify(initialServices));
    }
  }, []);

  const updateLocalStorage = (data) => {
    localStorage.setItem('services', JSON.stringify(data));
  };

  const addService = useCallback((serviceData) => {
    setServices(prev => {
      const newId = `s${Date.now().toString()}`;
      const newService = { 
        ...serviceData, 
        id: newId, 
        slug: serviceData.slug || generateSlug(serviceData.title),
        isArchived: false 
      };
      const updatedServices = [...prev, newService];
      updateLocalStorage(updatedServices);
      return updatedServices;
    });
  }, []);

  const editService = useCallback((oldServiceId, newServiceData) => {
    setServices(prev => {
      // Archive the old service
      const servicesWithArchived = prev.map(s => 
        s.id === oldServiceId ? { ...s, isArchived: true } : s
      );
      // Add the new service (as a copy with updates)
      const newId = `s${Date.now().toString()}`;
      const editedService = { 
        ...newServiceData, 
        id: newId, 
        slug: newServiceData.slug || generateSlug(newServiceData.title),
        isArchived: false 
      };
      const updatedServices = [...servicesWithArchived, editedService];
      updateLocalStorage(updatedServices);
      return updatedServices;
    });
  }, []);
  
  const archiveService = useCallback((id) => {
    setServices(prev => {
      const updatedServices = prev.map(s => s.id === id ? { ...s, isArchived: true } : s);
      updateLocalStorage(updatedServices);
      return updatedServices;
    });
  }, []);

  const deleteService = useCallback((id) => {
    setServices(prev => {
      const updatedServices = prev.filter(s => s.id !== id);
      updateLocalStorage(updatedServices);
      return updatedServices;
    });
  }, []);

  return { 
    services, 
    addService, 
    editService,
    archiveService,
    deleteService,
    generateSlug
  };
};