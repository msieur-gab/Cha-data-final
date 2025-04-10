/**
 * Tea JSON Export Tool Script
 * Standardized implementation for exporting tea analysis data as JSON
 */

// Import necessary components and utilities
import './components/TestSection.js';
import './components/TeaSidebar.js';
import TeaDatabase from './data/TeaDatabase.js';

// import { EffectSystemConfig } from './config/EffectSystemConfig.js';
import { TeaTypeCalculator } from './calculators/TeaTypeCalculator.js';
import { CompoundCalculator } from './calculators/CompoundCalculator.js';
import { FlavorCalculator } from './calculators/FlavorCalculator.js';
import { ProcessingCalculator } from './calculators/ProcessingCalculator.js';
import { GeographyCalculator } from './calculators/GeographyCalculator.js';
import { SeasonMatcher } from './derivation/SeasonMatcher.js';
import { ActivityMatcher } from './derivation/ActivityMatcher.js';
import { FoodMatcher } from './derivation/FoodMatcher.js';
import { TimeMatcher } from './derivation/TimeMatcher.js';
// import { defaultConfig } from './config/defaultConfig.js';
// import { primaryEffects } from './props/PrimaryEffects.js';
// import { flavorInfluences } from './descriptors/FlavorInfluences.js';
// import { processingInfluences } from './descriptors/ProcessingInfluences.js';
// import geographicalDescriptors from './props/GeographicalDescriptors.js';
import { objectToMarkdown, createMarkdownTable, formatScoreWithBar, createExpandableSection } from './utils/markdownUtils.js';

// Current tea and JSON data
let currentTea = null;
let currentJsonData = null;
let sectionRefs = {};

// Initialize the export tool
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    setupEventListeners();
    setupJsonExportPanel();
});

/**
 * Initialize the tea sidebar with the tea database
 */
function initializeSidebar() {
    const sidebar = document.querySelector('tea-sidebar');
    if (sidebar) {
        sidebar.teas = TeaDatabase.getAllTeas();
    }
}

/**
 * Set up event listeners for the export tool
 */
function setupEventListeners() {
    // Listen for tea selection events from the sidebar
    document.addEventListener('tea-selected', (event) => {
        const tea = event.detail.tea;
        if (tea) {
            currentTea = tea;
            
            // Clear existing test sections
            clearTestSections();
            
            // Generate new test sections for the selected tea
            generateTestSections(tea);
            
            // Generate JSON data
            generateJsonData(tea);
        }
    });

    // Event delegation for reference marker clicks
    document.addEventListener('click', (event) => {
        // Handle reference marker clicks
        if (event.target.classList.contains('reference-marker')) {
            const sectionId = event.target.dataset.section;
            if (sectionId && sectionRefs[sectionId]) {
                sectionRefs[sectionId].scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the section briefly
                sectionRefs[sectionId].classList.add('highlight');
                setTimeout(() => {
                    sectionRefs[sectionId].classList.remove('highlight');
                }, 2000);
            }
        }
        
        // Handle JSON expand/collapse toggles
        if (event.target.classList.contains('json-toggle')) {
            const targetId = event.target.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Toggle the collapsed class on the expandable content
                targetElement.classList.toggle('collapsed');
                
                // Toggle the collapsed class on the toggle button
                event.target.classList.toggle('collapsed');
                
                // Update the toggle symbol
                event.target.textContent = event.target.classList.contains('collapsed') ? '▶' : '▼';
            }
        }
    });
}

/**
 * Set up the JSON export panel and its controls
 */
function setupJsonExportPanel() {
    const toggleButton = document.querySelector('.json-export-toggle');
    const panel = document.querySelector('.json-export-panel');
    const copyButton = document.getElementById('copy-json');
    const downloadButton = document.getElementById('download-json');

    // Toggle panel visibility
    if (toggleButton && panel) {
        toggleButton.addEventListener('click', () => {
            panel.classList.toggle('active');
            toggleButton.textContent = panel.classList.contains('active') 
                ? 'Hide JSON' 
                : 'Show JSON';
        });
    }

    // Copy JSON to clipboard
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            if (currentJsonData) {
                const jsonStr = JSON.stringify(currentJsonData, null, 2);
                
                // Try to use the Clipboard API if available
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(jsonStr)
                        .then(() => {
                            const originalText = copyButton.textContent;
                            copyButton.textContent = 'Copied!';
                            setTimeout(() => {
                                copyButton.textContent = originalText;
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy with Clipboard API: ', err);
                            fallbackCopyToClipboard(jsonStr, copyButton);
                        });
                } else {
                    // Fallback for browsers that don't support the Clipboard API
                    fallbackCopyToClipboard(jsonStr, copyButton);
                }
            }
        });
    }

    // Download JSON file
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            if (currentJsonData && currentTea) {
                const fileName = `${normalizeString(currentTea.name)}_export.json`;
                const jsonStr = JSON.stringify(currentJsonData, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    }
}

/**
 * Fallback method to copy text to clipboard using execCommand
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Button element to update
 */
