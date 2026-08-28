import React from 'react';
import logoMark from '../../assets/logo.png';
import logoAi from '../../assets/logo-ai.png';
import logoPersonas from '../../assets/logo-personas.png';
import { cn } from '../../utils/cn';

/**
 * Reusable AdaptCX Brand Logo component
 * @param {'ac' | 'ai' | 'personas'} variant - Logo variant (AC mark, AI sparkles, or Personas)
 * @param {'horizontal' | 'mark' | 'icon' | 'full'} type - Presentation format
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} size - Size scale
 * @param {boolean} showTagline - Whether to show tagline text
 * @param {boolean} showText - Whether to show the "AdaptCX" text beside the mark
 * @param {string} className - Additional CSS classes
 */
export const Logo = ({
  variant = 'ac',
  type = 'horizontal',
  size = 'md',
  showTagline = false,
  showText = true,
  className = '',
  alt = 'AdaptCX'
}) => {
  const getImgSrc = () => {
    switch (variant) {
      case 'personas':
        return logoPersonas;
      case 'ai':
        return logoAi;
      case 'ac':
      default:
        return logoMark;
    }
  };

  const imgSrc = getImgSrc();

  // Size definitions for icon/mark mode
  const markSizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Size definitions for full graphic mode
  const fullSizeMap = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-18',
    xl: 'h-28'
  };

  // Text sizing
  const textSizeMap = {
    xs: 'text-sm font-bold',
    sm: 'text-base font-extrabold',
    md: 'text-lg font-extrabold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold'
  };

  if (type === 'full') {
    return (
      <div className={cn('inline-flex flex-col items-center justify-center', className)}>
        <img
          src={imgSrc}
          alt={alt}
          className={cn(fullSizeMap[size] || 'h-10', 'w-auto object-contain drop-shadow-xs')}
          loading="eager"
        />
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-1 text-center">
            Personalized. Relevant. Every Visitor. Every Time.
          </span>
        )}
      </div>
    );
  }

  if (type === 'mark' || type === 'icon') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 shrink-0',
          markSizeMap[size] || 'w-9 h-9',
          className
        )}
      >
        <img
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-contain transform scale-110"
          loading="eager"
        />
      </div>
    );
  }

  // Combined horizontal layout: Logo mark + AdaptCX typography
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-lg bg-white border border-slate-200/90 shadow-xs flex items-center justify-center p-1 shrink-0',
          markSizeMap[size] || 'w-9 h-9'
        )}
      >
        <img
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-contain transform scale-110"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <span
              className={cn(
                'tracking-tight text-slate-900 leading-none',
                textSizeMap[size] || 'text-base font-extrabold'
              )}
            >
              Adapt<span className="text-indigo-600">CX</span>
            </span>
          </div>
          {showTagline && (
            <span className="text-[10.5px] text-slate-500 font-medium leading-tight mt-1">
              Personalization Engine
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
