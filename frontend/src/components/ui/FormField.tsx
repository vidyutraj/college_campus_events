interface Option {
    value: string | number;
    label: string;
}

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string | number | boolean;
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    required?: boolean;
    options?: Option[];
    textarea?: boolean;
    step?: string;
}

export default function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
    options,
    textarea = false,
    step,
}: FormFieldProps) {
    const baseClass =
        "mt-1 block w-full border border-gray-300 rounded-md shadow-xs p-2 focus:ring-indigo-500 focus:border-indigo-500";

    if (type === "checkbox") {
        return (
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name={name}
                    checked={Boolean(value)}
                    onChange={onChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-900">{label}{required && " *"}</span>
            </label>
        );
    }

    if (options) {
        return (
            <div>
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}{required && " *"}
                </label>
                <select
                    id={name}
                    name={name}
                    value={value as string}
                    onChange={onChange}
                    required={required}
                    className={baseClass}
                >
                    <option value="">Select an option</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (textarea) {
        return (
            <div>
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}{required && " *"}
                </label>
                <textarea
                    id={name}
                    name={name}
                    value={value as string}
                    onChange={onChange}
                    required={required}
                    rows={4}
                    className={baseClass}
                />
            </div>
        );
    }

    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}{required && " *"}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value as string | number}
                onChange={onChange}
                required={required}
                step={step}
                className={baseClass}
            />
        </div>
    );
}