function fallbackCopyToClipboard(text, button) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select the text and copy
    let success = false;
    
    try {
        textarea.select();
        success = document.execCommand('copy');
        if (success) {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } else {
            button.textContent = 'Copy failed';
            setTimeout(() => {
                button.textContent = 'Copy JSON';
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy method failed:', err);
        button.textContent = 'Copy failed';
        setTimeout(() => {
            button.textContent = 'Copy JSON';
        }, 2000);
    }
    
    // Clean up
    document.body.removeChild(textarea);
}

/**
 * Clear all test sections from the page
 */
function clearTestSections() {
    const testSectionsContainer = document.querySelector('.test-sections');
    if (testSectionsContainer) {
        testSectionsContainer.innerHTML = '';
    }
    sectionRefs = {};
}

/**
 * Generate test sections for a given tea
 * @param {Object} tea - The tea to analyze
 */
function generateTestSections(tea) {
    const testSectionsContainer = document.querySelector('.test-sections');
    if (!testSectionsContainer) return;
    
    // Initialize config with simple object instead of using EffectSystemConfig
    const config = {
        // Simple config with reasonable defaults
        normalizeScores: true,
        dominantEffectThreshold: 6.5,
        supportingEffectThreshold: 3.5
    };
    
    // Create each calculator directly
    const teaTypeCalculator = new TeaTypeCalculator(config);
    const compoundCalculator = new CompoundCalculator(config);
    const flavorCalculator = new FlavorCalculator(config);
    const processingCalculator = new ProcessingCalculator(config);
    const geographyCalculator = new GeographyCalculator(config);
    const seasonMatcher = new SeasonMatcher();
    const activityMatcher = new ActivityMatcher();
    const foodMatcher = new FoodMatcher();
    const timeMatcher = new TimeMatcher();
    
    // Note: These calculators directly import what they need in their implementations
    // No need to call setters as they use imports internally
    
    // Calculate results from each calculator
    const teaTypeResult = teaTypeCalculator.calculate(tea);
    const compoundResult = compoundCalculator.calculate(tea);
    const flavorResult = flavorCalculator.calculate(tea);
    const processingResult = processingCalculator.calculate(tea);
    const geographyResult = geographyCalculator.calculate(tea);
    
    // Combine all results
    const allResults = {
        teaType: teaTypeResult.data,
        compounds: compoundResult.data,
        flavors: flavorResult.data,
        processing: processingResult.data,
        geography: geographyResult.data
    };
    
    // Extract necessary data for matchers
    const geographyAnalysis = geographyResult.data?.geography || {};
    const processingAnalysis = processingResult.data?.processing?.analysis || {};
    const teaTypeAnalysis = teaTypeResult.data?.teaType?.analysis || {};
    const flavorAnalysis = flavorResult.data?.flavor?.analysis || {};
    const compoundAnalysis = compoundResult.data?.compounds?.analysis || {};
    
    // ---> ADD THESE LOGS <---
console.log("Inputs for TimeMatcher - Compound Analysis:", JSON.stringify(compoundAnalysis, null, 2));
console.log("Inputs for TimeMatcher - Tea Type Analysis:", JSON.stringify(teaTypeAnalysis, null, 2));
console.log("Inputs for TimeMatcher - Processing Analysis:", JSON.stringify(processingAnalysis, null, 2));
// ---> END OF LOGS <---


    // Get recommendations using matchers
    const recommendedSeasons = seasonMatcher.matchSeason(
        geographyAnalysis, 
        processingAnalysis, 
        teaTypeAnalysis, 
        flavorAnalysis
    );
    
    const recommendedActivitiesResult = activityMatcher.matchActivity(
        compoundAnalysis,
        teaTypeAnalysis,
        flavorAnalysis
    );
    
    const recommendedFoodsResult = foodMatcher.matchFood(
        flavorAnalysis,
        processingAnalysis,
        teaTypeAnalysis
        
    );
    
    const recommendedTimesResult = timeMatcher.matchTime(
        compoundAnalysis,
        teaTypeAnalysis,
        processingAnalysis
    );
    
    // Add to results
    allResults.seasonMatch = {
        recommendations: recommendedSeasons.recommendations,
        recommendedSeasons: recommendedSeasons.recommendedSeasons,
        idealRanges: recommendedSeasons.idealRanges,
        simplified: recommendedSeasons.simplified
    };
    allResults.activityMatch = recommendedActivitiesResult;
    allResults.foodMatch = recommendedFoodsResult;
    allResults.timeMatch = {
        recommendations: recommendedTimesResult.recommendations,
        recommendedTimes: recommendedTimesResult.recommendedTimes,
        idealRanges: recommendedTimesResult.idealRanges
    };
    
    // Generate derivative insights from the results
    const insights = generateInsightsFromResults(tea, allResults);
    
    // Define test sections
    const testSectionDefinitions = [
        {
            id: 'tea-info',
            title: 'Tea Information',
            calculator: 'TeaDatabase',
            inference: createTeaInfoMarkdown(tea),
            rawOutput: JSON.stringify(tea, null, 2),
            dataFlow: `TeaDatabase → ${tea.name} → Basic Information`
        },
        {
            id: 'compound-analysis',
            title: 'Compound Analysis',
            calculator: 'CompoundCalculator',
            inference: compoundResult.inference,
            rawOutput: JSON.stringify(compoundResult.data, null, 2),
            dataFlow: `CompoundCalculator → ${tea.name} → Compound Analysis`
        },
        {
            id: 'tea-type-analysis',
            title: 'Tea Type Analysis',
            calculator: 'TeaTypeCalculator',
            inference: teaTypeResult.inference,
            rawOutput: JSON.stringify(teaTypeResult.data, null, 2),
            dataFlow: `TeaTypeCalculator → ${tea.name} → Tea Type Analysis`
        },
        {
            id: 'processing-analysis',
            title: 'Processing Analysis',
            calculator: 'ProcessingCalculator',
            inference: processingResult.inference,
            rawOutput: JSON.stringify(processingResult.data, null, 2),
            dataFlow: `ProcessingCalculator → ${tea.name} → Processing Analysis`
        },
        {
            id: 'geography-analysis',
            title: 'Geography Analysis',
            calculator: 'GeographyCalculator',
            inference: geographyResult.inference,
            rawOutput: JSON.stringify(geographyResult.data, null, 2),
            dataFlow: `GeographyCalculator → ${tea.name} → Geography Analysis`
        },
        {
            id: 'flavor-analysis',
            title: 'Flavor Analysis',
            calculator: 'FlavorCalculator',
            inference: flavorResult.inference,
            rawOutput: JSON.stringify(flavorResult.data, null, 2),
            dataFlow: `FlavorCalculator → ${tea.name} → Flavor Analysis`
        },
        {
            id: 'season-match',
            title: 'Season Matching Results',
            calculator: 'SeasonMatcher',
            inference: createSeasonMatchMarkdown(allResults.seasonMatch),
            rawOutput: JSON.stringify(allResults.seasonMatch, null, 2),
            dataFlow: `SeasonMatcher → ${tea.name} → Recommended Seasons`
        },
        {
            id: 'activity-match',
            title: 'Activity Matching Results',
            calculator: 'ActivityMatcher',
            inference: createActivityMatchMarkdown(allResults.activityMatch),
            rawOutput: JSON.stringify(allResults.activityMatch, null, 2),
            dataFlow: `ActivityMatcher → ${tea.name} → Recommended Activities`
        },
        {
            id: 'food-match',
            title: 'Food Pairing Results',
            calculator: 'FoodMatcher',
            inference: createFoodMatchMarkdown(allResults.foodMatch),
            rawOutput: JSON.stringify(allResults.foodMatch, null, 2),
            dataFlow: `FoodMatcher → ${tea.name} → Recommended Food Pairings`
        },
        {
            id: 'time-match',
            title: 'Time of Day Results',
            calculator: 'TimeMatcher',
            inference: createTimeMatchMarkdown(allResults.timeMatch),
            rawOutput: JSON.stringify(allResults.timeMatch, null, 2),
            dataFlow: `TimeMatcher → ${tea.name} → Recommended Times`
        },
        {
            id: 'insights',
            title: 'Tea Insights & Recommendations',
            calculator: 'TeaInsights',
            inference: createInsightsMarkdown(insights),
            rawOutput: JSON.stringify(insights, null, 2),
            dataFlow: `Combined Results → ${tea.name} → Practical Insights`
        }
    ];
    
    // Create and append test sections
    testSectionDefinitions.forEach(sectionDef => {
        const testSection = document.createElement('test-section');
        testSection.title = sectionDef.title;
        testSection.dataFlow = sectionDef.dataFlow;
        testSection.inference = sectionDef.inference;
        testSection.calculator = sectionDef.calculator;
        testSection.rawOutput = sectionDef.rawOutput;
        testSection.id = `section-${sectionDef.id}`;
        testSectionsContainer.appendChild(testSection);
        
        // Store reference to the section element
        sectionRefs[sectionDef.id] = testSection;
    });
}

/**
 * Create markdown for tea information section
 * @param {Object} tea - The tea object
 * @returns {string} Markdown text
 */
function createTeaInfoMarkdown(tea) {
    let markdown = `# ${tea.name}\n`;
    
    if (tea.originalName) {
        markdown += `*${tea.originalName}*\n\n`;
    }
    
    markdown += `**Type:** ${tea.type}\n`;
    markdown += `**Origin:** ${tea.origin}\n\n`;
    
    // Chemical composition
    markdown += `## Chemical Composition\n`;
    markdown += `**L-Theanine Level:** ${tea.lTheanineLevel}/10\n`;
    markdown += `**Caffeine Level:** ${tea.caffeineLevel}/10\n`;
    
    const ratio = tea.lTheanineLevel / tea.caffeineLevel;
    markdown += `**Ratio:** ${ratio.toFixed(2)}\n\n`;
    
    // Flavor profile
    markdown += `## Flavor Profile\n`;
    if (tea.flavorProfile && tea.flavorProfile.length > 0) {
        tea.flavorProfile.forEach(flavor => {
            markdown += `- ${flavor}\n`;
        });
    } else {
        markdown += '*No flavor profile available*\n';
    }
    markdown += '\n';
    
    // Processing methods
    markdown += `## Processing Methods\n`;
    if (tea.processingMethods && tea.processingMethods.length > 0) {
        tea.processingMethods.forEach(method => {
            markdown += `- ${formatString(method)}\n`;
        });
    } else {
        markdown += '*No processing methods available*\n';
    }
    markdown += '\n';
    
    // Geography information
    if (tea.geography) {
        markdown += `## Geography\n`;
        markdown += `**Altitude:** ${tea.geography.altitude}m\n`;
        markdown += `**Humidity:** ${tea.geography.humidity}%\n`;
        markdown += `**Harvest Month:** ${getMonthName(tea.geography.harvestMonth)}\n\n`;
    }
    
    return markdown;
}

/**
 * Create markdown for effect analysis section
 * @param {Object} tea - The tea object
 * @param {Object} result - The calculation result
 * @returns {string} Markdown text
 */
function createEffectAnalysisMarkdown(tea, result) {
    const { dominantEffect, supportingEffects, allScores } = result.data;
    
    let markdown = `# Effect Analysis Results\n\n`;
    
    // Dominant effect
    markdown += `## Dominant Effect: ${dominantEffect.name}\n`;
    markdown += `${dominantEffect.description}\n\n`;
    markdown += `**Level:** ${formatScoreWithBar(dominantEffect.level)}\n\n`;
    
    // Expected effects
    const expectedDominant = getExpectedDominant(tea);
    if (expectedDominant !== 'N/A') {
        const dominantMatch = expectedDominant.toLowerCase() === dominantEffect.name.toLowerCase();
        markdown += `**Expected:** ${expectedDominant}\n`;
        markdown += `**Match:** ${dominantMatch ? '✓' : '✗'}\n\n`;
    }
    
    // Supporting effects
    markdown += `## Supporting Effects\n\n`;
    if (supportingEffects && supportingEffects.length > 0) {
        supportingEffects.forEach(effect => {
            markdown += `### ${effect.name}\n`;
            markdown += `${effect.description}\n\n`;
            markdown += `**Level:** ${formatScoreWithBar(effect.level)}\n\n`;
        });
    } else {
        markdown += '*No supporting effects*\n\n';
    }
    
    // Expected supporting
    const expectedSupporting = getExpectedSupporting(tea);
    if (expectedSupporting !== 'N/A') {
        markdown += `**Expected Supporting:** ${expectedSupporting}\n\n`;
    }
    
    // All effects
    markdown += `## All Effects\n\n`;
    if (allScores) {
        const sortedEffects = Object.entries(allScores)
            .sort((a, b) => b[1] - a[1]);
            
        sortedEffects.forEach(([effect, score]) => {
            markdown += `**${effect}:** ${formatScoreWithBar(score)}\n`;
        });
    } else {
        markdown += '*No effect scores available*\n';
    }
    
    return markdown;
}

/**
 * Create markdown for season match section
 * @param {Object} seasonMatch - The season matching results
 * @returns {string} Markdown text
 */
function createSeasonMatchMarkdown(seasonMatch) {
    // Handle the case where seasonMatch or its properties might be missing
    if (!seasonMatch || !seasonMatch.recommendations || !seasonMatch.idealRanges) {
        return '## Season Matching Results\n\nNo season matching data available or calculation failed.';
    }

    let markdown = `# Season Matching Results\n\n`;

    // Display Ideal Ranges
    markdown += `## Ideal Consumption Ranges\n\n`;
    if (seasonMatch.idealRanges.length > 0) {
        seasonMatch.idealRanges.forEach(range => {
             if (range.start === range.end) {
                 markdown += `- **${range.start}**: Score ${range.score}%\n`;
             } else {
                 markdown += `- **${range.start} to ${range.end}**: Avg Score ${range.score}%\n`;
             }
        });
    } else {
        markdown += `No specific ideal consumption range identified (score threshold might be too high).\n\n`;
    }

    // Display Top Recommended Seasons (with scores)
    markdown += `\n## Top Recommended Seasons\n\n`;
    if (seasonMatch.recommendedSeasons && seasonMatch.recommendedSeasons.length > 0) {
         seasonMatch.recommendedSeasons.forEach(season => {
             const seasonDisplay = formatString(season.name);
             // Using formatScoreWithBar (adjust maxScore if needed, assuming 100 here)
             markdown += `- **${seasonDisplay}:** ${formatScoreWithBar(season.score, 100)}\n`;
         });
    } else {
         markdown += `No specific seasons strongly recommended.\n`;
    }

    // Optionally, display the simplified output for reference
    if (seasonMatch.simplified && seasonMatch.simplified.recommended) {
         markdown += `\n## Simplified Recommendation\n\n`;
         markdown += `- ${seasonMatch.simplified.recommended.join(', ')}\n`;
    }

    markdown += `\n## Season Matching Logic\n\n`;
    markdown += `These recommendations are based on analyzing multiple factors:\n\n`;
    markdown += `- Tea type characteristics\n`;
    markdown += `- Processing methods energy tendencies\n`;
    markdown += `- Flavor profiles seasonal affinities\n`;
    markdown += `- Geographic and climate considerations\n\n`;
    
    markdown += `The SeasonMatcher algorithm looks for complementary relationships between the tea's qualities and seasonal attributes.`;

    return markdown;
}

/**
 * Create markdown for component analysis section
 * @param {Object} result - The calculation result
 * @returns {string} Markdown text
 */
function createComponentAnalysisMarkdown(result) {
    const { componentScores, dominantEffect, supportingEffects, finalScores, scoreProgression } = result.data;
    
    let markdown = `# Component Contribution Analysis\n\n`;
    
    // Add dominant and supporting effects summary
    if (dominantEffect) {
        markdown += `## Effect Summary\n\n`;
        markdown += `**Dominant Effect:** ${dominantEffect.name} (${dominantEffect.level.toFixed(1)}/10)\n\n`;
        
        if (supportingEffects && supportingEffects.length > 0) {
            markdown += `**Supporting Effects:** `;
            markdown += supportingEffects.map(effect => `${effect.name} (${effect.level.toFixed(1)}/10)`).join(', ');
            markdown += `\n\n`;
        }
    }
    
    // Base scores
    markdown += `## Base Scores\n\n`;
    markdown += formatComponentScoresMarkdown(componentScores.base);
    
    // Flavor influences
    markdown += `\n## Flavor Influences\n\n`;
    markdown += formatComponentScoresMarkdown(componentScores.flavors);
    
    // Processing influences
    markdown += `\n## Processing Influences\n\n`;
    if (!componentScores.processing || Object.keys(componentScores.processing).length === 0) {
        markdown += '*No processing scores available. Processing methods might not be recognized or defined for this tea.*\n';
    } else {
        markdown += formatComponentScoresMarkdown(componentScores.processing);
    }
    
    // Geography influences
    markdown += `\n## Geography Influences\n\n`;
    markdown += formatComponentScoresMarkdown(componentScores.geography);
    
    // Compound influences
    markdown += `\n## Compound Influences\n\n`;
    markdown += formatComponentScoresMarkdown(componentScores.compounds);
    
    // Add comprehensive contribution breakdown table for top effects
    if (scoreProgression && finalScores) {
        const topEffectIDs = Object.entries(finalScores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([id]) => id);
            
        if (topEffectIDs.length > 0) {
            markdown += `\n## Component Contribution Breakdown\n\n`;
            markdown += `| Effect | Base | +Processing | +Geography | +Flavor | +Compounds | Final |\n`;
            markdown += `|--------|------|------------|------------|---------|------------|-------|\n`;
            
            topEffectIDs.forEach(effectId => {
                // Get the effect name
                let effectName = effectId;
                if (dominantEffect && dominantEffect.id === effectId) {
                    effectName = `${dominantEffect.name} ★`;
                } else if (supportingEffects) {
                    const supportingEffect = supportingEffects.find(e => e.id === effectId);
                    if (supportingEffect) {
                        effectName = `${supportingEffect.name} ☆`;
                    }
                }
                
                const baseScore = (scoreProgression.withBaseScores || {})[effectId]?.toFixed(1) || "0.0";
                const withProcessing = (scoreProgression.withProcessingScores || {})[effectId]?.toFixed(1) || "0.0";
                const withGeo = (scoreProgression.withGeographyScores || {})[effectId]?.toFixed(1) || "0.0";
                const withFlavor = (scoreProgression.withFlavorScores || {})[effectId]?.toFixed(1) || "0.0";
                const withCompound = (scoreProgression.withCompoundScores || {})[effectId]?.toFixed(1) || "0.0";
                const final = finalScores[effectId]?.toFixed(1) || "0.0";
                
                markdown += `| **${effectName}** | ${baseScore} | ${withProcessing} | ${withGeo} | ${withFlavor} | ${withCompound} | ${final} |\n`;
            });
            
            markdown += `\n**Legend:**\n`;
            markdown += `- ★ Dominant Effect\n`;
            markdown += `- ☆ Supporting Effect\n`;
        }
    }
    
    return markdown;
}

/**
 * Format component scores as markdown
 * @param {Object} scores - Component scores object
 * @returns {string} Markdown text
 */
function formatComponentScoresMarkdown(scores) {
    if (!scores || Object.keys(scores).length === 0) {
        return '*No scores available*\n';
    }
    
    let markdown = '';
    const sortedScores = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);
        
    sortedScores.forEach(([effect, score]) => {
        markdown += `**${formatString(effect)}:** ${formatScoreWithBar(score)}\n`;
    });
    
    return markdown;
}

/**
 * Generate JSON data for a given tea
 * @param {Object} tea - The tea to analyze
 */
function generateJsonData(tea) {
    // Initialize config with simple object instead of using EffectSystemConfig
    const config = {
        // Simple config with reasonable defaults
        normalizeScores: true,
        dominantEffectThreshold: 6.5,
        supportingEffectThreshold: 3.5
    };
    
    // Create each calculator directly
    const teaTypeCalculator = new TeaTypeCalculator(config);
    const compoundCalculator = new CompoundCalculator(config);
    const flavorCalculator = new FlavorCalculator(config);
    const processingCalculator = new ProcessingCalculator(config);
    const geographyCalculator = new GeographyCalculator(config);
    const seasonMatcher = new SeasonMatcher();
    const activityMatcher = new ActivityMatcher();
    const foodMatcher = new FoodMatcher();
    const timeMatcher = new TimeMatcher();
    
    // Note: These calculators directly import what they need in their implementations
    // No need to call setters as they use imports internally
    
    // Calculate results from each calculator
    const teaTypeResult = teaTypeCalculator.calculate(tea);
    const compoundResult = compoundCalculator.calculate(tea);
    const flavorResult = flavorCalculator.calculate(tea);
    const processingResult = processingCalculator.calculate(tea);
    const geographyResult = geographyCalculator.calculate(tea);
    
    // Combine all results
    const allResults = {
        teaType: teaTypeResult.data,
        compounds: compoundResult.data,
        flavors: flavorResult.data,
        processing: processingResult.data,
        geography: geographyResult.data
    };
    
    // Extract necessary data for matchers
    const geographyAnalysis = geographyResult.data?.geography || {};
    const processingAnalysis = processingResult.data?.processing?.analysis || {};
    const teaTypeAnalysis = teaTypeResult.data?.teaType?.analysis || {};
    const flavorAnalysis = flavorResult.data?.flavor?.analysis || {};
    const compoundAnalysis = compoundResult.data?.compounds?.analysis || {};
    
    // Get recommendations using matchers
    const recommendedSeasons = seasonMatcher.matchSeason(
        geographyAnalysis, 
        processingAnalysis, 
        teaTypeAnalysis, 
        flavorAnalysis
    );
    
    const recommendedActivitiesResult = activityMatcher.matchActivity(
        compoundAnalysis,
        teaTypeAnalysis,
        flavorAnalysis
    );
    
    const recommendedFoodsResult = foodMatcher.matchFood(
        flavorAnalysis,
        processingAnalysis,
        teaTypeAnalysis
    );
    
    const recommendedTimesResult = timeMatcher.matchTime(
        compoundAnalysis,
        teaTypeAnalysis,
        processingAnalysis
    );
    
    // Add to results
    allResults.seasonMatch = {
        recommendations: recommendedSeasons.recommendations,
        recommendedSeasons: recommendedSeasons.recommendedSeasons,
        idealRanges: recommendedSeasons.idealRanges,
        simplified: recommendedSeasons.simplified
    };
    allResults.activityMatch = recommendedActivitiesResult;
    allResults.foodMatch = recommendedFoodsResult;
    allResults.timeMatch = {
        recommendations: recommendedTimesResult.recommendations,
        recommendedTimes: recommendedTimesResult.recommendedTimes,
        idealRanges: recommendedTimesResult.idealRanges
    };
    
    // Generate derivative insights from the results
    const insights = generateInsightsFromResults(tea, allResults);
    
    // Generate the JSON structure
    currentJsonData = {
        tea: {
            name: tea.name || 'Unknown',
            originalName: tea.originalName || '',
            type: tea.type || 'unknown',
            origin: tea.origin || 'Unknown',
            compounds: {
                lTheanine: tea.lTheanineLevel || 0,
                caffeine: tea.caffeineLevel || 0,
                ratio: tea.lTheanineLevel / tea.caffeineLevel
            },
            flavorProfile: tea.flavorProfile || [],
            processingMethods: tea.processingMethods || [],
            geography: tea.geography || {}
        },
        analysis: {
            teaType: teaTypeResult.data,
            compounds: compoundResult.data,
            processing: processingResult.data,
            geography: geographyResult.data,
            flavors: flavorResult.data,
            seasonMatch: allResults.seasonMatch,
            activityMatch: allResults.activityMatch,
            foodMatch: allResults.foodMatch,
            timeMatch: allResults.timeMatch,
            insights: insights
        },
        calculatedAt: new Date().toISOString(),
        _sectionRef: {
            tea: 'tea-info',
            'analysis.teaType': 'tea-type-analysis',
            'analysis.compounds': 'compound-analysis',
            'analysis.processing': 'processing-analysis',
            'analysis.geography': 'geography-analysis',
            'analysis.flavors': 'flavor-analysis',
            'analysis.seasonMatch': 'season-match',
            'analysis.activityMatch': 'activity-match',
            'analysis.foodMatch': 'food-match',
            'analysis.timeMatch': 'time-match',
            'analysis.insights': 'insights'
        }
    };
    
    // Display the JSON with references
    displayJsonWithReferences(currentJsonData);
}

/**
 * Display formatted JSON with clickable references
 * @param {Object} jsonData - The JSON data to display
 */
function displayJsonWithReferences(jsonData) {
    const jsonContentElement = document.querySelector('.json-content');
    if (!jsonContentElement) return;
    
    // Create a formatted JSON string with syntax highlighting and references
    const formattedJson = formatJsonWithReferences(jsonData);
    jsonContentElement.innerHTML = formattedJson;
    
    // Add controls for expanding/collapsing all
    const controlsHtml = `
        <div class="json-expand-controls mb-2">
            <button id="expand-all" class="mr-2">Expand All</button>
            <button id="collapse-all" class="mr-2">Collapse All</button>
            <button id="reset-view">Reset View</button>
        </div>
    `;
    jsonContentElement.insertAdjacentHTML('afterbegin', controlsHtml);
    
    // Add event listeners for expand/collapse all buttons
    document.getElementById('expand-all').addEventListener('click', () => {
        document.querySelectorAll('.json-expandable.collapsed').forEach(el => {
            el.classList.remove('collapsed');
            
            // Update the toggle button
            const toggleBtn = document.querySelector(`.json-toggle[data-target="${el.id}"]`);
            if (toggleBtn) {
                toggleBtn.classList.remove('collapsed');
                toggleBtn.textContent = '▼';
            }
        });
    });
    
    document.getElementById('collapse-all').addEventListener('click', () => {
        document.querySelectorAll('.json-expandable').forEach(el => {
            // Don't collapse the root level
            if (el.id !== 'json-root') {
                el.classList.add('collapsed');
                
                // Update the toggle button
                const toggleBtn = document.querySelector(`.json-toggle[data-target="${el.id}"]`);
                if (toggleBtn) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.textContent = '▶';
                }
            }
        });
    });
    
    // Add event listener for reset view (default state with level 0-2 expanded, 3+ collapsed)
    document.getElementById('reset-view').addEventListener('click', () => {
        resetExpandCollapseState();
    });
    
    // Set initial state correctly after DOM is loaded
    setTimeout(() => {
        resetExpandCollapseState();
    }, 100);
}

