import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-xl bg-muted/30", className)}>
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-6">
                <Icon size={32} className="text-muted-foreground/70" />
            </div>
            <h3 className="text-[16px] text-foreground font-medium mb-2">{title}</h3>
            <p className="text-[14px] text-muted-foreground max-w-sm mb-6">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
}

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({ title = "Something went wrong", message, onRetry, className }: ErrorStateProps) {
    return (
        <div className={cn("flex flex-col items-start p-6 border border-danger/30 rounded-xl bg-danger/5", className)}>
            <h3 className="text-[16px] text-danger font-medium mb-2">{title}</h3>
            <p className="text-[14px] text-muted-foreground mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-[13px] font-medium text-danger bg-danger/10 hover:bg-danger/20 px-4 py-2 rounded-md transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
