import imgImage1 from "../assets/e2b94019119eda7b10e43b0b68acc1a55e8babf5.png";
import { imgImage2, imgImage3 } from "./svg-12jzx";

function MaskGroup1() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Mask group">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute blur-[8px] h-[1872px] left-[-225.13px] mask-position-[450.255px_839px,_444.255px_833px] top-[-419.5px] w-[1768px]" data-name="image 1" style={{ maskImage: `url('${imgImage2}'), url('${imgImage3}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[171.55%] left-0 max-w-none top-[-35.77%] w-full" src={imgImage1} />
        </div>
      </div>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents left-[-0.74px] top-0" data-name="Mask group">
      <MaskGroup1 />
    </div>
  );
}

function Group() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute contents left-[calc(50%-0.12px)] top-1/2">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.06%_0_-0.09%] opacity-12 rounded-[94px] shadow-[0px_0px_0.5px_1.5px_rgba(0,0,0,0.68),0px_289px_81px_0px_rgba(0,1,48,0.02),0px_185px_74px_0px_rgba(0,1,48,0.15),0px_104px_62px_0px_rgba(0,1,48,0.5),0px_46px_46px_0px_rgba(0,1,48,0.85),0px_12px_25px_0px_rgba(0,1,48,0.98)]" />
      <MaskGroup />
      <div className="absolute border-4 border-solid border-white inset-[0_-0.06%_0_-0.09%] rounded-[94px]" />
      <div className="absolute backdrop-blur-[6px] bg-[rgba(255,255,255,0.01)] blur-[3px] inset-[2.56%_0.69%] rounded-[94px]" />
    </div>
  );
}

function Frame({ className }: { className?: string }) {
  return (
    <div className={className || "-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[10px] items-center justify-center left-[calc(50%+0.5px)] px-[49px] py-[62px] rounded-[94px] top-1/2"}>
      <Group />
      <p className="font-['SF_Pro_Display:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[92px] text-white" dir="auto">
        Liquid Glass Button
      </p>
    </div>
  );
}

export default function PluginFileCover() {
  return (
    <div className="bg-white relative size-full" data-name="Plugin / file cover - 1">
      <div className="absolute h-[1080px] left-0 top-0 w-[1920px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <Frame />
    </div>
  );
}