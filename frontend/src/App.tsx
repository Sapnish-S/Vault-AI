import { useState } from "react";
import { GlassFloatingElements } from "./components/GlassFloatingElements";
import { LoginCard } from "./components/LoginCard";

export default function App() {
    const [isHovering] = useState(false);

    return (
        <div className="min-h-screen bg-black flex overflow-hidden relative">
            {/* Background subtle glow */}
            <div className="absolute inset-0 bg-gradient-radial from-violet-950/10 via-transparent to-transparent opacity-30" />

            {/* Left Section - Brand Area (40-45%) */}
            <div className="relative w-[42%] flex items-center justify-center overflow-hidden">
                {/* Floating glass elements */}
                <GlassFloatingElements isInteracting={isHovering} />

                {/* Logo with subtle motion */}
                <div className="relative z-10 text-center logo-container">
                    <h1 className="text-7xl font-extralight text-white tracking-[0.3em] mb-2">
                        VAULT
                    </h1>
                    <div className="text-2xl font-light text-gray-400 tracking-[0.5em] ml-2">
                        AI
                    </div>
                </div>
            </div>

            {/* Right Section - Login Interface (55-60%) */}
            <div className="w-[58%] flex items-center justify-center p-12 relative">
                {/* Environmental radial light spot - behind card top-left */}
                <div
                    className="absolute top-[15%] left-[20%] w-[500px] h-[500px] pointer-events-none opacity-90"
                    style={{
                        background:
                            "radial-gradient(circle at center, rgba(245,250,255,0.08) 0%, rgba(224,242,254,0.06) 20%, rgba(186,230,253,0.03) 40%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />

                {/* Login Card */}
                <LoginCard />
            </div>
        </div>
    );
}