import React from 'react';
import logoSymbol from '../../assets/5e35d26808e8a4dc9bb613c768fd715c3fb5e067.png';
import logoText from '../../assets/da8dccd81c57f80a3f24697b3962eb0947dc4b65.png';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5">
      {/* Logo Symbol */}
      <img src={logoSymbol} alt="Vault AI Symbol" className="h-7" />
      {/* Logo Text */}
      <img src={logoText} alt="Vault AI" className="h-6 ml-[-51px] mr-[0px] mt-[0px] mb-[-4px]" />
    </div>
  );
};