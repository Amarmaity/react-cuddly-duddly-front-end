import React from "react";

const AdminInput = ({
    label,
    type = "text",
    name,
    placeholder,
    register,
    error,
    ...props
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block mb-2 text-sm font-medium">
                    {label}
                </label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                {...register}
                className="w-full border rounded-lg px-4 py-2"
                {...props}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default AdminInput;