import React from "react";

const Wrapper = ({
  children,
  noMargin,
  bgColor,
}: {
  children: React.ReactNode;
  noMargin?: boolean;
  bgColor?: string;
}) => {
  return (
    <div className={`relative w-full ${noMargin ? "" : "mb-[20px]"} "`}>
      <div
        className={`
          lg:w-[888px] w-[1188px] max-w-full mx-auto p-[20px] ${
            bgColor ? bgColor : "bg-white"
          }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
