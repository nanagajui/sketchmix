import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            flex-1 px-4 py-3 font-medium transition-colors
            ${activeTab === tab.id 
              ? 'text-purple-500 border-b-2 border-purple-500' 
              : 'text-gray-600 hover:text-purple-500'}
          `}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={`fas fa-${tab.icon} mr-2`}></i> {tab.label}
        </button>
      ))}
    </div>
  );
}
