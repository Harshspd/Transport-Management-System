import React, { useState, ReactNode } from "react";

export type Tab = {
    title: string;
    content: ReactNode;
     icon?: ReactNode; // Added Optional icon prop
};

type TabsProps = {
    tabs: Tab[];
    initialIndex?: number;
    className?: string;
};

const Tabs: React.FC<TabsProps> = ({ tabs, initialIndex = 0, className = "" }) => {
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    return (
        <div className={`w-full ${className}`}>
            <div className="flex border-b">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.title}
                        //added flex in className to make icons appears beside title
                        className={`flex px-4 py-2 -mb-px border-b-2 transition-colors duration-200 ${
                            activeIndex === idx
                                ? "border-blue-500 text-blue-600 font-semibold"
                                : "border-transparent text-gray-500 hover:text-blue-500"
                        }`}
                        onClick={() => setActiveIndex(idx)}
                        type="button"
                    >
                         {/* ADDED to show icon if present */}
                        {tab.icon && <span className="pt-1 mr-2">{tab.icon}</span>}
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="p-4">
                {tabs[activeIndex]?.content}
            </div>
        </div>
    );
};

export default Tabs;