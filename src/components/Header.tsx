
import { cn } from "@/lib/utils";
import { CameraIcon } from "lucide-react";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn(
      "w-full py-4 px-6 flex items-center justify-between",
      "border-b border-border/40",
      "bg-background/80 backdrop-blur-sm",
      "sticky top-0 z-10",
      className
    )}>
      <div className="flex items-center space-x-2">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <CameraIcon className="h-5 w-5" />
        </div>
        <h1 className="text-lg font-semibold">
          NutriScan
        </h1>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Home
        </a>
        <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          History
        </a>
        <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          About
        </a>
      </nav>
    </header>
  );
};

export default Header;
