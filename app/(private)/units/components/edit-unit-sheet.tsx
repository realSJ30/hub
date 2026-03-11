"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import {
  createUnitSchema,
} from "@/lib/validations/unit.schema";
import { useUpdateUnit, useUploadUnitImage } from "@/hooks";
import type { Unit } from "../columns";
import Image from "next/image";

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
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateUnit, isPending } = useUpdateUnit();
  const { mutateAsync: uploadImage, isPending: uploadingImage } = useUploadUnitImage();

  const form = useForm({
    defaultValues: {
      name: "",
      brand: "",
      year: new Date().getFullYear(),
      plate: "",
      transmission: "Automatic",
      capacity: 1,
      pricePerDay: 0,
      status: "OPERATIONAL" as any,
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
      setImagePreviewUrl(unit.imageUrl || null);
      setErrorMessage(null);
    }
    if (!open) {
      setImagePreviewUrl(null);
      setErrorMessage(null);
    }
  }, [unit, open, form]);

  const handleImageUpload = async (file: File) => {
    setErrorMessage(null);
    try {
      const { publicUrl } = await uploadImage(file);
      form.setFieldValue("imageUrl", publicUrl);
      setImagePreviewUrl(publicUrl);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to upload image. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    form.setFieldValue("imageUrl", "");
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
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
                      <SelectItem value="OPERATIONAL">Operational</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Unit Image (Optional)</Label>
              <p className="text-xs text-neutral-500">JPEG only · Max 1 MB</p>

              {!imagePreviewUrl ? (
                <div
                  className="border-2 border-dashed border-neutral-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-neutral-50 transition-colors"
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-sm text-neutral-500">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-neutral-400" />
                      <p className="text-sm text-neutral-500">
                        Click to upload image
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    className="relative w-full h-40 rounded-lg overflow-hidden border border-neutral-200 block group"
                    onClick={() => setLightboxOpen(true)}
                    title="Click to view larger"
                  >
                    <Image
                      src={imagePreviewUrl}
                      alt="Unit preview"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white border border-neutral-200 rounded-full p-1 shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors"
                    title="Remove image"
                  >
                    <X className="h-3.5 w-3.5 text-neutral-600 hover:text-red-600" />
                  </button>
                  <button
                    type="button"
                    className="mt-2 text-xs text-neutral-500 underline underline-offset-2 hover:text-primary transition-colors"
                    onClick={() => {
                      handleRemoveImage();
                      setTimeout(() => fileInputRef.current?.click(), 50);
                    }}
                  >
                    Replace image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <SheetFooter className="gap-4 px-0 flex item-center flex-row-reverse">
              <Button type="submit" disabled={isPending || uploadingImage}>
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
                disabled={isPending || uploadingImage}
              >
                Cancel
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-2xl p-2">
          <DialogTitle className="sr-only">Unit Image Preview</DialogTitle>
          {imagePreviewUrl && (
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
              <Image
                src={imagePreviewUrl}
                alt="Unit image"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
