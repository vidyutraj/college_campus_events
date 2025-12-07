import type { Category, Organization } from "../../types";

interface Filters {
    category: string;
    organization: string;
    modality: string;
    hasFreeFood: boolean;
    hasFreeSwag: boolean;
    startDate: string;
    endDate: string;
    search: string;
}

interface Props {
    filters: Filters;
    categories: Category[];
    organizations: Organization[];
    handleFilterChange: (name: keyof Filters, value: string | boolean) => void;
    hasActiveFilters: boolean;
    clearFilters: () => void;
}

export default function EventsFilters({
    filters,
    categories,
    organizations,
    handleFilterChange,
    hasActiveFilters,
    clearFilters,
}: Props) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                    <label
                        htmlFor="category-filter"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Category:
                    </label>
                    <select
                        id="category-filter"
                        value={filters.category}
                        onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Organization */}
                <div>
                    <label
                        htmlFor="organization-filter"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Host Organization:
                    </label>
                    <select
                        id="organization-filter"
                        value={filters.organization}
                        onChange={(e) =>
                            handleFilterChange("organization", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Organizations</option>
                        {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Modality */}
                <div>
                    <label
                        htmlFor="modality-filter"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Modality:
                    </label>
                    <select
                        id="modality-filter"
                        value={filters.modality}
                        onChange={(e) =>
                            handleFilterChange("modality", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Types</option>
                        <option value="in-person">In-Person</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>

                {/* Start Date */}
                <div>
                    <label
                        htmlFor="start-date-filter"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Start Date:
                    </label>
                    <input
                        type="date"
                        id="start-date-filter"
                        value={filters.startDate}
                        onChange={(e) =>
                            handleFilterChange("startDate", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label
                        htmlFor="end-date-filter"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        End Date:
                    </label>
                    <input
                        type="date"
                        id="end-date-filter"
                        value={filters.endDate}
                        onChange={(e) =>
                            handleFilterChange("endDate", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Perks */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Perks:
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.hasFreeFood}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "hasFreeFood",
                                        e.target.checked
                                    )
                                }
                                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
                                🍕 Free Food
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.hasFreeSwag}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "hasFreeSwag",
                                        e.target.checked
                                    )
                                }
                                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
                                🎁 Free Swag
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={clearFilters}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
}
