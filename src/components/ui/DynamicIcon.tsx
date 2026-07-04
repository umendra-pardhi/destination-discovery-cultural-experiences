import React from 'react';
import * as Lucide from 'lucide-react';

export type IconName = keyof typeof Lucide;

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

// Normalize names (e.g. "map-pin" or "MapPin") to actual Lucide component names
export function getIconComponent(name: string): React.ComponentType<any> {
  // 1. Exact name check (e.g. "MapPin")
  if (name in Lucide) {
    return (Lucide as any)[name];
  }

  // 2. Case-insensitive lookup (e.g. "mappin" -> "MapPin")
  const lowerName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const key of Object.keys(Lucide)) {
    if (key.toLowerCase() === lowerName) {
      return (Lucide as any)[key];
    }
  }

  // 3. PascalCase conversion from kebab-case (e.g. "map-pin" -> "MapPin")
  const pascalCase = name
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  if (pascalCase in Lucide) {
    return (Lucide as any)[pascalCase];
  }

  // Fallback icon
  return Lucide.MapPin;
}

export function DynamicIcon({ name, size = 20, className = '' }: DynamicIconProps) {
  const IconComponent = getIconComponent(name);
  return <IconComponent size={size} className={className} />;
}