/**
 * Reset the expand/collapse state to the default view
 * - Level 1 (main sections): expanded
 * - Level 2 (direct children): collapsed
 * - Level 3+ (sub-children): always expanded
 */
function resetExpandCollapseState() {
    // Determine the nesting level of each json-expandable element
    const elements = document.querySelectorAll('.json-expandable');
    
    elements.forEach(el => {
        const path = el.id.replace('json-', '').replace(/-/g, '.').replace(/_/g, '[').replace(/_/g, ']');
        const nestLevel = path === 'root' ? 0 : (path.match(/\./g) || []).length + 1;
        
        // Get the corresponding toggle button
        const toggleBtn = document.querySelector(`.json-toggle[data-target="${el.id}"]`);
        
        if (nestLevel === 2) {
            // Collapse level 2 (direct children)
            el.classList.add('collapsed');
            if (toggleBtn) {
                toggleBtn.classList.add('collapsed');
                toggleBtn.textContent = '▶';
            }
        } else {
            // Expand everything else (root, main sections, and sub-children)
            el.classList.remove('collapsed');
            if (toggleBtn) {
                toggleBtn.classList.remove('collapsed');
                toggleBtn.textContent = '▼';
            }
        }
    });
}

/**
 * Format a JSON object into a HTML string with syntax highlighting and references
 * @param {object} obj - The JSON object to format
 * @param {number} indent - The current indentation level
 * @param {string} path - The current path in the JSON object
 * @param {number} nestLevel - The current nesting level
 * @returns {string} - The formatted HTML string
 */
