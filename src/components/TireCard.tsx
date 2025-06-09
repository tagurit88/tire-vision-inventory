
import React from 'react';
import { Edit, Trash2, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Tire } from '@/pages/Index';

interface TireCardProps {
  tire: Tire;
  onEdit: (tire: Tire) => void;
  onDelete: (id: string) => void;
}

const TireCard: React.FC<TireCardProps> = ({ tire, onEdit, onDelete }) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'used-excellent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'used-good': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'used-fair': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'used-poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'new': return 'New';
      case 'used-excellent': return 'Used - Excellent';
      case 'used-good': return 'Used - Good';
      case 'used-fair': return 'Used - Fair';
      case 'used-poor': return 'Used - Poor';
      default: return condition;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">
              {tire.brand} {tire.model}
            </h3>
            <p className="text-muted-foreground text-sm">{tire.size}</p>
          </div>
          <Badge 
            className={`ml-2 ${getConditionColor(tire.condition)} border`}
            variant="outline"
          >
            {getConditionLabel(tire.condition)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {tire.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden bg-muted">
            <img 
              src={tire.imageUrl} 
              alt={`${tire.brand} ${tire.model}`}
              className="w-full h-32 object-cover"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              Qty: {tire.quantity}
            </span>
          </div>
          
          {tire.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {tire.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {tire.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{tire.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(tire.dateAdded)}</span>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(tire)}
              className="flex-1"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(tire.id)}
              className="flex-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TireCard;
