
import React, { useState } from 'react';
import { Camera, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CameraCapture from '@/components/CameraCapture';
import TireEntryForm from '@/components/TireEntryForm';
import TireCard from '@/components/TireCard';

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
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTire = (newTire: Omit<Tire, 'id' | 'dateAdded'>) => {
    const tire: Tire = {
      ...newTire,
      id: Date.now().toString(),
      dateAdded: new Date()
    };
    setTires(prev => [tire, ...prev]);
    setShowForm(false);
    setShowCamera(false);
  };

  const filteredTires = tires.filter(tire =>
    tire.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={(imageUrl) => {
          setShowCamera(false);
          setShowForm(true);
        }}
        onCancel={() => setShowCamera(false)}
      />
    );
  }

  if (showForm) {
    return (
      <TireEntryForm
        onSubmit={handleAddTire}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 touch-manipulation">
      {/* Header - Optimized for mobile */}
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">Tire Inventory</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 hidden sm:block">Manage your tire stock efficiently</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{tires.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Items</div>
            </div>
          </div>
          
          {/* Action Buttons - Mobile optimized */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => setShowCamera(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium"
              size="lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Photo
            </Button>
            <Button 
              onClick={() => setShowForm(true)}
              variant="outline"
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Manual Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters - Mobile optimized */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by brand, model, or size..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button variant="outline" size="default" className="w-full h-12 text-base">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Inventory Grid - Mobile responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {filteredTires.map((tire) => (
            <TireCard
              key={tire.id}
              tire={tire}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>

        {filteredTires.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="text-muted-foreground text-lg">No tires found</div>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first tire'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
