/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wind, MessageSquare, Pencil, Zap, Droplet, Flame, Calculator, Sparkles, History, Trash2, Clock, BookOpen, Sun, Moon, Scale, CheckSquare, Square, Languages, PanelRightOpen, PanelRightClose, Layers, Download, Ruler, DollarSign } from 'lucide-react';
import { TabType, HistoryItem } from './types';
import MechanicalCalc from './components/MechanicalCalc';
import ElectricalCalc from './components/ElectricalCalc';
import PlumbingCalc from './components/PlumbingCalc';
import FireCalc from './components/FireCalc';
import BulkCalc from './components/BulkCalc';
import CostCalc from './components/CostCalc';
import EngineeringUnitConverter from './components/EngineeringUnitConverter';
import ReferenceModal from './components/ReferenceModal';
import CompareModal from './components/CompareModal';
import SidebarConversionList from './components/SidebarConversionList';
import { useLanguage } from './lib/translations';
import { exportElementToPdf } from './lib/exportPdf';
import { useUnit } from './lib/UnitContext';

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const { unitSystem, toggleUnitSystem } = useUnit();
  const [activeTab, setActiveTab] = useState<TabType>('mechanical');
  const workspaceRef = React.useRef<HTMLDivElement>(null);
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  const [isRefModalOpen, setIsRefModalOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cky_mepf_theme');
      return saved === 'light' ? false : true;
    } catch {
      return true;
    }
  });

  const [autoCalculate, setAutoCalculate] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cky_mepf_autocalculate');
      return saved === 'false' ? false : true;
    } catch {
      return true;
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cky_mepf_sidebar');
      // Default to false for luxurious maximized full-width on wide monitors
      return saved === 'true' ? true : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cky_mepf_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('cky_mepf_autocalculate', autoCalculate ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [autoCalculate]);

  useEffect(() => {
    try {
      localStorage.setItem('cky_mepf_sidebar', isSidebarOpen ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  }, [isSidebarOpen]);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cky_mepf_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restoredParams, setRestoredParams] = useState<HistoryItem | null>(null);

  // Side-by-Side comparison states
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  const updateHistoryNotes = (id: string, notes: string) => {
    setHistory((prev) => {
      const next = prev.map(p => p.id === id ? { ...p, notes } : p);
      localStorage.setItem('cky_mepf_history', JSON.stringify(next));
      return next;
    });
  };

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setHistory((prev) => {
      // Check for exact duplicates in parameters to avoid duplicates
      const filtered = prev.filter(p => JSON.stringify(p.parameters) !== JSON.stringify(item.parameters) || p.title !== item.title);
      const next = [newItem, ...filtered].slice(0, 5);
      localStorage.setItem('cky_mepf_history', JSON.stringify(next));
      return next;
    });
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem('cky_mepf_history', JSON.stringify(next));
      return next;
    });
    if (restoredParams?.id === id) {
      setRestoredParams(null);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cky_mepf_history');
    setRestoredParams(null);
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setActiveTab(item.tab);
    setRestoredParams(item);
  };

  const getDisciplineIcon = (tab: TabType) => {
    switch (tab) {
      case 'mechanical': return Wind;
      case 'electrical': return Zap;
      case 'plumbing': return Droplet;
      case 'fire': return Flame;
      case 'bulk': return Layers;
      default: return Wind;
    }
  };

  const getDisciplineColors = (tab: TabType) => {
    switch (tab) {
      case 'mechanical': return { bg: 'bg-emerald-950/20', border: 'border-emerald-900/30', text: 'text-emerald-400' };
      case 'electrical': return { bg: 'bg-amber-950/20', border: 'border-amber-900/30', text: 'text-amber-400' };
      case 'plumbing': return { bg: 'bg-cyan-950/20', border: 'border-cyan-900/30', text: 'text-cyan-400' };
      case 'fire': return { bg: 'bg-red-950/20', border: 'border-red-900/30', text: 'text-red-400' };
      case 'bulk': return { bg: 'bg-indigo-950/20', border: 'border-indigo-900/30', text: 'text-indigo-400' };
      default: return { bg: 'bg-emerald-950/20', border: 'border-emerald-900/30', text: 'text-emerald-400' };
    }
  };

  const renderActiveCalc = () => {
    const key = `${activeTab}-${restoredParams?.id || 'new'}`;
    switch (activeTab) {
      case 'mechanical': 
        return (
          <MechanicalCalc  isDarkMode={isDarkMode} 
            restoredParams={restoredParams} 
            onSaveCalculation={addHistoryItem} 
            autoCalculate={autoCalculate}
          />
        );
      case 'electrical': 
        return (
          <ElectricalCalc 
            restoredParams={restoredParams} 
            onSaveCalculation={addHistoryItem} 
            autoCalculate={autoCalculate}
          />
        );
      case 'plumbing': 
        return (
          <PlumbingCalc 
            restoredParams={restoredParams} 
            onSaveCalculation={addHistoryItem} 
            autoCalculate={autoCalculate}
          />
        );
      case 'fire': 
        return (
          <FireCalc 
            restoredParams={restoredParams} 
            onSaveCalculation={addHistoryItem} 
            autoCalculate={autoCalculate}
          />
        );
      case 'bulk': 
        return (
          <BulkCalc history={history} />
        );
      case 'cost':
        return (
          <CostCalc history={history} />
        );
      default: 
        return (
          <MechanicalCalc  isDarkMode={isDarkMode} 
            restoredParams={restoredParams} 
            onSaveCalculation={addHistoryItem} 
          />
        );
    }
  };

  const navItems = [
    { 
      id: 'mechanical' as TabType, 
      label: 'Mechanical / HVAC', 
      icon: Wind, 
      color: 'text-cyan-400', 
      bgHover: 'hover:bg-slate-900 hover:text-cyan-300', 
      activeBg: 'bg-cyan-950/30 border-cyan-500/40 text-cyan-400' 
    },
    { 
      id: 'electrical' as TabType, 
      label: 'Electrical FLC', 
      icon: Zap, 
      color: 'text-amber-400', 
      bgHover: 'hover:bg-slate-900 hover:text-amber-300', 
      activeBg: 'bg-amber-950/30 border-amber-500/40 text-amber-400' 
    },
    { 
      id: 'plumbing' as TabType, 
      label: 'Plumbing Velocity', 
      icon: Droplet, 
      color: 'text-cyan-400', 
      bgHover: 'hover:bg-slate-900 hover:text-cyan-300', 
      activeBg: 'bg-cyan-950/30 border-cyan-500/40 text-cyan-400' 
    },
    { 
      id: 'fire' as TabType, 
      label: 'FIRE FIGHTING', 
      icon: Flame, 
      color: 'text-red-400', 
      bgHover: 'hover:bg-slate-900 hover:text-red-300', 
      activeBg: 'bg-red-950/30 border-red-500/40 text-red-400' 
    },
    { 
      id: 'bulk' as TabType, 
      label: 'BULK BATCH', 
      icon: Layers, 
      color: 'text-indigo-400', 
      bgHover: 'hover:bg-slate-900 hover:text-indigo-300', 
      activeBg: 'bg-indigo-950/30 border-indigo-500/40 text-indigo-400' 
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      language === 'km' ? 'font-khmer' : 'font-sans'
    } ${
      isDarkMode ? 'app-theme-dark' : 'app-theme-light'
    } bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200
    }`}>
      
      {/* Background radial glowing ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/5 blur-[120px]" />
      </div>

      {/* Frosted Glass Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-tr from-sky-600 to-emerald-600 rounded-xl shadow-lg shadow-sky-950/40">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-black tracking-wider text-white">CKY_MEPF</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-md shadow-sky-400/50" />
                </div>
                <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{t('appSubtitle')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {/* Unit Toggle Button */}
              <button
                onClick={toggleUnitSystem}
                className="flex items-center justify-center gap-1 text-[10px] font-bold tracking-wider text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 h-8 px-2 rounded-full transition-all cursor-pointer shadow-sm"
                title="Toggle Metric/Imperial"
              >
                <Ruler className="h-3.5 w-3.5 text-emerald-400" />
                <span className="uppercase">{unitSystem === 'metric' ? 'MET' : 'IMP'}</span>
              </button>

              {/* Language Selector Button */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
                className="flex items-center justify-center text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 w-8 h-8 rounded-full transition-all cursor-pointer shadow-sm"
                title={language === 'en' ? "ប្តូរទៅភាសាខ្មែរ" : "Switch to English"}
              >
                <Languages className="h-3.5 w-3.5 text-sky-400" />
                
              </button>

              <button
                onClick={() => setIsRefModalOpen(true)}
                className="flex items-center justify-center text-xs font-bold text-sky-400 bg-sky-950/40 border border-sky-900/50 hover:bg-sky-900/30 hover:border-sky-500/30 w-8 h-8 rounded-full transition-all cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5" />
                
                
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-center text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 w-8 h-8 rounded-full transition-all cursor-pointer"
                title={isDarkMode ? "Switch to High-Contrast Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-indigo-400" />
                    
                  </>
                )}
              </button>

              {/* Auto Calculate Button */}
              <button
                onClick={() => setAutoCalculate(!autoCalculate)}
                className="flex items-center justify-center text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 w-8 h-8 rounded-full transition-all cursor-pointer"
                title={autoCalculate ? "Disable Auto-Calculate" : "Enable Auto-Calculate"}
              >
                <Zap className={`h-3.5 w-3.5 ${autoCalculate ? 'text-emerald-400' : 'text-slate-500'}`} />
              </button>




              {/* Export PDF Button */}
              <button
                onClick={() => exportElementToPdf('report-content', `CKY_MEPF_${activeTab}_report.pdf`)}
                className="flex items-center justify-center text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 w-8 h-8 rounded-full transition-all cursor-pointer"
                title="Download as PDF Report"
              >
                <Download className="h-3.5 w-3.5 text-indigo-400" />
              </button>

              {/* Sidebar toggle button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center justify-center text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 w-8 h-8 rounded-full transition-all cursor-pointer hidden lg:flex"
                title={isSidebarOpen ? "Hide Sidebar (Maximize Workspace)" : "Show Sidebar (History/Conversions)"}
              >
                {isSidebarOpen ? (
                  <PanelRightClose className="h-3.5 w-3.5" />
                ) : (
                  <PanelRightOpen className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
                )}
              </button>

              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full hidden lg:flex">
                <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
                <span>{t('assistantTitle')}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main calculation space */}
      <main className={`flex-grow mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10 relative transition-all duration-300 ${
        isSidebarOpen ? 'max-w-7xl' : 'max-w-7xl xl:max-w-[1550px]'
      }`}>
        
        <div className={isSidebarOpen ? "grid grid-cols-1 lg:grid-cols-4 gap-8 items-start" : "w-full"}>
          
          {/* Main Workspace Frame */}
          <div ref={workspaceRef} className={`${
            isSidebarOpen ? 'lg:col-span-3' : 'w-full'
          } bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl transition-all duration-300`}>
            
            {/* Navigation bar */}
            <div className="flex overflow-x-auto border-b border-slate-850 bg-slate-950/50 p-2.5 gap-2 hide-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setRestoredParams(null);
                    }}
                    className={`
                      flex-1 flex items-center justify-center space-x-2.5 px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap min-w-fit border cursor-pointer
                      ${isActive 
                        ? item.activeBg + ' shadow-lg border-opacity-100' 
                        : 'text-slate-400 border-transparent ' + item.bgHover
                      }
                    `}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? item.color : 'text-slate-500'}`} />
                    <span>{t(item.id)}</span>
                  </button>
                );
              })}
            </div>

            {/* Module Output frame */}
            <div id="report-content" className="p-6 sm:p-8 min-h-[450px] relative">
              <div 
                key={`${activeTab}-${restoredParams?.id || 'new'}`}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              >
                {renderActiveCalc()}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          {isSidebarOpen && (
            <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Recent Calculations Sidebar */}
              <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <History className="h-4.5 w-4.5 text-sky-400 animate-pulse" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">{t('recentRuns')}</h2>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1 hover:underline cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{t('clear')}</span>
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3 bg-slate-950/20 rounded-xl border border-dashed border-slate-850">
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 text-slate-500">
                      <History className="h-5 w-5 opacity-40" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 leading-relaxed">{t('noRecentRuns')}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 flex flex-col">
                    {/* Side-by-Side Comparison Toggle and Controls */}
                    <div className="flex flex-col space-y-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Scale className="h-3.5 w-3.5 text-sky-400" />
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">Side-by-Side Mode</span>
                        </div>
                        <button
                          onClick={() => {
                            setIsCompareMode(!isCompareMode);
                            setSelectedCompareIds([]);
                          }}
                          className={`relative inline-flex h-4.5 w-8.5 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isCompareMode ? 'bg-sky-500' : 'bg-slate-800'
                          }`}
                          title="Toggle Side-by-Side Comparison Mode"
                        >
                          <span
                            className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              isCompareMode ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                      
                      {isCompareMode && (
                        <div className="pt-2 border-t border-slate-800/60 flex flex-col space-y-2">
                          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                            <span>Selected to compare:</span>
                            <span className="font-bold text-sky-400">{selectedCompareIds.length} / 2</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (selectedCompareIds.length === 2) {
                                setIsCompareModalOpen(true);
                              }
                            }}
                            disabled={selectedCompareIds.length !== 2}
                            className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                              selectedCompareIds.length === 2
                                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-950/20 active:scale-95 cursor-pointer'
                                : 'bg-slate-950 border border-slate-850 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <Scale className="h-3.5 w-3.5" />
                            <span>Compare Selected</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* History List */}
                    <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1 hide-scrollbar">
                      {history.map((item) => {
                        const DisciplineIcon = getDisciplineIcon(item.tab);
                        const disciplineColors = getDisciplineColors(item.tab);
                        const isActive = restoredParams?.id === item.id;
                        const isSelectedForCompare = selectedCompareIds.includes(item.id);

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (isCompareMode) {
                                setSelectedCompareIds(prev => {
                                  if (prev.includes(item.id)) {
                                    return prev.filter(id => id !== item.id);
                                  }
                                  if (prev.length >= 2) {
                                    return [prev[1], item.id];
                                  }
                                  return [...prev, item.id];
                                });
                              } else {
                                handleLoadHistory(item);
                              }
                            }}
                            className={`group relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                              isCompareMode
                                ? isSelectedForCompare
                                  ? 'bg-sky-950/20 border-sky-500/50 shadow-lg shadow-sky-950/10'
                                  : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/40 hover:border-slate-800'
                                : isActive
                                  ? 'bg-slate-900 border-sky-500/50 shadow-lg shadow-sky-950/10'
                                  : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/60 hover:border-slate-800'
                            }`}
                          >
                            {/* Checkbox selector in comparison mode */}
                            {isCompareMode && (
                              <div className="shrink-0 mt-1">
                                {isSelectedForCompare ? (
                                  <CheckSquare className="h-4 w-4 text-sky-400" />
                                ) : (
                                  <Square className="h-4 w-4 text-slate-600 group-hover:text-slate-400" />
                                )}
                              </div>
                            )}

                            {/* Discipline Indicator Icon */}
                            <div className={`p-2 rounded-lg ${disciplineColors.bg} border ${disciplineColors.border} ${disciplineColors.text} shrink-0 mt-0.5`}>
                              <DisciplineIcon className="h-3.5 w-3.5" />
                            </div>

                            <div className="flex-grow min-w-0 pr-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500">
                                  {item.subType === 'ductSizing' ? 'Duct' : item.subType === 'cooling' ? 'Cooling' : item.tab}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-slate-700" />
                                <span className="text-[9px] text-slate-500 font-mono flex items-center">
                                  <Clock className="h-2.5 w-2.5 mr-0.5 text-slate-600" />
                                  {item.timestamp}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white mt-0.5 truncate leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-[10px] font-semibold text-slate-400 font-mono mt-1 leading-normal truncate">
                                {item.summary}
                              </p>
                              
                              {/* Custom Notes Field */}
                              {editingNoteId === item.id ? (
                                <div className="mt-2" onClick={e => e.stopPropagation()}>
                                  <textarea
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-slate-200 resize-none focus:outline-none focus:border-sky-500"
                                    rows={2}
                                    placeholder="Add custom notes..."
                                    autoFocus
                                  />
                                  <div className="flex justify-end gap-2 mt-1">
                                    <button onClick={() => setEditingNoteId(null)} className="text-[9px] text-slate-400 hover:text-slate-200 uppercase font-bold">Cancel</button>
                                    <button onClick={() => { updateHistoryNotes(item.id, noteInput); setEditingNoteId(null); }} className="text-[9px] text-sky-400 hover:text-sky-300 uppercase font-bold">Save</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-1.5 group/note min-h-[14px]">
                                  {item.notes ? (
                                    <div className="flex items-start gap-1.5">
                                      <MessageSquare className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />
                                      <p className="text-[10px] text-slate-300 italic leading-relaxed break-words whitespace-pre-wrap">{item.notes}</p>
                                      {!isCompareMode && (
                                        <button onClick={(e) => { e.stopPropagation(); setEditingNoteId(item.id); setNoteInput(item.notes || ''); }} className="opacity-0 group-hover/note:opacity-100 p-0.5 text-slate-500 hover:text-sky-400 shrink-0 transition-opacity" title="Edit note">
                                          <Pencil className="w-2.5 h-2.5" />
                                        </button>
                                      )}
                                    </div>
                                  ) : (
                                    !isCompareMode ? (
                                      <button onClick={(e) => { e.stopPropagation(); setEditingNoteId(item.id); setNoteInput(''); }} className="text-[9px] text-slate-500 hover:text-sky-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider" title="Add note">
                                        <Pencil className="w-2.5 h-2.5" /> Add Note
                                      </button>
                                    ) : null
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Action buttons (Delete) */}
                            {!isCompareMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteHistoryItem(item.id);
                                }}
                                className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-950/30 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                                title="Delete iteration"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {/* Small Active indicator dot */}
                            {!isCompareMode && isActive && (
                              <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Persistent Quick-Access Unit Conversion List */}
              <SidebarConversionList />

            </div>
          )}

        </div>

        {/* Professional Disclaimer Footnote */}
        <div className="mt-8 mb-4 max-w-4xl mx-auto p-4 rounded-xl border border-amber-900/30 bg-amber-950/10 text-center">
          <p className="text-[10px] text-amber-500/70 font-mono font-bold uppercase tracking-widest mb-2">Professional Disclaimer</p>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
            This software is an engineering calculation aid. Results must be reviewed by a qualified engineer and checked against the governing code, adopted standard edition, project specifications, AHJ requirements, and manufacturer data before construction or submission.
          </p>
          <p className="text-[9px] text-slate-600 mt-2">
            CKY_MEPF Engineering Systems Solver &copy; {new Date().getFullYear()}.
          </p>
        </div>
      </main>

      {/* Floating Dynamic Unit Solver widget */}
      <EngineeringUnitConverter />

      {/* Engineering References Modal */}
      <ReferenceModal isOpen={isRefModalOpen} onClose={() => setIsRefModalOpen(false)} />

      {/* Side-by-Side Comparison Modal */}
      <CompareModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
        items={history.filter(item => selectedCompareIds.includes(item.id))} 
      />

    </div>
  );
}
