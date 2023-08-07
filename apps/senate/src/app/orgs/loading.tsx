export default function Loading() {
  const rectangles = new Array(12).fill(null);

  return (
    <div>
      <p className="mb-4 w-1/2 h-[50px] text-[36px] font-bold leading-[36px] text-white bg-[#545454] animate-pulse"></p>
      <div className="grid grid-cols-1 place-items-center gap-10 min-[650px]:grid-cols-2 min-[900px]:grid-cols-3 lg:place-items-start min-[1200px]:grid-cols-4 min-[1500px]:grid-cols-5 min-[1800px]:grid-cols-6 min-[2200px]:grid-cols-7 min-[2300px]:grid-cols-8 min-[2500px]:grid-cols-9 min-[3000px]:grid-cols-10">
        {rectangles.map((_, index) => (
          <div
            key={index}
            className="h-[320px] w-[240px] bg-[#545454] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
