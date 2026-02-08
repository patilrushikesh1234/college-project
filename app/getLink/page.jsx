"use client";
import React, { useState } from "react";
import { HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const StudentsLink = () => {
    const classLinks = [
        {
            className: "FY BCA",
            link: "https://docs.google.com/spreadsheets/d/1dG_hV65bO1yKTzDpAfShlI0e5-rYiXvzGa7T1NzOW90/edit?usp=drivesdk",
        },
        {
            className: "SY BCA",
            link: "https://docs.google.com/....",
        },
        {
            className: "TY BCA",
            link: "https://docs.google.com/....",
        },
        {
            className: "FY BSC",
            link: "https://docs.google.com/....",
        },
        {
            className: "SY BSC",
            link: "https://docs.google.com/....",
        },
        {
            className: "TY BSC",
            link: "https://docs.google.com/....",
        },
        {
            className: "MCA 1",
            link: "https://docs.google.com/....",
        },
        {
            className: "MCA 2",
            link: "https://docs.google.com/....",
        },
        {
            className: "MSC COMP 1",
            link: "https://docs.google.com/....",
        },
        {
            className: "MSC COMP 2",
            link: "https://docs.google.com/....",
        }
    ];

    const [copiedIndex, setCopiedIndex] = useState(null);

    const copyLink = (link, index) => {
        navigator.clipboard.writeText(link);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (

        <div className="px-4 mb-5 sm:px-6 md:px-8">

            {/* Header */}

            <div className="flex  justify-center items-center ">
                <Link href="/">
                    <div className="mx-2">
                        <HomeIcon className="h-10 w-10 "></HomeIcon>
                    </div>
                </Link>
                <div className="mb-6 mt-5 text-start">
                    <h1 className="text-md sm:text-2xl font-semibold text-gray-800">
                        Students Spreadsheet Links
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Access and copy class-wise Google Sheet links
                    </p>
                </div>
            </div>

            {/* Card */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="grid gap-3 sm:gap-4">
                    {classLinks.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow px-4 sm:px-5 py-3 sm:py-4"
                        >
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">

                                {/* Class Name */}
                                <span className="font-semibold text-sm text-gray-800 sm:min-w-[120px] text-center sm:text-left">
                                    {item.className}
                                </span>

                                {/* Link Input */}
                                <input
                                    type="text"
                                    value={item.link}
                                    readOnly
                                    className="flex-1 w-full px-3 py-2 text-xs sm:text-sm border rounded-lg bg-gray-100 focus:outline-none"
                                />

                                {/* Copy Button */}
                                <button
                                    onClick={() => copyLink(item.link, index)}
                                    className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    {copiedIndex === index ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default StudentsLink;
