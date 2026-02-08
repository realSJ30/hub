"use client";

import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import {
  createUnitSchema,
  type CreateUnitInput,
} from "@/lib/validations/unit.schema";
import { useUpdateUnit } from "@/hooks";
import type { Unit } from "../columns";

interface EditUnitSheetProps {
  unit: Unit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditUnitSheet = ({
  unit,
  open,
  onOpenChange,
}: EditUnitSheetProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: updateUnit, isPending } = useUpdateUnit();

  const form = useForm({
    defaultValues: {
      name: "",
      brand: "",
      year: new Date().getFullYear(),
      plate: "",
      transmission: "Automatic",
      capacity: 1,
      pricePerDay: 0,
      status: "AVAILABLE" as any,
      imageUrl: "",
    },
    onSubmit: async ({ value }) => {
      if (!unit) return;

      try {
        const validatedData = createUnitSchema.parse(value);
        setErrorMessage(null);

        updateUnit(
          { id: unit.id, data: validatedData },
          {
            onSuccess: () => {
              onOpenChange(false);
            },
            onError: (error) => {
              setErrorMessage(error.message || "Failed to update unit.");
            },
          },
        );
      } catch (error) {
        setErrorMessage("Please check your input and try again.");
      }
    },
  });

  // Sync form with unit data when sheet opens
  useEffect(() => {
    if (unit && open) {
      form.setFieldValue("name", unit.name);
      form.setFieldValue("brand", unit.brand);
      form.setFieldValue("year", unit.year);
      form.setFieldValue("plate", unit.plate);
      form.setFieldValue("transmission", unit.transmission);
      form.setFieldValue("capacity", unit.capacity);
      form.setFieldValue("pricePerDay", unit.pricePerDay);
      form.setFieldValue("status", unit.status as any);
      form.setFieldValue("imageUrl", unit.imageUrl || "");
    }
  }, [unit, open, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Unit</SheetTitle>
          <SheetDescription>
            Update the details for <strong>{unit?.name}</strong>.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 py-6 p-6"
        >
          {/* Unit Name */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = createUnitSchema.shape.name.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-name">Unit Name *</Label>
                <Input
                  id="edit-name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Brand & Year */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="brand"
              validators={{
                onChange: ({ value }) => {
                  const result = createUnitSchema.shape.brand.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.errors[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand *</Label>
                  <Input
                    id="edit-brand"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>

            <form.Field
              name="year"
              validators={{
                onChange: ({ value }) => {
                  const result = createUnitSchema.shape.year.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.errors[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Year *</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value) || 0)
                    }
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.Field>
          </div>

          {/* Plate Number */}
          <form.Field
            name="plate"
            validators={{
              onChange: ({ value }) => {
                const result = createUnitSchema.shape.plate.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-plate">Plate Number *</Label>
                <Input
                  id="edit-plate"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  onBlur={field.handleBlur}
                  className="uppercase"
                />
              </div>
            )}
          </form.Field>

          {/* Transmission */}
          <form.Field name="transmission">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-transmission">Transmission *</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger id="edit-transmission">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Capacity and Price Per Day */}
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="capacity">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Capacity *</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="pricePerDay">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price/Day *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              )}
            </form.Field>
          </div>

          {/* Status */}
          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as any)}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="RENTED">Rented</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Image URL */}
          <form.Field name="imageUrl">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  type="url"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          <SheetFooter className="gap-4 px-0 flex item-center flex-row-reverse">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Unit"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
