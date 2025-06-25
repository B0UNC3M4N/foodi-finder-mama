
import { DietaryCompatibility as DietaryCompatibilityType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Leaf, Heart, ShieldCheck } from "lucide-react";

interface DietaryCompatibilityProps {
  compatibility: DietaryCompatibilityType | null;
  className?: string;
}

const dietaryLabels = {
  keto: { label: "Keto", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  vegan: { label: "Vegan", icon: <Leaf className="h-3.5 w-3.5" /> },
  vegetarian: { label: "Vegetarian", icon: <Leaf className="h-3.5 w-3.5" /> },
  glutenFree: { label: "Gluten-Free", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  diabeticSafe: { label: "Diabetic-Safe", icon: <Heart className="h-3.5 w-3.5" /> },
  heartHealthy: { label: "Heart-Healthy", icon: <Heart className="h-3.5 w-3.5" /> }
};

const DietaryCompatibility = ({ compatibility, className }: DietaryCompatibilityProps) => {
  if (!compatibility) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compatible':
        return <CheckCircle className="h-3.5 w-3.5" />;
      case 'not-compatible':
        return <XCircle className="h-3.5 w-3.5" />;
      case 'caution':
        return <AlertTriangle className="h-3.5 w-3.5" />;
      default:
        return <CheckCircle className="h-3.5 w-3.5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compatible':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'not-compatible':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'caution':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Dietary Compatibility
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Compatibility Tags */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(compatibility).map(([diet, info]) => {
            if (diet === 'summary') return null;
            
            const dietInfo = info as { compatible: boolean; status: string; reason?: string };
            const label = dietaryLabels[diet as keyof typeof dietaryLabels];
            
            return (
              <Badge
                key={diet}
                variant="outline"
                className={`flex items-center gap-1.5 px-2.5 py-1 ${getStatusColor(dietInfo.status)}`}
              >
                {getStatusIcon(dietInfo.status)}
                {label?.icon}
                <span className="text-xs font-medium">
                  {dietInfo.compatible ? label?.label : `Not ${label?.label}`}
                </span>
              </Badge>
            );
          })}
        </div>

        {/* Detailed Status List */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          {Object.entries(compatibility).map(([diet, info]) => {
            if (diet === 'summary') return null;
            
            const dietInfo = info as { compatible: boolean; status: string; reason?: string };
            const label = dietaryLabels[diet as keyof typeof dietaryLabels];
            
            return (
              <div key={diet} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  {label?.icon}
                  <span className="text-sm font-medium">{label?.label}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    dietInfo.status === 'compatible' ? 'text-green-700' :
                    dietInfo.status === 'not-compatible' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    {getStatusIcon(dietInfo.status)}
                    <span>
                      {dietInfo.status === 'compatible' ? 'Yes' :
                       dietInfo.status === 'not-compatible' ? 'No' :
                       'Caution'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Message */}
        {compatibility.summary && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground italic">
              {compatibility.summary}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DietaryCompatibility;
