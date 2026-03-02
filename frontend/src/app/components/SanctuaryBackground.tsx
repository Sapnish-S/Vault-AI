import React from 'react';

export const SanctuaryBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-black">
      {/* 
        [비디오 배경 설정]
        사용자가 지정한 동영상 파일이 원본 화질 그대로 배경에 재생됩니다.
      */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source 
          src="https://res.cloudinary.com/den530nfq/video/upload/Recording_2026-03-01_174050_ab8mh3_923bc7.mp4" 
          type="video/mp4" 
        />
      </video>
    </div>
  );
};
