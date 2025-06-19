
import React from 'react';
import TireCard from '@/components/TireCard';
import { Tire } from '@/pages/Index';

interface InventoryGridProps {
  tires: Tire[];
  searchTerm: string;
  filterCondition: string;
}

const InventoryGrid = ({ tires, searchTerm, filterCondition }: InventoryGridProps) => {
  return (
    <div className="container mx-auto px-3 sm:px-4">
      {/* Inventory Grid - Mobile responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {tires.map((tire) => (
          <TireCard
            key={tire.id}
            tire={tire}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>

      {tires.length === 0 && (
        <div className="text-center py-12 px-4">
          <div className="text-muted-foreground text-lg">No tires found</div>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {searchTerm || filterCondition !== 'all' ? 'Try adjusting your search terms or filters' : 'Start by adding your first tire'}
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryGrid;
