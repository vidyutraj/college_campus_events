import { Link } from "react-router-dom";
import Typewriter from "./ui/Typewriter";

const features = [
    {
        emoji: "🎓",
        title: "For Students",
        description:
            "Browse events, filter by category, RSVP to events you're interested in, and manage your calendar.",
        link_label: "Sign up as Student",
        url: "/register",
    },
    {
        emoji: "🏢",
        title: "For Event Leaders",
        description:
            "Register your organization and create events. View RSVPs and track attendance.",
        link_label: "Register Organization",
        url: "/create-organization",
    },
    {
        emoji: "📅",
        title: "Event Discovery",
        description:
            "Find events by category, date, organization, modality, and perks. Never miss an event again!",
        link_label: "Explore Events",
        url: "/events",
    },
];

function Homepage() {
    return (
        <div className="min-h-[calc(100vh-80px)] w-full">
            {/* Hero Section */}
            <div className="text-white text-center py-35 px-5 mb-16 bg-linear-to-br from-primary to-secondary">
                <h1 className="text-5xl md:text-6xl font-semibold mb-5">
                    Welcome to{" "}
                    <span className="font-bold text-7xl underline decoration-tertiary underline-offset-8">
                        <Typewriter text="CampusBuzz" speed={90} />
                    </span>
                </h1>
                <p className="text-xl md:text-2xl mb-10 opacity-95 font-light">
                    Discover, RSVP, and manage campus events all in one place
                </p>
                <div className="flex gap-8 justify-center flex-wrap">
                    <Link
                        to="/events"
                        className="bg-linear-180 from-tertiary to-[#f7ae40] hover:brightness-110
                                   text-foreground px-8 py-3.5 rounded-full text-xl font-semibold 
                                   shadow-tertiary/10 shadow-lg hover:shadow-xl
                                   transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Browse Events
                    </Link>
                    <Link
                        to="/login"
                        className="bg-transparent text-white border-2 border-white px-8 py-3.5 rounded-full text-xl font-semibold transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-5 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-xs
                                       transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="text-6xl mb-5">{feature.emoji}</div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-foreground/80 leading-relaxed mb-5">
                                {feature.description}
                            </p>
                            <Link
                                to={feature.url}
                                className="text-primary font-medium hover:text-primary-dark hover:underline"
                            >
                                {feature.link_label} →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-secondary/10 text-center py-16 px-5">
                <h2 className="text-4xl font-semibold mb-4 underline decoration-tertiary underline-offset-4">
                    Ready to get started?
                </h2>
                <p className="opacity-90 text-lg mb-10 max-w-2xl mx-auto">
                    Join thousands of students discovering amazing campus events
                </p>
                <div className="flex gap-5 justify-center flex-wrap">
                    <Link
                        to="/register"
                        className="bg-tertiary px-10 py-2 border-2 border-tertiary hover:border-tertiary-dark rounded-full text-lg font-medium transition-all duration-300 hover:bg-tertiary-dark"
                    >
                        Create Student Account
                    </Link>
                    <Link
                        to="/events"
                        className="border-2 border-foreground px-10 py-2 rounded-full text-lg font-medium transition-all duration-300 hover:text-white hover:bg-foreground"
                    >
                        Browse Events
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
