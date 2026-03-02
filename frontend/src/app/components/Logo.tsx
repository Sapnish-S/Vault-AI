import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5">
      {/* Logo Symbol */}
      <img src="/logo-symbol.png" alt="Vault AI Symbol" className="h-7" />
      {/* Logo Text */}
      <img src="/logo-text.png" alt="Vault AI" className="h-6 ml-[-51px] mr-[0px] mt-[0px] mb-[-4px]" />
    </div>
  );
};