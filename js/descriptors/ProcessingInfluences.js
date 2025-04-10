// ProcessingInfluences.js
// Defines the influences of various tea processing methods on tangible characteristics.
// Updated with mouthFeel and compoundEffectModifier fields.

export const processingInfluences = {

    // --- Heat Treatments & Oxidation Control ---
    'steamed': {
        description: 'Gentle heat preservation (common in Japanese greens) that maintains delicate compounds and vibrant color.',
        category: 'heat/oxidation_stop',
        flavorImpact: ["enhances vegetal/marine notes", "preserves freshness", "reduces bitterness compared to pan-firing"],
        mouthFeel: "lighter", // Renamed from bodyImpact
        energeticTendency: "cooling",
        compoundEffectModifier: "clean focus", // Renamed from alertnessImpactModifier
        compoundImpactNotes: ["preserves catechins well", "maintains L-theanine"]
    },
    'pan-fired': {
        description: 'Toasting method (common in Chinese greens) to halt oxidation, adding subtle complexity and nutty notes.',
        category: 'heat/oxidation_stop',
        flavorImpact: ["adds subtle nutty/toasty notes", "reduces vegetal intensity compared to steaming", "creates mellow sweetness"],
        mouthFeel: "medium-light", // Renamed
        energeticTendency: "neutral-warming",
        compoundEffectModifier: "focused", // Renamed
        compoundImpactNotes: ["slightly modifies catechins", "preserves most compounds"]
    },
    'kill-green': {
        description: 'General term for halting enzymatic oxidation using heat.',
        category: 'heat/oxidation_stop',
        flavorImpact: ["stops development of oxidized notes", "preserves existing fresh notes"],
        mouthFeel: "variable", // Renamed
        energeticTendency: "neutral",
        compoundEffectModifier: "neutral", // Renamed
        compoundImpactNotes: ["stops enzymatic changes"]
    },

    // --- Roasting ---
    'minimal-roast': {
        description: 'Very light roasting (often for light oolongs or finishing) preserving brightness.',
        category: 'roast',
        flavorImpact: ["enhances aroma", "adds subtle warmth", "preserves most original flavors"],
        mouthFeel: "unchanged", // Renamed
        energeticTendency: "neutral-warming",
        compoundEffectModifier: "smooths slightly", // Renamed
        compoundImpactNotes: []
    },
    'light-roast': {
        description: 'Subtle roasting adding complexity without deep toasted notes.',
        category: 'roast',
        flavorImpact: ["adds light nutty/grainy notes", "enhances sweetness", "rounds off sharp edges"],
        mouthFeel: "slightly fuller", // Renamed
        energeticTendency: "warming",
        compoundEffectModifier: "smooths", // Renamed
        compoundImpactNotes: ["starts Maillard reactions"]
    },
    'medium-roast': {
        description: 'Balanced roasting developing richer, complex notes like nuts, caramel, or toast.',
        category: 'roast',
        flavorImpact: ["develops nutty/caramel/toasty notes", "reduces floral/vegetal notes", "increases perceived sweetness"],
        mouthFeel: "fuller", // Renamed
        energeticTendency: "warming",
        compoundEffectModifier: "smooths significantly", // Renamed
        compoundImpactNotes: ["promotes Maillard reactions", "may slightly degrade some volatile compounds"]
    },
    'heavy-roast': {
        description: 'Intense roasting creating deep, dark flavors like dark caramel, chocolate, or burnt sugar.',
        category: 'roast',
        flavorImpact: ["adds dark caramel/chocolate/burnt sugar notes", "significantly reduces original fresh/floral notes", "mellows tannins"],
        mouthFeel: "much fuller", // Renamed
        energeticTendency: "very warming",
        compoundEffectModifier: "very smooth, blunts peak", // Renamed
        compoundImpactNotes: ["significant Maillard/caramelization", "may degrade catechins/vitamins"]
    },
    'charcoal-roasted': {
        description: 'Traditional roasting over charcoal, often imparting a unique mineral note and deep complexity.',
        category: 'roast',
        flavorImpact: ["adds deep nutty/caramel notes", "adds subtle mineral/smoky hint", "creates complexity"],
        mouthFeel: "fuller", // Renamed
        energeticTendency: "very warming",
        compoundEffectModifier: "very smooth, complex energy", // Renamed
        compoundImpactNotes: ["similar to heavy roast", "may add trace elements"]
    },
    'post-processing-roasted': {
        description: 'Secondary roasting after initial processing/aging to refine flavor or remove moisture.',
        category: 'roast/post-processing',
        flavorImpact: ["refreshes aroma", "adds warmth", "can mellow aged notes"],
        mouthFeel: "slightly fuller", // Renamed
        energeticTendency: "warming",
        compoundEffectModifier: "smooths", // Renamed
        compoundImpactNotes: ["further Maillard reactions"]
    },

    // --- Oxidation & Withering ---
    'withered': {
        description: 'Initial moisture reduction, allowing enzymes to begin working, developing precursors for aroma and flavor.',
        category: 'pre-processing',
        flavorImpact: ["develops floral precursors", "reduces grassy notes slightly"],
        mouthFeel: "unchanged", // Renamed
        energeticTendency: "neutral",
        compoundEffectModifier: "neutral", // Renamed
        compoundImpactNotes: ["starts enzymatic activity", "reduces water content"]
    },
    'sun-dried': {
        description: 'Drying using sunlight, often gentler than machine drying, can add subtle fruity/honey notes.',
        category: 'drying/withering',
        flavorImpact: ["adds subtle honey/fruity notes", "preserves delicate aromas"],
        mouthFeel: "lighter", // Renamed
        energeticTendency: "neutral-warming",
        compoundEffectModifier: "neutral", // Renamed
        compoundImpactNotes: ["UV exposure can alter some compounds"]
    },
     'oxidised': {
        description: 'General term indicating enzymatic browning occurred, developing darker colors and different flavor compounds.',
        category: 'oxidation',
        flavorImpact: ["reduces vegetal notes", "develops fruity/malty/floral notes (depending on level)"],
        mouthFeel: "fuller", // Renamed
        energeticTendency: "warming",
        compoundEffectModifier: "smooths (compared to green)", // Renamed
        compoundImpactNotes: ["converts catechins to theaflavins/thearubigins"]
    },
    'partial-oxidation': {
        description: 'Oxidation halted part-way (10-80%), creating a wide range of flavors between green and black teas.',
        category: 'oxidation',
        flavorImpact: ["develops diverse floral/fruity/roasted notes", "reduces vegetal notes"],
        mouthFeel: "variable (lighter to fuller)", // Renamed
        energeticTendency: "neutral-warming",
        compoundEffectModifier: "balanced/smooth", // Renamed & depends on level
        compoundImpactNotes: ["partial catechin conversion"]
    },
    'full-oxidation': {
        description: 'Complete enzymatic oxidation, developing robust, often malty or fruity flavors and dark color.',
        category: 'oxidation',
        flavorImpact: ["develops malty/fruity/spicy notes", "eliminates vegetal notes"],
        mouthFeel: "fuller/robust", // Renamed
        energeticTendency: "warming",
        compoundEffectModifier: "strong but potentially less sharp than pure caffeine", // Renamed
        compoundImpactNotes: ["maximizes theaflavins/thearubigins"]
    },


    // --- Growing & Special Processing ---
    'shade-grown': {
        description: 'Tea plants covered before harvest, reducing photosynthesis and increasing chlorophyll and amino acids (like L-theanine).',
        category: 'growing',
        flavorImpact: ["enhances umami", "increases sweetness", "reduces bitterness/astringency", "adds 'marine' notes"],
        mouthFeel: "smoother, sometimes thicker", // Renamed
        energeticTendency: "neutral-cooling",
        compoundEffectModifier: "enhanced focus, calming influence", // Renamed
        compoundImpactNotes: ["increases L-theanine", "increases chlorophyll", "reduces catechins slightly"]
    },
    'minimal-processing': {
        description: 'Processing limited mainly to withering and drying, preserving natural state.',
        category: 'general',
        flavorImpact: ["preserves delicate/subtle notes", "often adds hay/dried fruit notes"],
        mouthFeel: "lighter, delicate", // Renamed
        energeticTendency: "cooling",
        compoundEffectModifier: "gentle", // Renamed
        compoundImpactNotes: ["preserves high levels of antioxidants", "minimal enzymatic change"]
    },
    'gaba-processed': {
        description: 'Processed in a nitrogen-rich, oxygen-deprived environment to increase Gamma-aminobutyric acid (GABA).',
        category: 'special',
        flavorImpact: ["adds unique tangy/fruity notes", "can have slight savory quality"],
        mouthFeel: "smooth", // Renamed
        energeticTendency: "neutral",
        compoundEffectModifier: "calming influence, reduces sharp peak", // Renamed
        compoundImpactNotes: ["significantly increases GABA", "increases alanine"]
    },

    // --- Post-Processing & Aging ---
    'aged': {
        description: 'Stored over time (months to years), allowing slow chemical changes that mellow harsh notes and develop complexity.',
        category: 'aging',
        flavorImpact: ["mellows astringency/bitterness", "develops complexity", "adds earthy/woody/fruity notes (depending on tea)"],
        mouthFeel: "smoother, often thicker", // Renamed
        energeticTendency: "neutral-warming",
        compoundEffectModifier: "smooth, sustained", // Renamed
        compoundImpactNotes: ["slow oxidation/fermentation continues", "volatile compounds change"]
    },
    'compressed': {
        description: 'Tea leaves steamed and pressed into shapes (cakes, bricks) for aging and storage.',
        category: 'shaping/aging',
        flavorImpact: ["facilitates slower, different aging profile vs loose leaf"],
        mouthFeel: "may increase perceived thickness over time", // Renamed
        energeticTendency: "neutral",
        compoundEffectModifier: "neutral", // Renamed
        compoundImpactNotes: ["affects microbial activity during aging"]
    },
    'fermented': {
        description: 'Involves microbial activity (natural or accelerated) after halting initial oxidation ("kill-green"). Creates earthy, smooth, dark teas.',
        category: 'fermentation',
        flavorImpact: ["adds strong earthy/woody/mossy notes", "eliminates bitterness/astringency", "adds unique sweetness (hui gan)"],
        mouthFeel: "smooth, thick", // Renamed
        energeticTendency: "warming",
        compoundEffectModifier: "smooth, grounding energy", // Renamed & Describes effect profile change
        compoundImpactNotes: ["microbial transformation of compounds", "produces statins (in some)", "reduces caffeine bioavailability?"]
    },

    // --- Scented ---
    'jasmine-scented': {
        description: 'Tea leaves (usually green or white) are layered with fresh jasmine blossoms to absorb the aroma.',
        category: 'scenting',
        flavorImpact: ["adds strong floral jasmine aroma/flavor"],
        mouthFeel: "unchanged (depends on base tea)", // Renamed
        energeticTendency: "cooling",
        compoundEffectModifier: "calming influence", // Renamed & Aroma therapy aspect
        compoundImpactNotes: ["adds volatile aroma compounds from jasmine"]
    },
    // Add 'osmanthus-scented', 'rose-scented' similarly if needed...

    // --- Modern/Industrial ---
    'CTC': {
        description: 'Industrial method involving machines that crush, tear, and curl leaves for fast, strong infusion.',
        category: 'shaping/oxidation',
        flavorImpact: ["creates strong, bold, often one-dimensional flavor", "high astringency"],
        mouthFeel: "strong, robust, astringent", // Renamed & specified
        energeticTendency: "warming",
        compoundEffectModifier: "sharp peak, fast acting", // Renamed
        compoundImpactNotes: ["maximizes surface area for quick extraction", "can damage leaf structure"]
    }
    // Add 'modern-steaming' if distinct from traditional...
};

export default processingInfluences;