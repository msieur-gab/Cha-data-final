// TeaInsights.js
// Modular approach to tea analysis using dedicated matcher classes

import { TeaTypeCalculator } from './calculators/TeaTypeCalculator.js';
import { CompoundCalculator } from './calculators/CompoundCalculator.js';
import { ProcessingCalculator } from './calculators/ProcessingCalculator.js';
import { GeographyCalculator } from './calculators/GeographyCalculator.js';
import { FlavorCalculator } from './calculators/FlavorCalculator.js';
// Import dedicated matcher classes
import { TimeMatcher } from './derivation/TimeMatcher.js';
import { FoodMatcher } from './derivation/FoodMatcher.js';
import { ActivityMatcher } from './derivation/ActivityMatcher.js';
import { brewingMatcher } from './derivation/brewingMatcher.js';
import { SeasonMatcher } from './derivation/SeasonMatcher.js';
// import { SeasonCalculator } from './calculators/SeasonCalculator.js';
// import { EffectSystemConfig } from './config/EffectSystemConfig.js';
// import { defaultConfig } from './config/defaultConfig.js';

export class TeaInsights {
  // Constructor with simpler dependencies
  constructor(config = {}) {
    // Initialize with a simple config object
    this.config = config;
    
    // Initialize calculators
    this.teaTypeCalculator = new TeaTypeCalculator(config);
    this.compoundCalculator = new CompoundCalculator(config);
    this.processingCalculator = new ProcessingCalculator(config);
    this.geographyCalculator = new GeographyCalculator(config);
    this.flavorCalculator = new FlavorCalculator(config);
    
    // Initialize matchers
    this.timeMatcher = new TimeMatcher(config);
    this.foodMatcher = new FoodMatcher(config);
    this.activityMatcher = new ActivityMatcher(config);
    this.brewingMatcher = brewingMatcher;
    this.seasonMatcher = new SeasonMatcher(config);
  }
  
  // Core analysis method
  analyzeTea(tea) {
    if (!tea) {
      console.error('No tea data provided for analysis');
      return null;
    }
    
    // Run individual calculations directly
    const teaTypeResult = this.teaTypeCalculator.calculate(tea);
    const compoundResult = this.compoundCalculator.calculate(tea);
    const processingResult = this.processingCalculator.calculate(tea);
    const geographyResult = this.geographyCalculator.calculate(tea);
    const flavorResult = this.flavorCalculator.calculate(tea);
    
    // Extract analysis data
    const teaTypeAnalysis = teaTypeResult.data?.teaType || {};
    const compoundAnalysis = compoundResult.data?.compounds || {};
    const processingAnalysis = processingResult.data?.processing || {};
    const geographyAnalysis = geographyResult.data?.geography || {};
    const flavorAnalysis = flavorResult.data?.flavor || {};
    
    return {
      teaType: teaTypeAnalysis,
      compounds: compoundAnalysis,
      processing: processingAnalysis,
      geography: geographyAnalysis,
      flavor: flavorAnalysis
    };
  }
  
  // Time of day recommendations
  getTimingRecommendations(tea) {
    if (!tea) return null;
    
    console.log("TeaInsights: Getting timing recommendations for", tea.name);
    
    // Get analysis results
    const analysis = this.analyzeTea(tea);
    
    try {
      // Call matchTime with the exact same parameters as in json-export.js
      const result = this.timeMatcher.matchTime(
        analysis.compounds,
        analysis.teaType,
        analysis.processing
      );
      console.log("TeaInsights: Time matcher result:", result);
      return result;
    } catch (error) {
      console.error("TeaInsights: Error in time matching:", error);
      return { error: "Time matching failed: " + error.message };
    }
  }
  
  // Seasonal recommendations
  getSeasonalRecommendations(tea) {
    if (!tea) return null;
    
    console.log("TeaInsights: Getting seasonal recommendations for", tea.name);
    
    // Get analysis results
    const analysis = this.analyzeTea(tea);
    
    try {
      // Call matchSeason with the exact same parameters as in json-export.js
      const result = this.seasonMatcher.matchSeason(
        analysis.geography,
        analysis.processing,
        analysis.teaType,
        analysis.flavor
      );
      console.log("TeaInsights: Season matcher result:", result);
      return result;
    } catch (error) {
      console.error("TeaInsights: Error in season matching:", error);
      return { error: "Season matching failed: " + error.message };
    }
  }
  
  // Activity recommendations
  getActivityRecommendations(tea) {
    if (!tea) return null;
    
    console.log("TeaInsights: Getting activity recommendations for", tea.name);
    
    // Get analysis results
    const analysis = this.analyzeTea(tea);
    
    try {
      // Call matchActivity with the exact same parameters as in json-export.js
      const result = this.activityMatcher.matchActivity(
        analysis.compounds,
        analysis.teaType,
        analysis.flavor
      );
      console.log("TeaInsights: Activity matcher result:", result);
      return result;
    } catch (error) {
      console.error("TeaInsights: Error in activity matching:", error);
      return { error: "Activity matching failed: " + error.message };
    }
  }
  
  // Food pairing recommendations
  getFoodPairingRecommendations(tea) {
    if (!tea) return null;
    
    console.log("TeaInsights: Getting food pairing recommendations for", tea.name);
    
    // Get analysis results
    const analysis = this.analyzeTea(tea);
    
    try {
      // Call matchFood with the exact same parameters as in json-export.js
      const result = this.foodMatcher.matchFood(
        analysis.flavor,
        analysis.processing,
        analysis.teaType
      );
      console.log("TeaInsights: Food matcher result:", result);
      return result;
    } catch (error) {
      console.error("TeaInsights: Error in food matching:", error);
      return { error: "Food matching failed: " + error.message };
    }
  }
  
  // Brewing recommendations
  getBrewingRecommendations(tea) {
    if (!tea) return null;
    
    console.log("TeaInsights: Getting brewing recommendations for", tea.name);
    
    // Get analysis results
    const analysis = this.analyzeTea(tea);
    
    try {
      // Get both brewing styles exactly as in json-export.js
      const gongfuInfo = this.brewingMatcher.getBrewingInfo(
        tea,
        'gongfu',
        analysis.processing
      );
      
      const westernInfo = this.brewingMatcher.getBrewingInfo(
        tea,
        'western',
        analysis.processing
      );
      
      const result = {
        gongfu: gongfuInfo,
        western: westernInfo,
        _sectionRef: "brewing-recommendations"
      };
      
      console.log("TeaInsights: Brewing results:", result);
      return result;
    } catch (error) {
      console.error("TeaInsights: Error in brewing recommendations:", error);
      return { error: "Brewing recommendations failed: " + error.message };
    }
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
  
  // Get all recommendations in one call
  getAllRecommendations(tea) {
    if (!tea) return null;
    
    return {
      timing: this.getTimingRecommendations(tea),
      seasonal: this.getSeasonalRecommendations(tea),
      activity: this.getActivityRecommendations(tea),
      foodPairing: this.getFoodPairingRecommendations(tea),
      brewing: this.getBrewingRecommendations(tea),
      geography: this.getGeographyInsights(tea),
      analysis: this.analyzeTea(tea)
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