function formatJsonWithReferences(obj, indent = 0, path = '', nestLevel = 0) {
    let html = '';
    const indentStr = '\t'.repeat(indent);
    const padding = indent * 8;
    
    // Create a unique ID for references
    const pathId = path ? path.replace(/\./g, '-').replace(/\[/g, '_').replace(/\]/g, '_') : 'root';
    
    if (Array.isArray(obj)) {
        // Display an array
        if (obj.length === 0) {
            html += `<span class="json-syntax">[</span><span class="json-syntax">]</span>`;
        } else {
            // Determine if this node should be collapsible
            const isCollapsible = nestLevel <= 2;
            
            // Determine if this node should be collapsed by default
            const isCollapsed = nestLevel === 2;
            
            // Add appropriate classes based on collapsibility and collapse state
            if (isCollapsible) {
                html += `<span class="json-toggle ${isCollapsed ? 'collapsed' : ''}" data-target="json-${pathId}">${isCollapsed ? '▶' : '▼'}</span>`;
            }
            
            html += `<span class="json-syntax">[</span>`;
            
            if (isCollapsible) {
                html += `<div id="json-${pathId}" class="json-expandable ${isCollapsed ? 'collapsed' : ''}">`;
            }
            
            // Process each item in the array
            obj.forEach((item, index) => {
                html += `<div style="padding-left: ${padding + 8}px;">`;
                html += formatJsonWithReferences(item, indent + 1, `${path}[${index}]`, nestLevel + 1);
                if (index < obj.length - 1) {
                    html += '<span class="json-syntax">,</span>';
                }
                html += '</div>';
            });
            
            if (isCollapsible) {
                html += `</div>`;
            }
            
            html += `<div style="padding-left: ${padding}px;"><span class="json-syntax">]</span></div>`;
        }
    } else if (obj !== null && typeof obj === 'object') {
        // Display an object
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            html += `<span class="json-syntax">{</span><span class="json-syntax">}</span>`;
        } else {
            // Determine if this node should be collapsible
            const isCollapsible = nestLevel <= 2;
            
            // Determine if this node should be collapsed by default
            const isCollapsed = nestLevel === 2;
            
            // Add appropriate classes based on collapsibility and collapse state
            if (isCollapsible) {
                html += `<span class="json-toggle ${isCollapsed ? 'collapsed' : ''}" data-target="json-${pathId}">${isCollapsed ? '▶' : '▼'}</span>`;
            }
            
            html += `<span class="json-syntax">{</span>`;
            
            if (isCollapsible) {
                html += `<div id="json-${pathId}" class="json-expandable ${isCollapsed ? 'collapsed' : ''}">`;
            }
            
            // Process each key-value pair in the object
            keys.forEach((key, index) => {
                const value = obj[key];
                const newPath = path ? `${path}.${key}` : key;
                
                // Add reference markers for specific sections
                let sectionRef = null;
                if (key === '_sectionRef') {
                    sectionRef = value;
                } else if (path === '' && typeof value === 'object' && value !== null && key !== 'tea') {
                    sectionRef = value._sectionRef || obj._sectionRef?.[key];
                }
                
                html += `<div style="padding-left: ${padding + 8}px;">`;
                
                // Add anchor icon before the key if this is a main section
                if (sectionRef) {
                    html += `<span class="reference-marker" data-section="${sectionRef}" title="View in analysis">⚓</span> `;
                }
                
                html += `<span class="key">"${key}"</span><span class="json-syntax">: </span>`;
                html += formatJsonWithReferences(value, indent + 1, newPath, nestLevel + 1);
                if (index < keys.length - 1) {
                    html += '<span class="json-syntax">,</span>';
                }
                html += '</div>';
            });
            
            if (isCollapsible) {
                html += `</div>`;
            }
            
            html += `<div style="padding-left: ${padding}px;"><span class="json-syntax">}</span></div>`;
        }
    } else if (typeof obj === 'string') {
        // Display a string
        html += `<span class="string">"${escapeHtml(obj)}"</span>`;
    } else if (typeof obj === 'number') {
        // Display a number
        html += `<span class="number">${obj}</span>`;
    } else if (typeof obj === 'boolean') {
        // Display a boolean
        html += `<span class="boolean">${obj}</span>`;
    } else if (obj === null) {
        // Display null
        html += `<span class="null">null</span>`;
    }
    
    return html;
}

