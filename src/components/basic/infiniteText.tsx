const InfiniteText = ({text = "ตัวอย่าง"}: {text: string}) => {
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden ">
      <ul className="text-nowrap flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll">
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
      </ul>
      <ul
        className="text-nowrap flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true">
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
        <li>{text}</li>
      </ul>
    </div>
  );
};

export default InfiniteText;
