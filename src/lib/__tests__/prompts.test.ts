import { describe, it, expect } from 'vitest';
import {
  buildDiscoverPrompt,
  buildHiddenGemsPrompt,
  buildStoryPrompt,
  buildFestivalPrompt,
  buildHeritagePrompt,
  buildCompanionSystemPrompt,
  buildCompanionPrompt,
  buildItineraryPrompt
} from '../prompts';

describe('Prompt Builder Templates', () => {
  it('buildDiscoverPrompt should generate valid prompt containing inputs', () => {
    const prompt = buildDiscoverPrompt(['food'], 'solo', 'moderate', '7 days', 'Asia');
    expect(prompt.system).toContain('Wanderlore');
    expect(prompt.user).toContain('food');
    expect(prompt.user).toContain('solo');
    expect(prompt.user).toContain('moderate');
    expect(prompt.user).toContain('7 days');
    expect(prompt.user).toContain('Asia');
  });

  it('buildHiddenGemsPrompt should generate valid prompt containing inputs', () => {
    const prompt = buildHiddenGemsPrompt('Kyoto', ['food', 'shopping']);
    expect(prompt.user).toContain('Kyoto');
    expect(prompt.user).toContain('food');
    expect(prompt.user).toContain('shopping');
  });

  it('buildStoryPrompt should generate valid prompt containing inputs', () => {
    const prompt = buildStoryPrompt('Rome', 'historical', 'Colosseum');
    expect(prompt.user).toContain('Rome');
    expect(prompt.user).toContain('historical');
    expect(prompt.user).toContain('Colosseum');
  });

  it('buildFestivalPrompt should generate valid prompt containing inputs', () => {
    const prompt = buildFestivalPrompt('Paris', 'July');
    expect(prompt.user).toContain('Paris');
    expect(prompt.user).toContain('July');
  });

  it('buildHeritagePrompt should generate valid prompt containing site and destination', () => {
    const prompt = buildHeritagePrompt('Agra', 'Taj Mahal');
    expect(prompt.user).toContain('Agra');
    expect(prompt.user).toContain('Taj Mahal');
  });

  it('buildCompanionSystemPrompt should generate companion parameters', () => {
    const prompt = buildCompanionSystemPrompt();
    expect(prompt).toContain('Wanderlore');
    expect(prompt).toContain('CONVERSATION STYLE');
  });

  it('buildCompanionPrompt should append conversation history', () => {
    const prompt = buildCompanionPrompt('How to toast?', [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi explorer' }
    ]);
    expect(prompt).toContain('Traveler: Hello');
    expect(prompt).toContain('Wanderlore: Hi explorer');
    expect(prompt).toContain('How to toast?');
  });

  it('buildItineraryPrompt should generate structured days and budget requests', () => {
    const prompt = buildItineraryPrompt('Tokyo', 3, ['nature'], 'moderate', 'backpacker');
    expect(prompt.user).toContain('Tokyo');
    expect(prompt.user).toContain('3-day');
    expect(prompt.user).toContain('nature');
    expect(prompt.user).toContain('moderate');
    expect(prompt.user).toContain('backpacker');
  });
});
