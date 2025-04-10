// TeaInsights.js
// Modular approach to tea analysis without TeaEffectCalculator dependency

import { TeaTypeCalculator } from './calculators/TeaTypeCalculator.js';
import { CompoundCalculator } from './calculators/CompoundCalculator.js';
import { ProcessingCalculator } from './calculators/ProcessingCalculator.js';
import { GeographyCalculator } from './calculators/GeographyCalculator.js';
import { FlavorCalculator } from './calculators/FlavorCalculator.js';
// import { SeasonCalculator } from './calculators/SeasonCalculator.js';
// import { EffectSystemConfig } from './config/EffectSystemConfig.js';
// import { defaultConfig } from './config/defaultConfig.js';

export class TeaInsights {
  // Constructor with simpler dependencies
  constructor(config = {}) {
    // Initialize with a simple config object
    // this.config = {
    //   normalizeScores: true,
    //   dominantEffectThreshold: 6.5,
    //   supportingEffectThreshold: 3.5
    // };
  }
  
  // Core analysis method - simpler and more direct
  analyzeTea(tea) {
    if (!tea) {
      console.error('No tea data provided for analysis');
      return null;
    }
    
    // Initialize individual calculators
    const teaTypeCalculator = new TeaTypeCalculator(this.config);
    const compoundCalculator = new CompoundCalculator(this.config);
    const processingCalculator = new ProcessingCalculator(this.config);
    const geographyCalculator = new GeographyCalculator(this.config);
    const flavorCalculator = new FlavorCalculator(this.config);
    // const seasonCalculator = new SeasonCalculator(this.config);
    
    // Run individual calculations directly
    const typeResult = teaTypeCalculator.calculate(tea);
    const compoundResult = compoundCalculator.calculate(tea);
    const processingResult = processingCalculator.calculate(tea);
    const geographyResult = geographyCalculator.calculate(tea);
    const flavorResult = flavorCalculator.calculate(tea);
    // const seasonalResult = seasonCalculator.calculate(tea);
    
    // Return all results directly without complex score normalization
    return {
      teaType: typeResult.data,
      compounds: compoundResult.data,
      processing: processingResult.data,
      geography: geographyResult.data,
      flavor: flavorResult.data,
      // seasonal: seasonalResult.data
    };
  }
  
