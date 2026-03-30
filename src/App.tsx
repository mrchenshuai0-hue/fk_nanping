/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, LayoutDashboard, BarChart3, Globe, CloudSun, Wind, Droplets, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import screen0 from './assets/screen_0.png';
import screen1 from './assets/screen_1.png';
import screen2 from './assets/screen_2.png';

// Configuration for the display screens using provided screenshots
const SCREENS = [
  { 
    id: '1', 
    title: '崇维桔柚服务站', 
    description: '集成桔柚生长气象服务专题、灾害指标监测及逐日天气预报，为桔柚产业提供全方位数智化支撑。',
    url: screen0, 
    fallback: 'https://picsum.photos/seed/citrus/3840/2160',
    icon: <CloudSun size={20} /> 
  },
  { 
    id: '2', 
    title: '建瓯鲜食玉米服务平台', 
    description: '实时监控鲜食玉米生长环境，提供气象适宜性指标分析、主要气象灾害预警及农事活动建议。',
    url: screen1, 
    fallback: 'https://picsum.photos/seed/corn/3840/2160',
    icon: <Thermometer size={20} /> 
  },
  { 
    id: '3', 
    title: '仁厚稻花鱼服务站', 
    description: '结合稻花鱼养殖需求，提供7天逐日预报、农业气象灾害风险预警及实时信息风采展示。',
    url: screen2, 
    fallback: 'https://picsum.photos/seed/fish/3840/2160',
    icon: <Droplets size={20} /> 
  },
  { 
    id: '4', 
    title: '其他大屏', 
    description: '南平市气象社会服务现代化数智核心，整合多维气象数据，赋能地方特色农业高质量发展。',
    url: 'https://picsum.photos/seed/meteo-core/3840/2160', 
    fallback: 'https://picsum.photos/seed/meteo-core/3840/2160',
    icon: <Globe size={20} /> 
  },
];

