
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface InventorySearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCondition: string;
  onFilterChange: (condition: string) => void;
}

const InventorySearchFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filterCondition, 
  onFilterChange 
}: InventorySearchFiltersProps) => {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by brand, model, or size..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="default" className="w-full h-12 text-base">
              <Filter className="mr-2 h-4 w-4" />
              Filter {filterCondition !== 'all' && `(${filterCondition})`}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[300px]">
            <SheetHeader>
              <SheetTitle>Filter by Condition</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                variant={filterCondition === 'all' ? 'default' : 'outline'}
                onClick={() => onFilterChange('all')}
                className="h-12"
              >
                All
              </Button>
              <Button
                variant={filterCondition === 'new' ? 'default' : 'outline'}
                onClick={() => onFilterChange('new')}
                className="h-12"
              >
                New
              </Button>
              <Button
                variant={filterCondition === 'used-excellent' ? 'default' : 'outline'}
                onClick={() => onFilterChange('used-excellent')}
                className="h-12"
              >
                Used - Excellent
              </Button>
              <Button
                variant={filterCondition === 'used-good' ? 'default' : 'outline'}
                onClick={() => onFilterChange('used-good')}
                className="h-12"
              >
                Used - Good
              </Button>
              <Button
                variant={filterCondition === 'used-fair' ? 'default' : 'outline'}
                onClick={() => onFilterChange('used-fair')}
                className="h-12"
              >
                Used - Fair
              </Button>
              <Button
                variant={filterCondition === 'used-poor' ? 'default' : 'outline'}
                onClick={() => onFilterChange('used-poor')}
                className="h-12"
              >
                Used - Poor
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default InventorySearchFilters;
