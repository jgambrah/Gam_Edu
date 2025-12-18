import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      {/* Stats Cards Skeleton (Row of 4) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-xl bg-card space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[60px]" />
          </div>
        ))}
      </div>

      {/* Main Content Area (Chart + List) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Large Chart Area */}
        <div className="lg:col-span-4 border rounded-xl bg-card p-6">
          <div className="space-y-4">
             <div className="flex justify-between">
                <Skeleton className="h-5 w-[150px]" />
             </div>
             <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>

        {/* Side List Area */}
        <div className="lg:col-span-3 border rounded-xl bg-card p-6">
           <div className="space-y-4">
             <Skeleton className="h-5 w-[120px] mb-4" />
             {Array.from({ length: 5 }).map((_, i) => (
               <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  )
}