const CAROUSEL_INTERVAL = 20000; // 20 seconds per screen for better reading

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scale, setScale] = useState(0.2); 
  const [loadError, setLoadError] = useState<Record<string, boolean>>({});
  const [useFallback, setUseFallback] = useState<Record<string, boolean>>({});

  // Helper to get absolute URL for images
  const getFullUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    // Standard root-relative path is usually best for SPAs
    const finalUrl = url.startsWith('/') ? url : `/${url}`;
    console.log(`[DEBUG] Final URL for image: ${finalUrl}`);
    return finalUrl;
  };

  // Calculate scale to fit 4K content into current viewport
  const updateScale = useCallback(() => {
    const width = window.innerWidth || 1920;
    const height = window.innerHeight || 1080;
    const targetWidth = 3840;
    const targetHeight = 2160;
    const scaleX = width / targetWidth;
    const scaleY = height / targetHeight;
    const newScale = Math.min(scaleX, scaleY);
    // Ensure scale is never zero and has a reasonable minimum
    setScale(newScale > 0.01 ? newScale : 0.2);
  }, []);

  useEffect(() => {
    updateScale();
    // Re-run after a short delay to ensure window dimensions are ready
    const timer = setTimeout(updateScale, 100);
    const timer2 = setTimeout(updateScale, 500); // Second check for slow loads
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [updateScale]);

  const handleSwitch = useCallback((index: number) => {
    // Prevent switching if already transitioning or already on that index
    if (index === currentIndex || isTransitioning) return;
    
    setIsMenuOpen(false);
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [currentIndex, isTransitioning]);

  // Handle transition completion
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    // Auto-rotation timer
    if (isMenuOpen || isTransitioning) return;
    
    const timer = setTimeout(() => {
      handleSwitch((currentIndex + 1) % SCREENS.length);
    }, CAROUSEL_INTERVAL);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isMenuOpen, isTransitioning, handleSwitch]);

  const handleImageError = (id: string) => {
    const screen = SCREENS.find(s => s.id === id);
    console.error(`[DEBUG] Image load failed for ID ${id}. URL: ${screen?.url}`);
    if (!useFallback[id]) {
      setUseFallback(prev => ({ ...prev, [id]: true }));
    } else {
      setLoadError(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleImageLoad = () => {
    // No-op, kept for compatibility if needed
  };

  return (
    <div className="relative w-screen h-screen bg-[#000510] overflow-hidden font-sans select-none">
      {/* 4K Content Wrapper */}
      <div 
        className="screen-container"
        style={{ 
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: scale > 0 ? 1 : 0 
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div 
            key={currentIndex}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {useFallback[SCREENS[currentIndex].id] && (
              <div className="absolute top-4 left-4 z-[200] bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg">
                正在使用备用演示图片 (资源加载失败)
              </div>
            )}
            {loadError[SCREENS[currentIndex].id] ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#001a3d] via-[#000a1a] to-[#001a3d] text-blue-400">
                {/* Animated Radar Background for Error State */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-blue-500/30 rounded-full animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] border border-blue-500/10 rounded-full" />
                </div>
                
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <CloudSun size={180} className="mb-12 text-blue-500/40 animate-bounce" />
                  <div className="text-8xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-blue-400 bg-clip-text text-transparent">
                    图片未找到
                  </div>
                  <div className="text-4xl opacity-70 font-light tracking-widest mb-12">
                    系统检测到资源文件缺失: <span className="text-blue-400 font-mono mx-4">{SCREENS[currentIndex].url}</span>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 p-8 rounded-2xl max-w-4xl text-center backdrop-blur-md">
                    <p className="text-2xl text-blue-200/80 leading-relaxed">
                      请在左侧 <span className="text-white font-bold">文件浏览器</span> 中上传图片并重命名为对应名称，<br/>
                      或再次将图片发送给 AI 助手进行保存。
                    </p>
                  </div>
                </motion.div>
              </div>
            ) : (
              <img
                src={useFallback[SCREENS[currentIndex].id] ? SCREENS[currentIndex].fallback : getFullUrl(SCREENS[currentIndex].url)}
                className="w-full h-full object-cover"
                alt={SCREENS[currentIndex].title}
                onLoad={handleImageLoad}
                onError={() => handleImageError(SCREENS[currentIndex].id)}
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* High-end Navigation Entry (Vertical Handle on Right) */}
      <div 
        className="absolute top-0 right-0 h-full w-2 z-[100] group cursor-pointer"
        onMouseEnter={() => setIsMenuOpen(true)}
      >
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-32 bg-blue-500/30 rounded-l-full group-hover:w-3 group-hover:bg-blue-400 transition-all duration-500 flex items-center justify-center">
          <ChevronRight size={16} className="text-white rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Progress Bar */}
      {!isMenuOpen && (
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-900/20 z-40">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: CAROUSEL_INTERVAL / 1000, ease: "linear" }}
            key={currentIndex}
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          />
        </div>
      )}

      {/* Meteorological Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-white/5 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 200 }}
              onMouseLeave={() => setIsMenuOpen(false)}
              className="absolute top-0 right-0 w-[380px] h-full bg-[#000d1f]/95 backdrop-blur-2xl border-l border-blue-500/30 z-[120] p-8 flex flex-col shadow-[-20px_0_60px_rgba(0,100,255,0.2)] overflow-hidden"
            >
              {/* Tech Background Decorations */}
              <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <motion.div 
                  animate={{ top: ['-10%', '110%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                />
              </div>
              
              {/* Menu Header */}
              <div className="mb-10 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-6 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  <h2 className="text-2xl font-bold text-white tracking-wider uppercase">系统导航</h2>
                </div>
                <p className="text-blue-400/50 text-[10px] font-mono tracking-[0.3em] uppercase pl-4">气象数据中心</p>
              </div>

              {/* Menu Items */}
              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {SCREENS.map((screen, index) => (
                  <button
                    key={screen.id}
                    onClick={() => handleSwitch(index)}
                    className={`w-full group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 overflow-hidden border ${
                      currentIndex === index 
                        ? 'bg-blue-600/20 border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'bg-white/5 border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30'
                    }`}
                  >
                    {/* Corner Borders for Active Item */}
                    {currentIndex === index && (
                      <>
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-400" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-400" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-400" />
                      </>
                    )}

                    <div className={`p-2.5 rounded-lg transition-all duration-300 ${currentIndex === index ? 'bg-blue-500 text-white' : 'bg-blue-900/40 text-blue-400 group-hover:text-blue-300'}`}>
                      {React.cloneElement(screen.icon as React.ReactElement, { size: 18 })}
                    </div>
                    
                    <div className="flex flex-col items-start">
                      <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${currentIndex === index ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                        {screen.title}
                      </span>
                      <span className="text-[9px] font-mono text-blue-400/40 uppercase tracking-tighter">终端 {screen.id.padStart(2, '0')}</span>
                    </div>

                    {currentIndex === index && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]" 
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Menu Footer removed as requested */}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preload images to prevent loading flickers during transition */}
      <div className="hidden">
        {SCREENS.map(screen => (
          <img 
            key={`preload-${screen.id}`} 
            src={getFullUrl(screen.url)} 
            alt="preload" 
            referrerPolicy="no-referrer"
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}} />
    </div>
  );
}
