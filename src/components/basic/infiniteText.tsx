const InfiniteText = ({text = "ตัวอย่าง"}: {text: string}) => {
  const items = Array(15).fill(text);

  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden relative">
      <span className="bg-gradient-to-r from-background via-background/90 to-transparent absolute top-0 left-0  h-full w-[6rem] z-10" />
      <span className="bg-gradient-to-l from-background via-background/90 to-transparent absolute top-0 right-0  h-full w-[6rem] z-10" />
      {["", ' aria-hidden="true"'].map((aria, index) => (
        <ul
          key={index}
          className="text-nowrap flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll"
          {...(index === 1 && {"aria-hidden": true})}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ))}
    </div>
  );
};

export default InfiniteText;
