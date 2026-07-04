import React from 'react';
import * as Lucide from 'lucide-react';

export type IconName = keyof typeof Lucide;

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

// Map of common keywords/emojis to Lucide icon names to handle raw emoji replacements
const EMOJI_TO_ICON_MAP: Record<string, string> = {
  // Navigation & General
  '🌍': 'Globe',
  '🗺️': 'Compass',
  '💎': 'Gem',
  '📖': 'BookOpen',
  '🎭': 'PartyPopper',
  '🏛️': 'Landmark',
  '🤖': 'Bot',
  '📋': 'FileText',
  '🔮': 'Sparkles',
  '✨': 'Sparkles',
  '👤': 'User',
  '🚶': 'User',
  '💑': 'Heart',
  '👨‍👩‍👧‍👦': 'Users',
  '👥': 'Users',
  '🎒': 'Footprints',
  '💰': 'Coins',
  '💳': 'CreditCard',
  '📜': 'History',
  '🐉': 'Flame',
  '✈️': 'Compass',
  '🍕': 'Utensils',
  '🌅': 'Eye',
  '🏺': 'Hammer',
  '⛩️': 'Landmark',
  '🎨': 'Palette',
  '🛍️': 'ShoppingBag',
  '🌳': 'Trees',
  '🌿': 'Leaf',
  '🌙': 'Moon',
  '🧗': 'Mountain',
  '🏗️': 'Building',
  '🎵': 'Music',
  '📸': 'Camera',
  '🧘': 'Heart',
  '🍜': 'Utensils',
  '🧗‍♂️': 'Mountain',
  '🗺': 'Compass',
  '🍽️': 'Utensils',
  '🎪': 'PartyPopper',
  '🏰': 'Landmark',
  '🎒': 'Briefcase',
  '❤️': 'Heart',
  '▲': 'Play',
  '🚀': 'Rocket',
  '📅': 'Calendar',
  '📍': 'MapPin',
  '⚠️': 'AlertTriangle',
  '🕒': 'Clock',
  '💡': 'Lightbulb',
  '🍜': 'ChefHat',
  '🧭': 'Compass',
  '🎒': 'Footprints',
};

// Normalize names (e.g. "map-pin" or "MapPin" or emoji) to actual Lucide component names
export function getIconComponent(name: string): React.ComponentType<any> {
  // 1. Direct Emoji Map Check
  const mappedFromEmoji = EMOJI_TO_ICON_MAP[name];
  if (mappedFromEmoji && mappedFromEmoji in Lucide) {
    return (Lucide as any)[mappedFromEmoji];
  }

  // 2. Exact name check (e.g. "MapPin")
  if (name in Lucide) {
    return (Lucide as any)[name];
  }

  // 3. Case-insensitive lookup (e.g. "mappin" -> "MapPin")
  const lowerName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const key of Object.keys(Lucide)) {
    if (key.toLowerCase() === lowerName) {
      return (Lucide as any)[key];
    }
  }

  // 4. Keyword map search
  const foundEmojiKey = Object.keys(EMOJI_TO_ICON_MAP).find(
    (key) => name.toLowerCase().includes(key) || key.includes(name.toLowerCase())
  );
  if (foundEmojiKey) {
    const mapped = EMOJI_TO_ICON_MAP[foundEmojiKey];
    if (mapped in Lucide) {
      return (Lucide as any)[mapped];
    }
  }

  // Fallback icon
  return Lucide.MapPin;
}

export function DynamicIcon({ name, size = 20, className = '' }: DynamicIconProps) {
  const IconComponent = getIconComponent(name);
  return <IconComponent size={size} className={className} />;
}
