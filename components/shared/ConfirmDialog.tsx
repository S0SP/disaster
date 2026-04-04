"use client";

import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    isConfirming?: boolean;
    variant?: "primary" | "danger";
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    isConfirming = false,
    variant = "primary"
}: ConfirmDialogProps) {

    const confirmClasses = variant === "danger"
        ? "bg-danger text-foreground hover:bg-danger/90"
        : "bg-text-primary text-bg-primary hover:bg-text-primary/90";

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-32px)] max-w-[380px] bg-card border border-border shadow-2xl rounded-xl p-6 z-50 animate-in zoom-in-95 duration-200">
                    <Dialog.Title className="text-[18px] font-semibold text-foreground mb-2 ">
                        {title}
                    </Dialog.Title>
                    <Dialog.Description className="text-[14px] text-muted-foreground leading-relaxed mb-6">
                        {description}
                    </Dialog.Description>

                    <div className="flex gap-3 justify-end mt-8">
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted rounded-md transition-colors"
                                disabled={isConfirming}
                            >
                                {cancelLabel}
                            </button>
                        </Dialog.Close>
                        <button
                            onClick={onConfirm}
                            disabled={isConfirming}
                            className={`px-4 py-2 text-[13px] font-medium rounded-md transition-colors flex items-center justify-center min-w-[100px] ${confirmClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isConfirming ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                confirmLabel
                            )}
                        </button>
                    </div>

                    <Dialog.Close asChild>
                        <button
                            className="absolute top-4 right-4 text-muted-foreground/70 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-text-secondary rounded"
                            aria-label="Close"
                            disabled={isConfirming}
                        >
                            <X size={18} />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
