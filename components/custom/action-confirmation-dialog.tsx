"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmationVariant = "default" | "danger" | "warning";

interface ActionConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  isPending?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: ConfirmationVariant;
}

const variantStyles = {
  default: {
    icon: <Info className="h-5 w-5 text-blue-600" />,
    title: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  danger: {
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    title: "text-red-600",
    button: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
    title: "text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
  },
};

export const ActionConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  isPending = false,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  variant = "default",
}: ActionConfirmationDialogProps) => {
  const styles = variantStyles[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-sm">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {styles.icon}
            <DialogTitle className={cn("text-lg font-bold", styles.title)}>
              {title}
            </DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="text-neutral-500 font-medium pt-1">
              {description}
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-sm"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "gap-2 rounded-sm font-bold min-w-[100px]",
              styles.button,
            )}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              confirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
