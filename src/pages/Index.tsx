
import React, { useState } from 'react';
import CameraCapture from '@/components/CameraCapture';
import TireEntryForm from '@/components/TireEntryForm';
import InventoryHeader from '@/components/InventoryHeader';
import InventorySearchFilters from '@/components/InventorySearchFilters';
import InventoryGrid from '@/components/InventoryGrid';

export interface Tire {
  id: string;
  brand: string;
  model: string;
  size: string;
  condition: 'new' | 'used-excellent' | 'used-good' | 'used-fair' | 'used-poor';
  quantity: number;
  description?: string;
  imageUrl?: string;
  dateAdded: Date;
  location?: string;
}

const Index = () => {
  const [tires, setTires] = useState<Tire[]>([
    {
      id: '1',
      brand: 'Michelin',
      model: 'Pilot Sport 4',
      size: '225/50R17',
      condition: 'new',
      quantity: 4,
      description: 'High-performance summer tire',
      dateAdded: new Date('2024-06-01'),
      location: 'Warehouse A'
    },
    {
      id: '2',
      brand: 'Bridgestone',
      model: 'Turanza T005',
      size: '205/55R16',
      condition: 'used-good',
      quantity: 2,
      description: 'All-season touring tire, 70% tread remaining',
      dateAdded: new Date('2024-06-05'),
      location: 'Shop Floor'
    }
  ]);
  
  const [showCamera, setShowCamera] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState<string>('all');

  const handleAddTire = (newTire: Omit<Tire, 'id' | 'dateAdded'>) => {
    const tire: Tire = {
      ...newTire,
      id: Date.now().toString(),
      dateAdded: new Date(),
      imageUrl: capturedImageUrl || newTire.imageUrl
    };
    setTires(prev => [tire, ...prev]);
    setShowForm(false);
    setShowCamera(false);
    setCapturedImageUrl(null);
  };

  const handleCameraCapture = (imageUrl: string) => {
    console.log('Camera captured image:', imageUrl);
    setCapturedImageUrl(imageUrl);
    setShowCamera(false);
    setShowForm(true);
  };

  const filteredTires = tires.filter(tire => {
    const matchesSearch = tire.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tire.size.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterCondition === 'all' || tire.condition === filterCondition;
    
    return matchesSearch && matchesFilter;
  });

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraCapture}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  if (showForm) {
    return (
      <TireEntryForm
        onSubmit={handleAddTire}
        onCancel={() => {
          setShowForm(false);
          setCapturedImageUrl(null);
        }}
        initialData={capturedImageUrl ? { imageUrl: capturedImageUrl } : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 touch-manipulation">
      <InventoryHeader
        totalItems={filteredTires.length}
        onTakePhoto={() => setShowCamera(true)}
        onManualEntry={() => setShowForm(true)}
      />

      <InventorySearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCondition={filterCondition}
        onFilterChange={setFilterCondition}
      />

      <InventoryGrid
        tires={filteredTires}
        searchTerm={searchTerm}
        filterCondition={filterCondition}
      />
    </div>
  );
};

export default Index;
