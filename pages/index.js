export default function Home() {
  return (
    <div className="mx-10">
      <h1 className="text-2xl font-bold">Mood</h1>
      <div className="grid grid-rows-7 grid-flow-col gap-[2.5px] max-w-fit overflow-x-auto pb-1">
        {Array(365)
          .fill()
          .map((_, i) => (
            <button
              className="w-[12px] h-[12px] border border-black rounded-[2px]"
              key={i}
            ></button>
          ))}
      </div>
    </div>
  );
}
