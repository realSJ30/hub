import { Skeleton } from "@/components/ui/skeleton";
import { Car } from "lucide-react";

export const SignUpSkeleton = () => {
  return (
    <div className="flex md:flex-row flex-col py-4 gap-6 justify-between px-4 sm:px-8 md:px-12 mx-auto w-full min-h-screen font-sans">
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-2">
          <Car className="h-8 w-8 text-neutral-200" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-col justify-center mt-8 md:mt-12 flex-1 gap-4 w-full max-w-lg mx-auto md:max-w-none md:px-12 lg:px-24">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between mt-4">
            <Skeleton className="w-full sm:flex-1 h-10 rounded-md" />
            <Skeleton className="w-full sm:flex-1 h-10 rounded-md" />
          </div>

          <div className="flex items-center gap-4 my-2">
            <hr className="w-full" />
            <Skeleton className="h-4 w-4" />
            <hr className="w-full" />
          </div>

          <div className="flex flex-col gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>

            <Skeleton className="w-full h-10 rounded-md mt-6" />
          </div>

          <div className="flex justify-center mt-4">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col px-12 py-8 justify-start flex-1 bg-neutral-100 rounded-2xl p-6 relative">
        <Skeleton className="h-8 w-64 mt-34" />
        <Skeleton className="h-8 w-48 mt-2" />
        <Skeleton className="h-4 w-80 mt-4" />
        <div className="absolute bottom-32 right-10 opacity-20">
          <Skeleton className="h-[400px] w-[400px] rounded-full" />
        </div>
      </div>
    </div>
  );
};
