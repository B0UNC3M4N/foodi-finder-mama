
import { HistoryEntry } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Utensils } from "lucide-react";

interface HistoryItemProps {
  entry: HistoryEntry;
  onClick: (entry: HistoryEntry) => void;
  isActive?: boolean;
  className?: string;
  showDate?: boolean;
}

const HistoryItem = ({ 
  entry, 
  onClick, 
  isActive, 
  className,
  showDate = false
}: HistoryItemProps) => {
  const timeAgo = formatDistanceToNow(entry.timestamp, { addSuffix: true });
  const formattedDate = format(entry.timestamp, 'MMM dd');
  
  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
        "hover:bg-muted/50",
        isActive ? "bg-muted border-primary" : "border-transparent",
        "border",
        className
      )}
      onClick={() => onClick(entry)}
    >
      <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
        {entry.imageUrl ? (
          <img 
            src={entry.imageUrl} 
            alt={entry.result.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Utensils className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium truncate">{entry.result.name}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <span>{entry.result.nutrition?.calories} cal</span>
          <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
          {showDate ? (
            <span>{formattedDate}</span>
          ) : (
            <span>{timeAgo}</span>
          )}
        </p>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            {Math.round(entry.result.score * 100)}%
          </span>
        </div>
        {entry.result.allergenInfo && entry.result.allergenInfo.allergens.length > 0 && (
          <span className="text-xs font-medium text-amber-500">
            Allergens
          </span>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;