/**
 * Helper: Format string (capitalize and replace hyphens)
 */
function formatString(str) {
    if (!str) return '';
    return str.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Helper: Get month name from month number
 */
function getMonthName(monthNumber) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'Unknown';
}

/**
 * Helper: Get expected dominant effect
 */
function getExpectedDominant(tea) {
    if (!tea.expectedEffects) return 'N/A';
    
    if (tea.expectedEffects.dominant) {
        return tea.expectedEffects.dominant;
    }
    
    const effects = Object.entries(tea.expectedEffects);
    if (effects.length === 0) return 'N/A';
    
    effects.sort((a, b) => b[1] - a[1]);
    return effects[0][0];
}

/**
 * Helper: Get expected supporting effects
 */
function getExpectedSupporting(tea) {
    if (!tea.expectedEffects) return 'N/A';
    
    if (tea.expectedEffects.supporting) {
        return tea.expectedEffects.supporting;
    }
    
    const effects = Object.entries(tea.expectedEffects);
    if (effects.length <= 1) return 'N/A';
    
    effects.sort((a, b) => b[1] - a[1]);
    return effects.slice(1, 3).map(e => e[0]).join(', ');
}

/**
 * Helper: Normalize string for filenames
 */
function normalizeString(str) {
    if (!str) return 'unknown';
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Generate insights from results, including average effect scores
 * @param {Object} tea - The tea to analyze
 * @param {Object} results - Combined results from all calculators
 * @returns {Object} Insights and recommendations
 */
function generateInsightsFromResults(tea, results) {
    // Calculate average effect scores
    const effectScores = calculateAverageEffectScores(results);
    
    // Determine dominant and supporting effects
    const effectRanking = determineEffectRanking(effectScores);
    
    // Timing recommendations
    const timingInsight = getTimingRecommendations(tea, results);
    
    // Seasonal recommendations
    const seasonalInsight = getSeasonalRecommendations(tea, results);
    
    // Activity recommendations
    const activityInsight = getActivityRecommendations(tea, results);
    
    // Geographic insights
    const geographicInsight = getGeographicInsights(tea, results);
    
    return {
        effects: {
            scores: effectScores,
            dominant: effectRanking.dominant,
            supporting: effectRanking.supporting
        },
        timing: timingInsight,
        seasonal: seasonalInsight,
        activities: activityInsight,
        geography: geographicInsight
    };
}

/**
 * Calculate average effect scores from all calculators
 * @param {Object} results - Combined results from all calculators
 * @returns {Object} Average effect scores
 */
function calculateAverageEffectScores(results) {
    // Collect all effect scores from different calculators
    const effectsMap = {};
    const counts = {};
    
    // Process tea type scores
    if (results.teaType && results.teaType.typeScores) {
        Object.entries(results.teaType.typeScores).forEach(([effect, score]) => {
            effectsMap[effect] = (effectsMap[effect] || 0) + score;
            counts[effect] = (counts[effect] || 0) + 1;
        });
    }
    
    // Process flavor scores
    if (results.flavors && results.flavors.flavorScores) {
        Object.entries(results.flavors.flavorScores).forEach(([effect, score]) => {
            effectsMap[effect] = (effectsMap[effect] || 0) + score;
            counts[effect] = (counts[effect] || 0) + 1;
        });
    }
    
    // Process processing scores
    if (results.processing && results.processing.processingScores) {
        Object.entries(results.processing.processingScores).forEach(([effect, score]) => {
            effectsMap[effect] = (effectsMap[effect] || 0) + score;
            counts[effect] = (counts[effect] || 0) + 1;
        });
    }
    
    // Process geography scores
    if (results.geography && results.geography.geographyScores) {
        Object.entries(results.geography.geographyScores).forEach(([effect, score]) => {
            effectsMap[effect] = (effectsMap[effect] || 0) + score;
            counts[effect] = (counts[effect] || 0) + 1;
        });
    }
    
    // Process compound scores
    if (results.compounds && results.compounds.compoundScores) {
        Object.entries(results.compounds.compoundScores).forEach(([effect, score]) => {
            effectsMap[effect] = (effectsMap[effect] || 0) + score;
            counts[effect] = (counts[effect] || 0) + 1;
        });
    }
    
    // Calculate averages
    const averageScores = {};
    Object.entries(effectsMap).forEach(([effect, totalScore]) => {
        if (counts[effect] > 0) {
            averageScores[effect] = totalScore / counts[effect];
        }
    });
    
    return averageScores;
}

/**
 * Determine dominant and supporting effects from effect scores
 * @param {Object} effectScores - Effect scores
 * @returns {Object} Dominant and supporting effects
 */
function determineEffectRanking(effectScores) {
    // Sort effects by score
    const sortedEffects = Object.entries(effectScores)
        .sort((a, b) => b[1] - a[1])
        .map(([id, score]) => ({
            id,
            name: formatString(id),
            score
        }));
    
    // Get dominant effect (top score)
    const dominant = sortedEffects.length > 0 ? sortedEffects[0] : null;
    
    // Get supporting effects (next 2 highest scores, if they're at least 3.0)
    const supporting = sortedEffects
        .slice(1, 3)
        .filter(effect => effect.score >= 3.0);
    
    return {
        dominant,
        supporting
    };
}

/**
 * Create markdown for insights section
 * @param {Object} insights - The insights object
 * @returns {string} Markdown text
 */
function createInsightsMarkdown(insights) {
    let markdown = `# Tea Insights & Recommendations\n\n`;
    
    // Effects section
    if (insights.effects && insights.effects.dominant) {
        markdown += `## Effect Profile\n\n`;
        markdown += `**Dominant Effect:** ${insights.effects.dominant.name} (${insights.effects.dominant.score.toFixed(1)}/10)\n\n`;
        
        if (insights.effects.supporting && insights.effects.supporting.length > 0) {
            markdown += `**Supporting Effects:** ${insights.effects.supporting.map(e => `${e.name} (${e.score.toFixed(1)}/10)`).join(', ')}\n\n`;
        }
        
        markdown += `### Average Effect Scores\n\n`;
        
        // Show top 5 effects by score
        const topEffects = Object.entries(insights.effects.scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
            
        topEffects.forEach(([effect, score]) => {
            markdown += `**${formatString(effect)}:** ${formatScoreWithBar(score)}\n`;
        });
        markdown += `\n`;
    }
    
    // Timing section
    if (insights.timing) {
        markdown += `## Best Time to Enjoy\n\n`;
        markdown += `**Best Time:** ${formatString(insights.timing.bestTime)}\n\n`;
        markdown += `${insights.timing.explanation}\n\n`;
        
        markdown += `### Time of Day Recommendations\n\n`;
        Object.entries(insights.timing.recommendations)
            .sort((a, b) => b[1] - a[1])
            .forEach(([time, score]) => {
                markdown += `**${formatString(time)}:** ${formatScoreWithBar(score/10)}\n`;
            });
        markdown += `\n`;
    }
    
    // Seasonal section
    if (insights.seasonal) {
        markdown += `## Seasonal Recommendations\n\n`;
        markdown += `**Best Season:** ${formatString(insights.seasonal.bestSeason)}\n\n`;
        markdown += `${insights.seasonal.explanation}\n\n`;
        
        markdown += `### Season Preferences\n\n`;
        Object.entries(insights.seasonal.recommendations)
            .sort((a, b) => b[1] - a[1])
            .forEach(([season, score]) => {
                markdown += `**${formatString(season)}:** ${formatScoreWithBar(score/10)}\n`;
            });
        markdown += `\n`;
    }
    
    // Activities section
    if (insights.activities) {
        markdown += `## Activity Recommendations\n\n`;
        markdown += `**Top Activities:** ${insights.activities.topActivities.map(formatString).join(', ')}\n\n`;
        markdown += `${insights.activities.explanation}\n\n`;
        
        markdown += `### Activity Suitability\n\n`;
        Object.entries(insights.activities.recommendations)
            .sort((a, b) => b[1] - a[1])
            .forEach(([activity, score]) => {
                markdown += `**${formatString(activity)}:** ${formatScoreWithBar(score/10)}\n`;
            });
        markdown += `\n`;
    }
    
    // Geography section
    if (insights.geography && !insights.geography.error) {
        markdown += `## Geographic Insights\n\n`;
        markdown += `**Origin:** ${insights.geography.origin}\n\n`;
        markdown += `${insights.geography.explanation}\n\n`;
        
        if (insights.geography.characteristics && Object.keys(insights.geography.characteristics).length > 0) {
            markdown += `### Regional Characteristics\n\n`;
            Object.entries(insights.geography.characteristics)
                .forEach(([characteristic, value]) => {
                    markdown += `**${formatString(characteristic)}:** ${value}\n`;
                });
            markdown += `\n`;
        }
    }
    
    return markdown;
}

/**
 * Get timing recommendations for a tea
 * @param {Object} tea - The tea to analyze
 * @param {Object} results - Combined results from all calculators
 * @returns {Object} Timing recommendations
 */
function getTimingRecommendations(tea, results) {
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
        explanation: generateTimingExplanation(bestTime, tea, ratio)
    };
}

/**
 * Get seasonal recommendations for a tea
 * @param {Object} tea - The tea to analyze
 * @param {Object} results - Combined results from all calculators
 * @returns {Object} Seasonal recommendations
 */
function getSeasonalRecommendations(tea, results) {
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
        explanation: generateSeasonalExplanation(bestSeason, tea)
    };
}

