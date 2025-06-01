
import React, { useState, useEffect, useCallback } from 'react';
import { BROCHURE_STATUS } from '@/lib/constants';

const generateBrochureCode = (id) => {
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  const randomDigits = Math.floor(Math.random() * 900) + 100;
  return `${month}${year}-BRO-${randomDigits}_${id}`;
};

const getBrochureStatus = (brochure) => {
  if (brochure.isArchived) {
    return BROCHURE_STATUS.ARCHIVED;
  }
  if (brochure.alwaysActive) {
    return BROCHURE_STATUS.ACTIVE;
  }
  const today = new Date();
  const startDate = brochure.startDate ? new Date(brochure.startDate) : null;
  const endDate = brochure.endDate ? new Date(brochure.endDate) : null;

  if (!startDate || !endDate) return BROCHURE_STATUS.NOT_AVAILABLE;

  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (today < startDate) {
    return BROCHURE_STATUS.COMING_SOON;
  }
  if (today > endDate) {
    return BROCHURE_STATUS.NOT_AVAILABLE;
  }
  return BROCHURE_STATUS.ACTIVE;
};


export const useBrochureData = () => {
  const [brochures, setBrochures] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const storedBrochures = localStorage.getItem('brochures');
    if (storedBrochures) {
      setBrochures(JSON.parse(storedBrochures));
    } else {
      // Initialize with some dummy data
      const initialBrochures = [
        { id: '1', title: 'Summer Sale', description: 'Big summer discounts!', price: '10 KWD', slug: 'summer-sale', code: generateBrochureCode('1'), image: '', startDate: '2025-06-01', endDate: '2025-06-30', alwaysActive: false, whatsAppCTA: '+96512345678', branchId: 'branch1', isArchived: false },
        { id: '2', title: 'Winter Collection', description: 'New winter arrivals.', price: '25 KWD', slug: 'winter-collection', code: generateBrochureCode('2'), image: '', startDate: '2025-12-01', endDate: '2025-12-31', alwaysActive: false, whatsAppCTA: '+96512345678', branchId: 'branch2', isArchived: false },
        { id: '3', title: 'Always On Deal', description: 'Special deal, always active.', price: '5 KWD', slug: 'always-on', code: generateBrochureCode('3'), image: '', startDate: null, endDate: null, alwaysActive: true, whatsAppCTA: '+96512345678', branchId: 'branch1', isArchived: false },
      ];
      setBrochures(initialBrochures);
      localStorage.setItem('brochures', JSON.stringify(initialBrochures));
    }

    const storedBranches = localStorage.getItem('branches');
    if (storedBranches) {
      setBranches(JSON.parse(storedBranches));
    } else {
      const initialBranches = [
        { id: 'branch1', name: 'Main Branch', region: 'Kuwait City', whatsApp: '+96511112222', fbLink: '', igLink: '' },
        { id: 'branch2', name: 'Salmiya Branch', region: 'Salmiya', whatsApp: '+96533334444', fbLink: '', igLink: '' },
      ];
      setBranches(initialBranches);
      localStorage.setItem('branches', JSON.stringify(initialBranches));
    }
  }, []);

  const updateLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addBrochure = useCallback((brochureData) => {
    setBrochures(prev => {
      const newId = Date.now().toString();
      const newBrochure = { ...brochureData, id: newId, code: generateBrochureCode(newId), isArchived: false };
      const updatedBrochures = [...prev, newBrochure];
      updateLocalStorage('brochures', updatedBrochures);
      return updatedBrochures;
    });
  }, []);

  const updateBrochure = useCallback((id, updatedData) => {
    setBrochures(prev => {
      const updatedBrochures = prev.map(b => b.id === id ? { ...b, ...updatedData } : b);
      updateLocalStorage('brochures', updatedBrochures);
      return updatedBrochures;
    });
  }, []);

  const archiveBrochure = useCallback((id) => {
    setBrochures(prev => {
      const updatedBrochures = prev.map(b => b.id === id ? { ...b, isArchived: true } : b);
      updateLocalStorage('brochures', updatedBrochures);
      return updatedBrochures;
    });
  }, []);
  
  const unarchiveBrochure = useCallback((id) => {
    setBrochures(prev => {
      const updatedBrochures = prev.map(b => b.id === id ? { ...b, isArchived: false } : b);
      updateLocalStorage('brochures', updatedBrochures);
      return updatedBrochures;
    });
  }, []);

  const deleteBrochure = useCallback((id) => {
    setBrochures(prev => {
      const updatedBrochures = prev.filter(b => b.id !== id);
      updateLocalStorage('brochures', updatedBrochures);
      return updatedBrochures;
    });
  }, []);

  const addBranch = useCallback((branchData) => {
    setBranches(prev => {
      const newBranch = { ...branchData, id: Date.now().toString() };
      const updatedBranches = [...prev, newBranch];
      updateLocalStorage('branches', updatedBranches);
      return updatedBranches;
    });
  }, []);
  
  const getBranchNameById = useCallback((branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'N/A';
  }, [branches]);

  return { 
    brochures, 
    addBrochure, 
    updateBrochure, 
    archiveBrochure, 
    unarchiveBrochure,
    deleteBrochure, 
    branches, 
    addBranch,
    getBranchNameById,
    getBrochureStatus 
  };
};
  