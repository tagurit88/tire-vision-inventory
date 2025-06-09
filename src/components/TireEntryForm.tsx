
import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Tire } from '@/pages/Index';

interface TireEntryFormProps {
  onSubmit: (tire: Omit<Tire, 'id' | 'dateAdded'>) => void;
  onCancel: () => void;
  initialData?: Partial<Tire>;
}

const TireEntryForm: React.FC<TireEntryFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Omit<Tire, 'id' | 'dateAdded'>>({
    defaultValues: {
      brand: initialData?.brand || '',
      model: initialData?.model || '',
      size: initialData?.size || '',
      condition: initialData?.condition || 'new',
      quantity: initialData?.quantity || 1,
      description: initialData?.description || '',
      location: initialData?.location || '',
      imageUrl: initialData?.imageUrl || ''
    }
  });

  const condition = watch('condition');

  const onFormSubmit = (data: Omit<Tire, 'id' | 'dateAdded'>) => {
    onSubmit(data);
  };

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'used-excellent', label: 'Used - Excellent' },
    { value: 'used-good', label: 'Used - Good' },
    { value: 'used-fair', label: 'Used - Fair' },
    { value: 'used-poor', label: 'Used - Poor' }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-2xl">Add New Tire</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              {/* Brand and Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Michelin, Bridgestone"
                    {...register('brand', { required: 'Brand is required' })}
                  />
                  {errors.brand && (
                    <p className="text-sm text-destructive">{errors.brand.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Pilot Sport 4"
                    {...register('model')}
                  />
                </div>
              </div>

              {/* Size and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Input
                    id="size"
                    placeholder="e.g., 225/50R17"
                    {...register('size', { required: 'Size is required' })}
                  />
                  {errors.size && (
                    <p className="text-sm text-destructive">{errors.size.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select 
                    value={condition} 
                    onValueChange={(value) => setValue('condition', value as Tire['condition'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quantity and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' }
                    })}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-destructive">{errors.quantity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Warehouse A, Shop Floor, Section B2"
                    {...register('location')}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional notes about the tire condition, tread depth, etc."
                  className="min-h-[100px]"
                  {...register('description')}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Tire
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TireEntryForm;