/**
 * Get activity recommendations for a tea
 * @param {Object} tea - The tea to analyze
 * @param {Object} results - Combined results from all calculators
 * @returns {Object} Activity recommendations
 */
function getActivityRecommendations(tea, results) {
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
        explanation: generateActivityExplanation(topActivities[0], tea)
    };
}

/**
 * Get geography insights for a tea
 * @param {Object} tea - The tea to analyze
 * @param {Object} results - Combined results from all calculators
 * @returns {Object} Geography insights
 */
function getGeographicInsights(tea, results) {
    if (!tea.origin) return { error: "No origin information available" };
    
    // Extract geography data
    const geography = results.geography || {};
    
    return {
        origin: tea.origin,
        characteristics: geography.characteristics || {},
        terroir: geography.terroir || {},
        explanation: geography.description || `${tea.name} comes from ${tea.origin}, which impacts its character through the local terroir.`
    };
}

/**
 * Helper function for timing explanations
 * @param {string} timing - The best time period
 * @param {Object} tea - The tea object
 * @param {number} ratio - L-theanine to caffeine ratio
 * @returns {string} Formatted explanation
 */
function generateTimingExplanation(timing, tea, ratio) {
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

/**
 * Helper function for seasonal explanations
 * @param {string} season - The best season
 * @param {Object} tea - The tea object
 * @returns {string} Formatted explanation
 */
function generateSeasonalExplanation(season, tea) {
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

/**
 * Helper function for activity explanations
 * @param {string} activity - The top activity
 * @param {Object} tea - The tea object
 * @returns {string} Formatted explanation
 */
function generateActivityExplanation(activity, tea) {
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

/**
 * Create markdown for activity match section - UPDATED for New ActivityMatcher Output
 * @param {Object} activityMatch - The activity matching results object
 * @returns {string} Markdown text
 */
function createActivityMatchMarkdown(activityMatch) {
    // Handle missing data
    if (!activityMatch || !activityMatch.recommendations || !activityMatch.recommendedActivities || !activityMatch.activityClusters) {
        return '## Activity Matching Results\n\nNo activity matching data available or calculation failed.';
    }

    let markdown = `# Activity Matching Results\n\n`;

    // Display Top Recommended Individual Activities
    markdown += `## Top Recommended Activities\n\n`;
    if (activityMatch.recommendedActivities.length > 0) {
        activityMatch.recommendedActivities.forEach(activity => {
            const activityDisplay = formatString(activity.name); // Use helper
            markdown += `- **${activityDisplay}:** ${formatScoreWithBar(activity.score, 100)}\n`;
        });
    } else {
        markdown += `No specific activities strongly recommended.\n`;
    }
    markdown += '\n';

    // Display Recommended Activity Clusters
    markdown += `## Recommended Activity Themes\n\n`;
    if (activityMatch.activityClusters.length > 0) {
        activityMatch.activityClusters.forEach(cluster => {
            markdown += `### ${cluster.theme} (Avg Score: ${cluster.score}%)\n`;
            // List top 1-3 activities within the cluster
            cluster.activities.slice(0, 3).forEach(act => {
                markdown += `- ${formatString(act.name)} (${act.score}%)\n`;
            });
            markdown += '\n'; // Add space between clusters
        });
    } else {
        markdown += `No specific activity themes strongly recommended (cluster score threshold might be high).\n`;
    }
    markdown += '\n';

    // Add explanation about the logic
    markdown += `## Activity Matching Logic\n\n`;
    markdown += `These recommendations consider the tea's:\n\n`;
    markdown += `- Energetic profile (stimulation/relaxation)\n`;
    markdown += `- Base hints from tea type and flavor\n\n`;
    markdown += `Activities are grouped into themes for broader suggestions.`;

    return markdown;
}

/**
 * Create markdown for food match section - UPDATED for New FoodMatcher Output
 * @param {Object} foodMatch - The food matching results object
 * @returns {string} Markdown text
 */
function createFoodMatchMarkdown(foodMatch) {
    // Handle missing data
    if (!foodMatch || !foodMatch.recommendations || !foodMatch.recommendedFoods || !foodMatch.mealClusters) {
        return '## Food Pairing Results\n\nNo food pairing data available or calculation failed.';
    }

    let markdown = `# Food Pairing Results\n\n`;

    // Display Top Recommended Individual Foods
    markdown += `## Top Recommended Pairings\n\n`;
    if (foodMatch.recommendedFoods.length > 0) {
        foodMatch.recommendedFoods.forEach(food => {
            const foodDisplay = formatString(food.name); // Use helper
            markdown += `- **${foodDisplay}:** ${formatScoreWithBar(food.score, 100)}\n`;
        });
    } else {
        markdown += `No specific foods strongly recommended.\n`;
    }
    markdown += '\n';

    // Display Recommended Meal Occasion Clusters
    markdown += `## Recommended Meal Occasions / Themes\n\n`;
    if (foodMatch.mealClusters.length > 0) {
        foodMatch.mealClusters.forEach(cluster => {
            markdown += `### ${cluster.occasion} (Avg Score: ${cluster.score}%)\n`;
            // List top 1-3 foods within the cluster for context
            cluster.foods.slice(0, 3).forEach(f => {
                markdown += `- ${formatString(f.name)} (${f.score}%)\n`;
            });
            markdown += '\n'; // Add space between clusters
        });
    } else {
        markdown += `No specific meal occasions strongly recommended (cluster score threshold might be high).\n`;
    }
    markdown += '\n';

    // Add explanation about the logic
    markdown += `## Food Pairing Logic\n\n`;
    markdown += `These recommendations consider the tea's:\n\n`;
    markdown += `- Flavor profile (complementary/contrasting)\n`;
    markdown += `- Body and mouthfeel\n`;
    markdown += `- Processing and tea type characteristics\n\n`;
    markdown += `Pairings are grouped by meal occasion/theme for practical suggestions.`;

    return markdown;
}

/**
 * Create markdown for time match section
 * @param {Object} timeMatch - The time matching results with scores
 * @returns {string} Markdown text
 */
function createTimeMatchMarkdown(timeMatch) {
    // Handle the case where timeMatch or its properties might be missing
    if (!timeMatch || !timeMatch.recommendations || !timeMatch.idealRanges || !timeMatch.recommendedTimes) {
        return '## Time of Day Results\n\nNo time matching data available or calculation failed.';
    }

    let markdown = `# Time of Day Results\n\n`;

    // Display Ideal Ranges
    markdown += `## Ideal Consumption Ranges\n\n`;
    if (timeMatch.idealRanges.length > 0) {
        timeMatch.idealRanges.forEach(range => {
            if (range.start === range.end) {
                markdown += `- **${range.start}**: Score ${range.score}%\n`;
            } else {
                markdown += `- **${range.start} to ${range.end}**: Avg Score ${range.score}%\n`;
            }
        });
    } else {
        markdown += `No specific ideal consumption time range identified (score threshold might be too high).\n`;
    }
    markdown += '\n'; // Add spacing

    // Display Top Recommended Times (with scores)
    markdown += `## Top Recommended Times\n\n`;
    if (timeMatch.recommendedTimes && timeMatch.recommendedTimes.length > 0) {
        timeMatch.recommendedTimes.forEach(time => {
            const timeDisplay = formatString(time.name); // Use existing helper
            // Using formatScoreWithBar (assuming scores are 0-100 normalized)
            markdown += `- **${timeDisplay}:** ${formatScoreWithBar(time.score, 100)}\n`;
        });
    } else {
        markdown += `No specific times strongly recommended.\n`;
    }
    markdown += '\n'; // Add spacing

    // Add explanation about the logic
    markdown += `## Time Matching Logic\n\n`;
    markdown += `These recommendations are based on analyzing factors like:\n\n`;
    markdown += `- Compound profile (stimulation/relaxation)\n`;
    markdown += `- Overall caffeine level\n`;
    markdown += `- Tea type traditional consumption patterns\n\n`;
    markdown += `The TimeMatcher algorithm balances the tea's energetic properties with typical daily rhythms.`;

    return markdown;
}

export default {
    initializeSidebar,
    generateJsonData,
    displayJsonWithReferences,
}; 