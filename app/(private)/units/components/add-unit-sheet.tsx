"use client";

import { useState } from "react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Loader2 } from "lucide-react";
import {
  createUnitSchema,
  type CreateUnitInput,
} from "@/lib/validations/unit.schema";

export const AddUnitSheet = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      brand: "",
      plate: "",
      transmission: "Automatic",
      capacity: 1,
      pricePerDay: 0,
      status: "AVAILABLE" as const,
      imageUrl: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // Validate with Zod before submitting
        const validatedData = createUnitSchema.parse(value);

        // TODO: Replace with actual API call
        console.log("Creating unit:", validatedData);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Close sheet and reset form on success
        setOpen(false);
        form.reset();
      } catch (error) {
        console.error("Failed to create unit:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          className="gap-2 h-9 rounded-sm bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          Add New Unit
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Unit</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a new rental unit to your fleet.
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
                <Label htmlFor="name">
                  Unit Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Toyota Hiace Commuter"
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

          {/* Brand */}
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
                <Label htmlFor="brand">
                  Brand <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand"
                  placeholder="e.g., Toyota"
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
                <Label htmlFor="plate">
                  Plate Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="plate"
                  placeholder="e.g., ABC-1234"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  onBlur={field.handleBlur}
                  className="uppercase"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Transmission */}
          <form.Field
            name="transmission"
            validators={{
              onChange: ({ value }) => {
                const result =
                  createUnitSchema.shape.transmission.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="transmission">
                  Transmission <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Select transmission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Capacity and Price Per Day - Two columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* Capacity */}
            <form.Field
              name="capacity"
              validators={{
                onChange: ({ value }) => {
                  const result =
                    createUnitSchema.shape.capacity.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.errors[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="capacity">
                    Capacity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    placeholder="15"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value) || 0)
                    }
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

            {/* Price Per Day */}
            <form.Field
              name="pricePerDay"
              validators={{
                onChange: ({ value }) => {
                  const result =
                    createUnitSchema.shape.pricePerDay.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.errors[0]?.message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">
                    Price/Day <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="3500"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(parseFloat(e.target.value) || 0)
                    }
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
          </div>

          {/* Status */}
          <form.Field
            name="status"
            validators={{
              onChange: ({ value }) => {
                const result = createUnitSchema.shape.status.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as any)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="RENTED">Rented</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Image URL */}
          <form.Field
            name="imageUrl"
            validators={{
              onChange: ({ value }) => {
                const result = createUnitSchema.shape.imageUrl.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.errors[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
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

          <SheetFooter className="gap-4 px-0 flex item-center flex-row-reverse">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Unit"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
