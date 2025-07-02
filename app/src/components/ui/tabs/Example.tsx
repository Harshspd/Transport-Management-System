import React, { useState } from "react";
import Tabs, { Tab } from "./Tabs";

// Example usage of Tabs component
const Example: React.FC = () => {
    const tabData: Tab[] = [
        {
            label: "Tab 1",
            content: <div>This is the content of Tab 1.</div>,
        },
        {
            label: "Tab 2",
            content: <div>This is the content of Tab 2.</div>,
        },
        {
            label: "Tab 3",
            content: <div>This is the content of Tab 3.</div>,
        },
    ];

    return (
        <div>
            <h2>Tabs Example</h2>
            <Tabs tabs={tabData} />
        </div>
    );
};

export default Example;