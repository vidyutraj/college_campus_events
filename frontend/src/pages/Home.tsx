import { Link } from "react-router-dom";
import TechTower from "../assets/tech-tower.jpg";
import { LuArrowRight } from "react-icons/lu";
import { useEffect, useState } from "react";

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
        url: "/organizations/create",
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

export default function Home() {
    const words = ["Buzz", "News", "Updates", "Trends"];
    const [index, setIndex] = useState(0);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3500);

        return () => clearInterval(interval);
    }, [words.length]);

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value);
    }

    return (
        <div className="min-h-[calc(100vh-80px)] w-full">
            <div className="min-h-[80vh] w-full flex-col justify-center bg-[url(/grid.jpg)] bg-background/97 bg-blend-lighten">
                <div className="w-full max-w-7xl flex gap-15 flex-col lg:flex-row pt-10 px-20">
                    <div className="w-full lg:w-3/5 py-10 flex flex-col gap-8 justify-center">
                        <h1 className="text-7xl font-bold">
                            Catch the Latest{" "}
                            <span
                                key={index}
                                className="underline slide-word decoration-tertiary underline-offset-8"
                            >
                                {words[index]}
                            </span>{" "}
                            Around Campus
                        </h1>
                        <h4 className="text-3xl">
                            Discover, RSVP, and manage campus events all in one
                            place.
                        </h4>
                        <div className="flex items-center mt-5">
                            <input
                                className="border-2 border-foreground/60 rounded-full px-5 py-3 text-xl w-full max-w-120 bg-background focus:border-secondary focus:outline-none focus:ring-5 focus:ring-secondary/15"
                                placeholder="Search events..."
                                value={searchInput}
                                onChange={handleSearchInput}
                            ></input>
                            <Link
                                to={`/events${
                                    searchInput ? "?search=" + searchInput : ""
                                }`}
                                className="-ml-12"
                            >
                                <div className=" w-10 h-10 bg-secondary text-background text-2xl flex items-center justify-center rounded-full">
                                    <LuArrowRight />
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/5 flex items-center justify-center">
                        <img
                            className="aspect-square lg:aspect-auto object-cover object-bottom w-full max-w-120 lg:max-w-90 rounded-3xl"
                            src={TechTower}
                        />
                    </div>
                </div>
                <div className="w-full h-10 bg-linear-to-b from-transparent to-white"></div>
            </div>

            {/* Features Section */}
            <div className="mx-auto px-5 pt-6 pb-12 bg-white">
                <div className="max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
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
