
import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import type { Tire } from '@/pages/Index';
import { 
  sanitizeInput, 
  sanitizeTireDescription, 
  validateTireSize, 
  validateImageData, 
  validateImageSize,
  validateRequiredField,
  validateQuantity
} from '@/utils/security';

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
    console.log('Validating form data...');
    
    // Security validation
    const brandError = validateRequiredField(data.brand, 'Brand');
    const sizeError = validateRequiredField(data.size, 'Size');
    const quantityError = validateQuantity(data.quantity);
    
    if (brandError || sizeError || quantityError) {
      toast({
        title: "Validation Error",
        description: brandError || sizeError || quantityError || "Please check your input",
        variant: "destructive"
      });
      return;
    }
    
    // Validate tire size format
    if (!validateTireSize(data.size)) {
      toast({
        title: "Invalid Tire Size",
        description: "Please enter a valid tire size format (e.g., 225/50R17)",
        variant: "destructive"
      });
      return;
    }
    
    // Validate image if provided
    if (data.imageUrl) {
      if (!validateImageData(data.imageUrl)) {
        toast({
          title: "Invalid Image",
          description: "Please provide a valid image",
          variant: "destructive"
        });
        return;
      }
      
      if (!validateImageSize(data.imageUrl)) {
        toast({
          title: "Image Too Large",
          description: "Image size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Sanitize all string inputs
    const sanitizedData = {
      ...data,
      brand: sanitizeInput(data.brand),
      model: sanitizeInput(data.model),
      size: sanitizeInput(data.size),
      description: sanitizeTireDescription(data.description || ''),
      location: sanitizeInput(data.location || '')
    };
    
    console.log('Form validation passed, submitting sanitized data');
    onSubmit(sanitizedData);
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
                    {...register('brand', { 
                      required: 'Brand is required',
                      maxLength: { value: 50, message: 'Brand name too long' }
                    })}
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
                    {...register('model', {
                      maxLength: { value: 50, message: 'Model name too long' }
                    })}
                  />
                  {errors.model && (
                    <p className="text-sm text-destructive">{errors.model.message}</p>
                  )}
                </div>
              </div>

              {/* Size and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Input
                    id="size"
                    placeholder="e.g., 225/50R17"
                    {...register('size', { 
                      required: 'Size is required',
                      maxLength: { value: 20, message: 'Size format too long' }
                    })}
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
                    max="10000"
                    placeholder="1"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Quantity must be at least 1' },
                      max: { value: 10000, message: 'Quantity cannot exceed 10,000' }
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
                    {...register('location', {
                      maxLength: { value: 100, message: 'Location name too long' }
                    })}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional notes about the tire condition, tread depth, etc."
                  className="min-h-[100px]"
                  {...register('description', {
                    maxLength: { value: 500, message: 'Description too long (max 500 characters)' }
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
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
