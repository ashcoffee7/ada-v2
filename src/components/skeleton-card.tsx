export default function SkeletonCard() {
  return (
    <div className="flex flex-col flex-1 min-w-[350px] max-w-[400px] bg-white p-5 rounded-[20px] shadow-lg animate-pulse">
      <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg self-center mb-6" />
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
    </div>
  );
}