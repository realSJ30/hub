"use client";

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
import { Loader2, AlertTriangle } from "lucide-react";
import { useDeleteUnit } from "@/hooks";
import type { Unit } from "../columns";

interface DeleteUnitDialogProps {
  unit: Unit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteUnitDialog = ({
  unit,
  open,
  onOpenChange,
}: DeleteUnitDialogProps) => {
  const [confirmName, setConfirmName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: deleteUnit, isPending } = useDeleteUnit();

  const isMatch = confirmName === unit?.name;

  const handleDelete = () => {
    if (!unit || !isMatch) return;

    setErrorMessage(null);
    deleteUnit(unit.id, {
      onSuccess: () => {
        onOpenChange(false);
        setConfirmName("");
      },
      onError: (error) => {
        setErrorMessage(error.message || "Failed to delete unit.");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertTriangle size={20} />
            <DialogTitle>Delete Unit</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the unit
            <strong> {unit?.name}</strong> and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-name" className="text-sm font-medium">
              To confirm, type{" "}
              <span className="font-bold select-all">"{unit?.name}"</span> in
              the box below:
            </Label>
            <Input
              id="confirm-name"
              placeholder="Type unit name to confirm"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className={
                confirmName && !isMatch
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3 border border-red-200">
              <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isMatch || isPending}
            className="gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Permanently Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
