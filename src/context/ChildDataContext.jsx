import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CHILDREN, INITIAL_ALERTS } from '../data/initialData';
import { assessChildNutritionStatus } from '../data/whoStandards';

const ChildDataContext = createContext();

export function ChildDataProvider({ children }) {
  const [childrenList, setChildrenList] = useState(() => {
    const saved = localStorage.getItem('childcare_children');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CHILDREN;
      }
    }
    return INITIAL_CHILDREN;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('childcare_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ALERTS;
      }
    }
    return INITIAL_ALERTS;
  });

  const [activeChildId, setActiveChildId] = useState(() => {
    return childrenList.length > 0 ? childrenList[0].id : null;
  });

  const [searchFilter, setSearchFilter] = useState('');

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('childcare_children', JSON.stringify(childrenList));
  }, [childrenList]);

  useEffect(() => {
    localStorage.setItem('childcare_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Register New Child
  const registerChild = (childData) => {
    const newId = `CH-${new Date().getFullYear()}-${String(childrenList.length + 1).padStart(3, '0')}`;
    const assessment = assessChildNutritionStatus(
      childData.ageMonths,
      childData.weight,
      childData.height,
      childData.muac,
      childData.gender,
      childData.hasEdema
    );

    let statusTag = 'Normal';
    if (assessment.overallStatus.includes('SAM')) statusTag = 'SAM';
    else if (assessment.overallStatus.includes('MAM')) statusTag = 'MAM';
    else if (assessment.overallStatus.includes('Stunted')) statusTag = 'Stunted';
    else if (assessment.overallStatus.includes('Underweight')) statusTag = 'Underweight';

    const newChild = {
      id: newId,
      poshanId: childData.poshanId || `POSH-${Math.floor(10000 + Math.random() * 90000)}`,
      name: childData.name,
      gender: childData.gender || 'male',
      dob: childData.dob,
      ageMonths: Number(childData.ageMonths) || 1,
      motherName: childData.motherName,
      fatherName: childData.fatherName || '',
      phone: childData.phone || '+91 98000 00000',
      village: childData.village || 'Rampur',
      anganwadiCenter: childData.anganwadiCenter || 'AWC-Rampur Sector 1',
      category: childData.category || 'General',
      birthWeight: Number(childData.birthWeight) || Number(childData.weight),
      bloodGroup: childData.bloodGroup || 'B+',
      hasEdema: Boolean(childData.hasEdema),
      currentStatus: statusTag,
      muac: Number(childData.muac) || 13.0,
      weight: Number(childData.weight) || 3.0,
      height: Number(childData.height) || 50.0,
      waz: assessment.waz,
      haz: assessment.haz,
      whz: assessment.whz,
      lastMeasured: new Date().toISOString().split('T')[0],
      avatarColor: statusTag === 'SAM' ? '#D9383A' : statusTag === 'MAM' ? '#E67E22' : '#245B49',
      immunizationStatus: childData.immunizationStatus || 'Registration Complete',
      growthHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          ageMonths: Number(childData.ageMonths) || 1,
          weight: Number(childData.weight) || 3.0,
          height: Number(childData.height) || 50.0,
          muac: Number(childData.muac) || 13.0,
          status: statusTag
        }
      ],
      notes: childData.notes || 'Registered in Anganwadi ChildCare AI system.'
    };

    setChildrenList(prev => [newChild, ...prev]);
    setActiveChildId(newId);

    // If SAM or MAM detected, generate automated alert
    if (statusTag === 'SAM' || statusTag === 'MAM') {
      const newAlert = {
        id: `ALT-${Date.now()}`,
        childId: newId,
        childName: newChild.name,
        village: newChild.village,
        level: statusTag === 'SAM' ? 'CRITICAL' : 'WARNING',
        title: `${statusTag} Alert Detected on Initial Registration`,
        description: `MUAC: ${newChild.muac}cm, WAZ: ${assessment.waz} SD, WHZ: ${assessment.whz} SD. Immediate clinical attention advised.`,
        date: new Date().toISOString().split('T')[0],
        actionRequired: statusTag === 'SAM' ? 'Arrange NRC Admission' : 'Schedule Supplementary Nutrition & Home Visit',
        status: 'UNRESOLVED'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }

    return newChild;
  };

  // Add a new growth measurement to an existing child
  const addGrowthMeasurement = (childId, measurement) => {
    setChildrenList(prev => prev.map(child => {
      if (child.id !== childId) return child;

      const assessment = assessChildNutritionStatus(
        measurement.ageMonths,
        measurement.weight,
        measurement.height,
        measurement.muac,
        child.gender,
        measurement.hasEdema
      );

      let statusTag = 'Normal';
      if (assessment.overallStatus.includes('SAM')) statusTag = 'SAM';
      else if (assessment.overallStatus.includes('MAM')) statusTag = 'MAM';
      else if (assessment.overallStatus.includes('Stunted')) statusTag = 'Stunted';
      else if (assessment.overallStatus.includes('Underweight')) statusTag = 'Underweight';

      const newHistoryEntry = {
        date: measurement.date || new Date().toISOString().split('T')[0],
        ageMonths: Number(measurement.ageMonths),
        weight: Number(measurement.weight),
        height: Number(measurement.height),
        muac: Number(measurement.muac),
        status: statusTag
      };

      const updatedHistory = [...(child.growthHistory || []), newHistoryEntry].sort((a,b) => a.ageMonths - b.ageMonths);

      // Check for alert conditions
      if (statusTag === 'SAM' || statusTag === 'MAM') {
        const newAlert = {
          id: `ALT-${Date.now()}`,
          childId: child.id,
          childName: child.name,
          village: child.village,
          level: statusTag === 'SAM' ? 'CRITICAL' : 'WARNING',
          title: `${statusTag} Condition Detected for ${child.name}`,
          description: `Latest Measurement: Weight ${measurement.weight}kg, MUAC ${measurement.muac}cm, WHZ ${assessment.whz} SD.`,
          date: new Date().toISOString().split('T')[0],
          actionRequired: statusTag === 'SAM' ? 'Referral to Medical Officer / NRC' : 'Supplementary poshan kit distribution',
          status: 'UNRESOLVED'
        };
        setAlerts(aPrev => [newAlert, ...aPrev]);
      }

      return {
        ...child,
        weight: Number(measurement.weight),
        height: Number(measurement.height),
        muac: Number(measurement.muac),
        ageMonths: Number(measurement.ageMonths),
        hasEdema: Boolean(measurement.hasEdema),
        waz: assessment.waz,
        haz: assessment.haz,
        whz: assessment.whz,
        currentStatus: statusTag,
        lastMeasured: newHistoryEntry.date,
        notes: measurement.notes || child.notes,
        growthHistory: updatedHistory
      };
    }));
  };

  // Resolve an alert
  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED' } : a));
  };

  // Delete child record
  const deleteChild = (childId) => {
    setChildrenList(prev => prev.filter(c => c.id !== childId));
    setAlerts(prev => prev.filter(a => a.childId !== childId));
    if (activeChildId === childId) {
      const remaining = childrenList.filter(c => c.id !== childId);
      setActiveChildId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Reset demo data back to clean factory defaults
  const resetDemoData = () => {
    localStorage.removeItem('childcare_children');
    localStorage.removeItem('childcare_alerts');
    setChildrenList(INITIAL_CHILDREN);
    setAlerts(INITIAL_ALERTS);
    setActiveChildId(INITIAL_CHILDREN[0].id);
  };

  // Filtered children search
  const filteredChildren = childrenList.filter(child => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      child.name.toLowerCase().includes(q) ||
      child.poshanId.toLowerCase().includes(q) ||
      child.motherName.toLowerCase().includes(q) ||
      child.village.toLowerCase().includes(q)
    );
  });

  return (
    <ChildDataContext.Provider value={{
      childrenList,
      filteredChildren,
      alerts,
      activeChildId,
      setActiveChildId,
      searchFilter,
      setSearchFilter,
      registerChild,
      addGrowthMeasurement,
      resolveAlert,
      deleteChild,
      resetDemoData
    }}>
      {children}
    </ChildDataContext.Provider>
  );
}

export function useChildData() {
  return useContext(ChildDataContext);
}
