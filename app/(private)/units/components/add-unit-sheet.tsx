"use client";

import { useState, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2, Upload, X, ImageIcon } from "lucide-react";
import {
  createUnitSchema,
} from "@/lib/validations/unit.schema";
import { useCreateUnit, useUploadUnitImage, useUnits, useSubscription } from "@/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Image from "next/image";

export const AddUnitSheet = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createUnit, isPending } = useCreateUnit();
  const { mutateAsync: uploadImage, isPending: uploadingImage } = useUploadUnitImage();
  const { data: unitsData } = useUnits();
  const { data: subData } = useSubscription();

  const isFreeLimitReached = !subData?.isPro && (unitsData?.data?.length || 0) >= 1;

  const form = useForm({
    defaultValues: {
      name: "",
      brand: "",
      year: new Date().getFullYear(),
      plate: "",
      transmission: "Automatic",
      capacity: 1,
      pricePerDay: 0,
      status: "OPERATIONAL" as const,
      imageUrl: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const validatedData = createUnitSchema.parse(value);
        setErrorMessage(null);

        createUnit(validatedData, {
          onSuccess: () => {
            setOpen(false);
            form.reset();
            setImagePreviewUrl(null);
          },
          onError: (error) => {
            setErrorMessage(
              error.message || "Failed to create unit. Please try again.",
            );
          },
        });
      } catch (error) {
        console.error("Validation error:", error);
        setErrorMessage("Please check your input and try again.");
      }
    },
  });

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

  const handleSheetOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
      setImagePreviewUrl(null);
      setErrorMessage(null);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleSheetOpenChange}>
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-block">
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-2 h-9 rounded-sm bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isFreeLimitReached}
                  >
                    <Plus size={16} />
                    Add New Unit
                  </Button>
                </SheetTrigger>
              </span>
            </TooltipTrigger>
            {isFreeLimitReached && (
              <TooltipContent className="bg-neutral-900 border-neutral-800 text-white z-50 px-3 py-1.5 rounded-md text-sm shadow-md" sideOffset={6}>
                <p>Upgrade to Pro to add more units.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
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

            {/* Year */}
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
                  <Label htmlFor="year">
                    Year <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2024"
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
                      <SelectItem value="OPERATIONAL">Operational</SelectItem>
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
                      unoptimized
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
                </div>
              )}
            </div>

            {/* Error Message Display */}
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
                    Creating...
                  </>
                ) : (
                  "Create Unit"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSheetOpenChange(false)}
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
                unoptimized
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
