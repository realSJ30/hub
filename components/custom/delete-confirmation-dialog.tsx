"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, Copy, Check } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmValue: string;
  isPending?: boolean;
  confirmButtonText?: string;
  placeholder?: string;
}

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmValue,
  isPending = false,
  confirmButtonText = "Permanently Delete",
  placeholder = "Type to confirm",
}: DeleteConfirmationDialogProps) => {
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isMatch = inputValue === confirmValue;

  const handleCopy = () => {
    navigator.clipboard.writeText(confirmValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!isMatch) return;
    setErrorMessage(null);
    onConfirm();
  };

  // Reset input when dialog opens
  React.useEffect(() => {
    if (open) {
      setInputValue("");
      setErrorMessage(null);
      setCopied(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle size={20} />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="confirm-input"
              className="text-sm font-medium text-neutral-600 flex flex-wrap items-center gap-1"
            >
              To confirm, type{" "}
              <div className="inline-flex items-center gap-1 px-1 bg-neutral-100 rounded border border-neutral-200">
                <span className="font-bold text-neutral-900 select-all">
                  {confirmValue}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 hover:bg-neutral-200 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check size={12} className="text-emerald-600" />
                  ) : (
                    <Copy size={12} className="text-neutral-400" />
                  )}
                </button>
              </div>{" "}
              below:
            </Label>
            <Input
              id="confirm-input"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={
                inputValue && !isMatch
                  ? "border-red-500 focus-visible:ring-red-500 rounded-sm h-10"
                  : "rounded-sm h-10"
              }
            />
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3 border border-red-200">
              <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-sm"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isMatch || isPending}
            className="gap-2 rounded-sm"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
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
