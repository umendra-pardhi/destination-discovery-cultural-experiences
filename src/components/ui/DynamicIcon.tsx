import React from 'react';
import {
  Compass, Sparkles, MapPin, AlertTriangle, KeyRound, Zap, Calendar,
  Bot, Globe, User, Send, Trash2, ShieldAlert, Gem, Heart, Lightbulb,
  Clock, BookOpen, HelpCircle, PartyPopper, Shirt, HeartHandshake, AlertCircle,
  Landmark, Camera, ExternalLink, FileText, Coins, Utensils, Backpack,
  ArrowRight, Palmtree, Music, GlassWater, Hammer, Trees, Building, Footprints
} from 'lucide-react';

const ICON_REGISTRY: Record<string, React.ComponentType<any>> = {
  Compass, Sparkles, MapPin, AlertTriangle, KeyRound, Zap, Calendar,
  Bot, Globe, User, Send, Trash2, ShieldAlert, Gem, Heart, Lightbulb,
  Clock, BookOpen, HelpCircle, PartyPopper, Shirt, HeartHandshake, AlertCircle,
  Landmark, Camera, ExternalLink, FileText, Coins, Utensils, Backpack,
  ArrowRight, Palmtree, Music, GlassWater, Hammer, Trees, Building, Footprints
};

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

// Normalize names (e.g. "map-pin" or "MapPin") to registry keys
export function getIconComponent(name: string): React.ComponentType<any> {
  // 1. Exact match
  if (name in ICON_REGISTRY) {
    return ICON_REGISTRY[name];
  }

  // 2. Case-insensitive lookup
  const lowerName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const key of Object.keys(ICON_REGISTRY)) {
    if (key.toLowerCase() === lowerName) {
      return ICON_REGISTRY[key];
    }
  }

  // 3. PascalCase conversion
  const pascalCase = name
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  if (pascalCase in ICON_REGISTRY) {
    return ICON_REGISTRY[pascalCase];
  }

  // Fallback icon
  return MapPin;
}

export function DynamicIcon({ name, size = 20, className = '' }: DynamicIconProps) {
  const IconComponent = getIconComponent(name);
  return <IconComponent size={size} className={className} />;
}
