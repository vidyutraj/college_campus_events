import BuzzCrown from "../../assets/buzz-crown.jpg";

interface AuthLayoutProps {
    children: React.ReactNode;
    sideImage?: string;
    imageAlt?: string;
    className?: string;
}

export default function AuthLayout({
    children,
    sideImage = BuzzCrown,
    imageAlt = "Buzz at a GT football game",
    className = "",
}: AuthLayoutProps) {
    return (
        <div
            className={`h-[calc(100vh-64px)] flex w-full bg-size-[600px] bg-[url(/grid.jpg)] bg-background/98 bg-blend-lighten ${className}`}
        >
            {/* Left Side (content) */}
            <div className="h-full w-full md:w-1/2 overflow-y-auto" id="left-scroll-container">
                <div className="py-10 px-12 w-full min-h-full flex justify-center items-center">
                    {children}
                </div>
            </div>

            {/* Right Side (image) */}
            {sideImage && (
                <div className="w-1/2 hidden md:block p-4">
                    <div className="w-full h-full shadow-inner shadow-secondary/50 bg-white rounded-xl">
                        <img
                            className="w-full h-full object-cover object-center rounded-xl mix-blend-multiply"
                            src={sideImage}
                            alt={imageAlt}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
