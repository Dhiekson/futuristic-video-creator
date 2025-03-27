
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface AnimatedTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  defaultValue?: string;
  className?: string;
  children: React.ReactNode[];
  onChange?: (value: string) => void;
}

const AnimatedTabs = ({
  tabs,
  defaultValue,
  className,
  children,
  onChange,
}: AnimatedTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].id);
  const [highlightStyle, setHighlightStyle] = useState({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  const updateHighlight = (index: number) => {
    const currentTab = tabsRef.current[index];
    if (currentTab) {
      const { offsetWidth, offsetHeight, offsetLeft } = currentTab;
      setHighlightStyle({
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`,
        transform: `translateX(${offsetLeft}px)`,
      });
    }
  };
  
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    updateHighlight(activeIndex >= 0 ? activeIndex : 0);
    
    // Handle resize events to update highlight position
    const handleResize = () => {
      const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
      updateHighlight(activeIndex >= 0 ? activeIndex : 0);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, tabs]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <Tabs
      defaultValue={defaultValue || tabs[0].id}
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn('w-full', className)}
    >
      <div className="relative mb-6">
        <TabsList className="relative w-full justify-start rounded-xl p-1 bg-secondary/50">
          <div
            className="tab-highlight"
            style={highlightStyle}
          />
          {tabs.map((tab, i) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              ref={el => (tabsRef.current[i] = el)}
              className="z-10 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium data-[state=active]:text-primary"
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {React.Children.map(children, (child, i) => (
        <TabsContent
          key={tabs[i]?.id || i}
          value={tabs[i]?.id || ''}
          className="animate-fade-in"
        >
          {child}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AnimatedTabs;
