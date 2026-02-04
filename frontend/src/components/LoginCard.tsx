import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginCard() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Login attempt:", { userId, password });
    };

    return (
        <div className="login-card w-full max-w-md relative">
            {/* Wide, diffused ambient shadow - outermost layer for floating effect */}
            <div className="absolute -inset-16 rounded-[4rem] bg-gradient-to-br from-cyan-500/5 via-violet-500/3 to-amber-500/2 blur-[80px] opacity-70" />

            {/* Mid-range ambient glow */}
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-tr from-cyan-400/6 via-violet-400/4 to-blue-400/3 blur-[50px] opacity-80" />

            {/* Close-range soft glow */}
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-cyan-300/4 via-violet-300/3 to-transparent blur-[30px]" />

            {/* Main card container - solid glass slab */}
            <div className="relative">
                {/* Outer glass border with refined edge highlight */}
                <div className="absolute inset-0 rounded-3xl border border-white/[0.15] pointer-events-none" />

                {/* Chromatic aberration - very subtle color separation */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none opacity-40">
                    <div
                        className="absolute inset-0 rounded-3xl border border-red-400/6"
                        style={{
                            transform: "translate(-0.25px, -0.25px)",
                        }}
                    />
                    <div
                        className="absolute inset-0 rounded-3xl border border-cyan-400/6"
                        style={{
                            transform: "translate(0.25px, 0.25px)",
                        }}
                    />
                </div>

                {/* Glass thickness - inner edge shadows */}
                <div className="absolute inset-[1px] rounded-3xl pointer-events-none">
                    {/* Top inner shadow - subtle depth */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/[0.12] to-transparent rounded-t-3xl" />
                    {/* Bottom inner shadow - stronger for gravity feel */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/[0.18] to-transparent rounded-b-3xl" />
                    {/* Left inner shadow */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/[0.10] to-transparent rounded-l-3xl" />
                    {/* Right inner shadow */}
                    <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black/[0.10] to-transparent rounded-r-3xl" />
                </div>

                {/* Main glass surface - true transparent material */}
                <div className="relative backdrop-blur-3xl bg-white/[0.02] rounded-3xl p-10 overflow-hidden">
                    {/* LAYERED STROKES - multiple borders for rolled edge effect */}
                    {/* Outer stroke - bright cool white */}
                    <div className="absolute inset-0 rounded-3xl border border-white/[0.30] pointer-events-none" />
                    {/* Inner stroke - darker gray-blue for depth */}
                    <div className="absolute inset-[1px] rounded-3xl border border-blue-900/[0.10] pointer-events-none" />

                    {/* DIRECTIONAL LIGHT BLOB - top-left light source (not center!) */}
                    <div
                        className="absolute -top-20 -left-20 w-[280px] h-[280px] pointer-events-none opacity-90"
                        style={{
                            background:
                                "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(240,253,255,0.05) 30%, rgba(224,242,254,0.02) 50%, transparent 70%)",
                            filter: "blur(40px)",
                        }}
                    />

                    {/* Secondary light blob - smaller, offset */}
                    <div
                        className="absolute top-8 left-12 w-[160px] h-[160px] pointer-events-none opacity-70"
                        style={{
                            background:
                                "radial-gradient(circle at center, rgba(6,182,212,0.06) 0%, rgba(6,182,212,0.02) 50%, transparent 70%)",
                            filter: "blur(30px)",
                        }}
                    />

                    {/* OPPOSITE SIDE - no light zone (bottom-right darkness) */}
                    <div
                        className="absolute bottom-0 right-0 w-[200px] h-[200px] pointer-events-none opacity-80"
                        style={{
                            background:
                                "radial-gradient(circle at bottom right, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.03) 40%, transparent 70%)",
                            filter: "blur(35px)",
                        }}
                    />

                    {/* Inner shadows - REDUCED and only at edges for depth */}
                    <div className="absolute inset-[1px] rounded-3xl pointer-events-none">
                        {/* Top inner shadow - very subtle */}
                        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/[0.04] to-transparent rounded-t-3xl" />
                        {/* Bottom inner shadow - slightly stronger for gravity */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/[0.08] to-transparent rounded-b-3xl" />
                        {/* Left inner shadow - minimal */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/[0.03] to-transparent rounded-l-3xl" />
                        {/* Right inner shadow - slightly stronger (opposite from light) */}
                        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black/[0.06] to-transparent rounded-r-3xl" />
                    </div>

                    {/* Edge highlights - reinforcing top-left light direction */}
                    <div className="absolute top-0 left-[10%] right-[40%] h-[2px] bg-gradient-to-r from-white/50 via-white/30 to-transparent" />
                    <div className="absolute top-0 left-[12%] right-[45%] h-[1px] bg-gradient-to-r from-cyan-100/60 via-cyan-200/40 to-transparent blur-[0.5px]" />
                    <div className="absolute left-0 top-[10%] bottom-[40%] w-[1.5px] bg-gradient-to-b from-white/30 via-violet-200/20 to-transparent" />

                    {/* Corner light blob - concentrated top-left */}
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-white/[0.15] via-cyan-100/[0.08] to-transparent rounded-tl-3xl pointer-events-none" />

                    {/* Subtle refraction - very light color shifts */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-40">
                        <div
                            className="absolute inset-0 rounded-3xl"
                            style={{
                                background:
                                    "linear-gradient(125deg, rgba(6,182,212,0.04) 0%, transparent 15%, transparent 85%, rgba(139,92,246,0.02) 100%)",
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <h2 className="text-3xl text-white font-light mb-2 text-center">
                            Log in
                        </h2>
                        <p className="text-gray-400 text-sm font-light mb-8 text-center">
                            Access your AI workspace
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >
                            {/* User ID Input */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="userId"
                                    className="block text-sm text-gray-400 font-light"
                                >
                                    User ID
                                </label>
                                <div className="relative">
                                    <input
                                        id="userId"
                                        type="text"
                                        value={userId}
                                        onChange={(e) =>
                                            setUserId(e.target.value)
                                        }
                                        className="glass-input w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all duration-300"
                                        placeholder="Enter your user ID"
                                    />
                                    <div className="input-glow" />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm text-gray-400 font-light"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="glass-input w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.04] transition-all duration-300 pr-12"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                    <div className="input-glow" />
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <a
                                    href="#"
                                    className="text-xs text-gray-500 hover:text-cyan-400 transition-colors font-light"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Signature Liquid Glass Button - DIRECTIONAL LIGHTING */}
                            <button
                                type="submit"
                                className="liquid-glass-btn w-full py-3.5 rounded-lg text-white font-light tracking-wide relative overflow-hidden group"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                onMouseDown={() => setIsPressed(true)}
                                onMouseUp={() => setIsPressed(false)}
                            >
                                {/* Lighter glass shell - almost floating */}
                                <div className="absolute inset-0 rounded-lg backdrop-blur-3xl bg-white/[0.06]" />

                                {/* LAYERED STROKES - matching card */}
                                {/* Outer stroke - bright cool white */}
                                <div className="absolute inset-0 rounded-lg border border-white/[0.28] pointer-events-none" />
                                {/* Inner stroke - darker gray-blue */}
                                <div className="absolute inset-[1px] rounded-lg border border-blue-900/[0.08] pointer-events-none" />

                                {/* Minimal inner layer */}
                                <div className="absolute inset-[1.5px] rounded-lg backdrop-blur-2xl bg-white/[0.02]" />

                                {/* DIRECTIONAL LIGHT BLOB - top-left only (matching card's light source) */}
                                <div
                                    className="absolute -top-4 -left-4 w-[100px] h-[100px] pointer-events-none opacity-80"
                                    style={{
                                        background:
                                            "radial-gradient(circle at center, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)",
                                        filter: "blur(25px)",
                                    }}
                                />

                                {/* NO LIGHT ZONE - bottom-right darkness */}
                                <div
                                    className="absolute bottom-0 right-0 w-[80px] h-[80px] pointer-events-none opacity-70"
                                    style={{
                                        background:
                                            "radial-gradient(circle at bottom right, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 50%, transparent 70%)",
                                        filter: "blur(20px)",
                                    }}
                                />

                                {/* Edge highlights - stronger on top-left where light hits */}
                                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                                    {/* Top edge - strong light catch on left side only */}
                                    <div className="absolute top-0 left-0 right-[40%] h-[2px] bg-gradient-to-r from-white/70 via-white/50 to-transparent" />
                                    <div className="absolute top-0 left-[8%] right-[45%] h-[1px] bg-gradient-to-r from-cyan-100/70 via-cyan-200/50 to-transparent blur-[0.5px]" />
                                    {/* Bottom edge - minimal light */}
                                    <div className="absolute bottom-0 left-[20%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-violet-200/20 to-transparent" />
                                    {/* Left edge - catching light */}
                                    <div className="absolute left-0 top-0 bottom-[40%] w-[1.5px] bg-gradient-to-b from-white/40 via-cyan-200/30 to-transparent" />
                                    {/* Right edge - in shadow */}
                                    <div className="absolute right-0 top-[30%] bottom-0 w-[1px] bg-gradient-to-b from-transparent via-violet-200/15 to-transparent" />
                                </div>

                                {/* Internal light flow on hover */}
                                <div
                                    className={`internal-light-sweep ${isHovering ? "active" : ""}`}
                                />

                                {/* Light compression effect on click */}
                                <div
                                    className={`light-compress ${isPressed ? "compressed" : ""}`}
                                />

                                {/* Top-left corner light catch - concentrated where light source hits */}
                                <div className="absolute top-0 left-0 w-16 h-14 bg-gradient-to-br from-white/[0.25] via-cyan-100/[0.12] to-transparent rounded-tl-lg pointer-events-none" />

                                <span className="relative z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                                    Log in
                                </span>
                            </button>

                            {/* Divider */}
                            <div className="flex items-center my-6">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>

                            {/* Sign up link */}
                            <p className="text-center text-sm text-gray-500 font-light">
                                Don't have an account?{" "}
                                <a
                                    href="#"
                                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    Sign up
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
