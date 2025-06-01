import React, { useState, useEffect, useCallback } from 'react';

const INFO_STORAGE_KEY = 'appInfoData';

export const useInfoData = () => {
  const [infoData, setInfoData] = useState({
    mapLocationUrl: '',
    aboutUs: '',
    clinicAddress: '',
  });

  useEffect(() => {
    const storedInfo = localStorage.getItem(INFO_STORAGE_KEY);
    if (storedInfo) {
      setInfoData(JSON.parse(storedInfo));
    } else {
      // Initialize with some default placeholder data if nothing is stored
      const defaultInfo = {
        mapLocationUrl: 'https://maps.google.com/?q=29.3759,47.9774',
        aboutUs: 'Welcome to our clinic! We are dedicated to providing the best care.',
        clinicAddress: '123 Health St, Wellness City, KW',
      };
      setInfoData(defaultInfo);
      localStorage.setItem(INFO_STORAGE_KEY, JSON.stringify(defaultInfo));
    }
  }, []);

  const updateInfoData = useCallback((newData) => {
    setInfoData(prevData => {
      const updatedData = { ...prevData, ...newData };
      localStorage.setItem(INFO_STORAGE_KEY, JSON.stringify(updatedData));
      return updatedData;
    });
  }, []);

  return {
    infoData,
    updateInfoData,
  };
};