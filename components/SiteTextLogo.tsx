import type { FC } from "react";

const SiteTextLogo: FC = () => {
  return (
    <div className="flex items-center justify-center select-none">
      <div className="relative">
        <span className="font-bold text-2xl text-gray-600">123</span>
        <div className="absolute inline -top-1.5">
          <span className="font-bold text-sm text-gray-600">+</span>
          <span className="font-bold text-sm text-gray-600">+</span>
        </div>
      </div>
    </div>
  );
};

export default SiteTextLogo;
