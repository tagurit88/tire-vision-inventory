
import React from 'react';
import { Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InventoryHeaderProps {
  totalItems: number;
  onTakePhoto: () => void;
  onManualEntry: () => void;
}

const InventoryHeader = ({ totalItems, onTakePhoto, onManualEntry }: InventoryHeaderProps) => {
  return (
    <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">Tire Inventory</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 hidden sm:block">Manage your tire stock efficiently</p>
          </div>
          <div className="text-right ml-4">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{totalItems}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Items</div>
          </div>
        </div>
        
        {/* Action Buttons - Mobile optimized */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onTakePhoto}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium"
            size="lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Photo
          </Button>
          <Button 
            onClick={onManualEntry}
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
  );
};

export default InventoryHeader;