  // Time of day recommendations
  getTimingRecommendations(tea) {
    if (!tea) return null;
    
    // Get basic analysis
    const analysis = this.analyzeTea(tea);
    
    // Extract relevant scores
    const caffeineLevel = tea.caffeineLevel || 0;
    const lTheanineLevel = tea.lTheanineLevel || 0;
    const ratio = lTheanineLevel / (caffeineLevel || 1);
    
    // Create timing recommendations using direct rules
    const timings = {
      morning: 0, 
      afternoon: 0, 
      evening: 0,
      night: 0
    };
    
    // Base recommendations on caffeine level
    if (caffeineLevel > 7) {
      timings.morning += 40;
      timings.afternoon += 20;
      timings.evening -= 30;
      timings.night -= 50;
    } else if (caffeineLevel > 4) {
      timings.morning += 30;
      timings.afternoon += 30;
      timings.evening -= 10;
      timings.night -= 30;
    } else {
      timings.evening += 20;
      timings.night += 10;
    }
    
    // L-theanine to caffeine ratio adjustments
    if (ratio > 1.5) {
      timings.evening += 30;
      timings.night += 20;
    } else if (ratio < 0.8) {
      timings.morning += 20;
    }
    
    // Tea type adjustments
    if (tea.type === "green") {
      timings.morning += 20;
      timings.afternoon += 10;
    } else if (tea.type === "black") {
      timings.morning += 30;
      timings.evening -= 20;
    } else if (tea.type === "white") {
      timings.afternoon += 20;
      timings.evening += 10;
    }
    
    // Normalize scores (cap between 0-100)
    Object.keys(timings).forEach(key => {
      timings[key] = Math.min(100, Math.max(0, timings[key] + 50)); // Base 50 + adjustments
    });
    
    // Find best time
    const bestTime = Object.entries(timings)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      recommendations: timings,
      bestTime,
      explanation: this.generateTimingExplanation(bestTime, tea, ratio)
    };
  }
  
  // Seasonal recommendations
  getSeasonalRecommendations(tea) {
    if (!tea) return null;
    
    // Get basic analysis
    const analysis = this.analyzeTea(tea);
    
    // Create seasonal recommendations
    const seasons = {
      spring: 50,
      summer: 50,
      autumn: 50,
      winter: 50
    };
    
    // Tea type adjustments
    if (tea.type === "green") {
      seasons.spring += 30;
      seasons.summer += 20;
      seasons.autumn -= 10;
      seasons.winter -= 10;
    } else if (tea.type === "black") {
      seasons.autumn += 20;
      seasons.winter += 30;
      seasons.summer -= 10;
    } else if (tea.type === "white") {
      seasons.spring += 20;
      seasons.summer += 30;
    } else if (tea.type === "oolong") {
      seasons.autumn += 30;
      seasons.spring += 10;
    } else if (tea.type === "puerh") {
      seasons.winter += 30;
      seasons.autumn += 20;
    }
    
    // Temperature considerations
    const isWarmTea = tea.temperature && tea.temperature > 85;
    if (isWarmTea) {
      seasons.winter += 20;
      seasons.autumn += 10;
      seasons.summer -= 20;
    }
    
    // Flavor profile adjustments
    if (tea.flavorProfile) {
      if (tea.flavorProfile.includes('floral') || tea.flavorProfile.includes('fresh')) {
        seasons.spring += 20;
        seasons.summer += 10;
      }
      if (tea.flavorProfile.includes('fruity') || tea.flavorProfile.includes('bright')) {
        seasons.summer += 20;
      }
      if (tea.flavorProfile.includes('spicy') || tea.flavorProfile.includes('woody')) {
        seasons.autumn += 20;
        seasons.winter += 10;
      }
      if (tea.flavorProfile.includes('earthy') || tea.flavorProfile.includes('deep')) {
        seasons.winter += 20;
        seasons.autumn += 10;
      }
    }
    
    // Normalize scores (cap between 0-100)
    Object.keys(seasons).forEach(key => {
      seasons[key] = Math.min(100, Math.max(0, seasons[key]));
    });
    
    // Find best season
    const bestSeason = Object.entries(seasons)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      recommendations: seasons,
      bestSeason,
      explanation: this.generateSeasonalExplanation(bestSeason, tea)
    };
  }
  
  // Activity recommendations
  getActivityRecommendations(tea) {
    if (!tea) return null;
    
    // Get basic analysis
    const analysis = this.analyzeTea(tea);
    
    // Create activity recommendations
    const activities = {
      meditation: 50,
      work: 50,
      exercise: 50,
      socializing: 50,
      relaxation: 50,
      reading: 50
    };
    
    // Caffeine level adjustments
    const caffeineLevel = tea.caffeineLevel || 0;
    if (caffeineLevel > 7) {
      activities.work += 30;
      activities.exercise += 20;
      activities.socializing += 20;
      activities.meditation -= 20;
      activities.relaxation -= 20;
    } else if (caffeineLevel > 4) {
      activities.work += 20;
      activities.exercise += 10;
      activities.reading += 20;
    } else {
      activities.meditation += 20;
      activities.relaxation += 20;
      activities.reading += 10;
    }
    
    // Tea type adjustments
    if (tea.type === "green") {
      activities.meditation += 20;
      activities.reading += 20;
      activities.work += 10;
    } else if (tea.type === "black") {
      activities.work += 20;
      activities.socializing += 20;
      activities.exercise += 10;
    } else if (tea.type === "white") {
      activities.meditation += 30;
      activities.reading += 20;
      activities.relaxation += 10;
    } else if (tea.type === "oolong") {
      activities.socializing += 20;
      activities.reading += 10;
      activities.work += 10;
    }
    
    // Normalize scores (cap between 0-100)
    Object.keys(activities).forEach(key => {
      activities[key] = Math.min(100, Math.max(0, activities[key]));
    });
    
    // Find top activities
    const topActivities = Object.entries(activities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    return {
      recommendations: activities,
      topActivities,
      explanation: this.generateActivityExplanation(topActivities[0], tea)
    };
  }
  
  // Geography insights
  getGeographyInsights(tea) {
    if (!tea) return null;
    if (!tea.origin) return { error: "No origin information available" };
    
    // Get basic analysis
    const analysis = this.analyzeTea(tea);
    
    // Extract geography data
    const geography = analysis.geography || {};
    
    return {
      origin: tea.origin,
      characteristics: geography.characteristics || {},
      terroir: geography.terroir || {},
      explanation: geography.description || `${tea.name} comes from ${tea.origin}, which impacts its character through the local terroir.`
    };
  }
  
  // Helper function for timing explanations
  generateTimingExplanation(timing, tea, ratio) {
    switch(timing) {
      case 'morning':
        return `${tea.name} is ideal for morning consumption due to its ${ratio < 0.8 ? 'energizing caffeine content' : 'balanced profile'}. It will provide mental clarity and energy to start your day.`;
      case 'afternoon':
        return `${tea.name} is perfect for afternoon enjoyment, offering a balanced boost ${ratio > 1.2 ? 'with calming L-theanine' : 'of moderate energy'} to overcome the mid-day slump.`;
      case 'evening':
        return `${tea.name} works well in the evening with its ${ratio > 1.5 ? 'calming L-theanine dominance' : 'gentle character'} that helps you unwind without disrupting sleep.`;
      case 'night':
        return `${tea.name} has gentle properties suitable for nighttime relaxation before sleep, with ${ratio > 2 ? 'a high proportion of calming L-theanine' : 'minimal stimulation'}.`;
      default:
        return `${tea.name} can be enjoyed throughout the day.`;
    }
  }
  
  // Helper function for seasonal explanations
  generateSeasonalExplanation(season, tea) {
    switch(season) {
      case 'spring':
        return `${tea.name} pairs beautifully with spring, complementing the fresh, renewal energy of the season with its ${tea.type === 'green' || tea.type === 'white' ? 'light, fresh character' : 'vibrant profile'}.`;
      case 'summer':
        return `${tea.name} is excellent for summer enjoyment, offering ${tea.type === 'green' || tea.type === 'white' ? 'refreshing qualities perfect for warm weather' : 'pleasant characteristics that can be enjoyed both hot or cold'}.`;
      case 'autumn':
        return `${tea.name} resonates with autumn's contemplative mood, providing ${tea.type === 'oolong' || tea.type === 'black' ? 'warm, toasty notes that match falling leaves' : 'a perfect companion for the transitional season'}.`;
      case 'winter':
        return `${tea.name} shines in winter with its ${tea.type === 'puerh' || tea.type === 'black' ? 'deep, warming qualities that comfort during cold months' : 'cozy character perfect for the season of reflection'}.`;
      default:
        return `${tea.name} can be enjoyed year-round, adapting to each season's unique character.`;
    }
  }
  
  // Helper function for activity explanations
  generateActivityExplanation(activity, tea) {
    switch(activity) {
      case 'meditation':
        return `${tea.name} supports meditation practice with its ${tea.type === 'white' || tea.type === 'green' ? 'gentle clarity that enhances mindfulness' : 'balanced energy that helps maintain present awareness'}.`;
      case 'work':
        return `${tea.name} enhances work performance with ${tea.caffeineLevel > 6 ? 'energizing properties that boost productivity' : 'focused clarity that supports concentration'}.`;
      case 'exercise':
        return `${tea.name} complements exercise with ${tea.caffeineLevel > 6 ? 'stimulating properties that can boost performance' : 'balanced energy that supports physical activity'}.`;
      case 'socializing':
        return `${tea.name} enhances social gatherings with its ${tea.type === 'oolong' || tea.type === 'black' ? 'lively character that stimulates conversation' : 'pleasant profile that creates a welcoming atmosphere'}.`;
      case 'relaxation':
        return `${tea.name} facilitates relaxation with its ${tea.caffeineLevel < 4 ? 'gentle, calming qualities' : 'balanced character that helps transition to restful states'}.`;
      case 'reading':
        return `${tea.name} is perfect for reading, offering ${tea.type === 'green' || tea.type === 'white' ? 'clear-minded focus without overstimulation' : 'sustained attention that enhances literary enjoyment'}.`;
      default:
        return `${tea.name} adapts well to various activities throughout your day.`;
    }
  }
}

// Initialize the system on page load if in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.teaInsights = new TeaInsights();
    console.log('Tea Insights System initialized');
  });
} 