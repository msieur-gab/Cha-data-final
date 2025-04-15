/**
 * Tea Flavor Wheel Data Structure
 * Based on the provided flavor wheel visualization
 */

const flavorWheelData = {
  // Main structure for the flavor wheel
  wheel: {
    name: "Tea Flavors",
    children: [
      {
        name: "Floral",
        color: "#f7a8c2", // Pink
        children: [
          {
            name: "Delicate Floral",
            color: "#ffc0d6", // Lighter pink
            children: [
              { name: "Chrysanthemum", id: "chrysanthemum" },
              { name: "Honeysuckle", id: "honeysuckle" },
              { name: "Peony", id: "peony" }
            ]
          },
          {
            name: "Aromatic Floral",
            color: "#f7a8c2", // Same as parent
            children: [
              { name: "Jasmine", id: "jasmine" },
              { name: "Rose", id: "rose" },
              { name: "Osmanthus", id: "osmanthus" }
            ]
          },
          {
            name: "Pronounced Floral",
            color: "#e580a2", // Deeper pink
            children: [
              { name: "Gardenia", id: "gardenia" },
              { name: "Geranium", id: "geranium" },
              { name: "Orchid", id: "orchid" }
            ]
          }
        ]
      },
      {
        name: "Milky",
        color: "#f2d6b3", // Light beige
        children: [
          {
            name: "Creamy",
            color: "#f2d6b3", // Same as parent
            children: [
              { name: "Creamy", id: "creamy" },
              { name: "Milk", id: "milk" },
              { name: "Condensed Milk", id: "condensed_milk" }
            ]
          },
          {
            name: "Buttery",
            color: "#e6c9a1", // Slightly darker beige
            children: [
              { name: "Fresh Butter", id: "fresh_butter" },
              { name: "Brown Butter", id: "brown_butter" },
              { name: "Ghee", id: "ghee" }
            ]
          }
        ]
      },
      {
        name: "Nutty",
        color: "#d8ba9a", // Tan
        children: [
          {
            name: "Mild Nutty",
            color: "#e5cbb2", // Lighter tan
            children: [
              { name: "Almond", id: "almond" },
              { name: "Pine Nut", id: "pine_nut" },
              { name: "Walnut", id: "walnut" }
            ]
          },
          {
            name: "Robust Nutty",
            color: "#c9a982", // Darker tan
            children: [
              { name: "Chestnut", id: "chestnut" },
              { name: "Peanut", id: "peanut" },
              { name: "Roasted Nuts", id: "roasted_nuts" }
            ]
          }
        ]
      },
      {
        name: "Sweet",
        color: "#e86342", // Red-orange
        children: [
          {
            name: "Caramelized",
            color: "#e86342", // Same as parent
            children: [
              { name: "Brown Sugar", id: "brown_sugar" },
              { name: "Caramel", id: "caramel" },
              { name: "Toffee", id: "toffee" }
            ]
          },
          {
            name: "Honey Sweet",
            color: "#f08c6e", // Lighter red-orange
            children: [
              { name: "Honey/Beeswax", id: "honey" },
              { name: "Syrup", id: "syrup" },
              { name: "Malt", id: "malt" }
            ]
          },
          {
            name: "Vanilla",
            color: "#f2b49d", // Pale red-orange
            children: [
              { name: "Vanilla", id: "vanilla" },
              { name: "Cream", id: "cream" },
              { name: "Custard", id: "custard" }
            ]
          }
        ]
      },
      {
        name: "Spicy",
        color: "#ad3c28", // Dark red
        children: [
          {
            name: "Warming Spice",
            color: "#ad3c28", // Same as parent
            children: [
              { name: "Cinnamon", id: "cinnamon" },
              { name: "Nutmeg", id: "nutmeg" },
              { name: "Clove", id: "clove" },
              { name: "Star Anise", id: "star_anise" }
            ]
          },
          {
            name: "Pungent Spice",
            color: "#c44536", // Brighter red
            children: [
              { name: "Ginger", id: "ginger" },
              { name: "Pepper", id: "pepper" },
              { name: "Anise", id: "anise" },
              { name: "Licorice", id: "licorice" }
            ]
          }
        ]
      },
      {
        name: "Fire/Animal",
        color: "#962922", // Dark red
        children: [
          {
            name: "Fire",
            color: "#962922", // Same as parent
            children: [
              { name: "Tobacco", id: "tobacco" },
              { name: "Smoke", id: "smoke" },
              { name: "Toast", id: "toast" },
              { name: "Ash", id: "ash" }
            ]
          },
          {
            name: "Animal",
            color: "#7d2018", // Deeper red
            children: [
              { name: "Leather", id: "leather" },
              { name: "Stable", id: "stable" },
              { name: "Musk", id: "musk" }
            ]
          }
        ]
      },
      {
        name: "Fruit",
        color: "#9ec43e", // Light green/yellow
        children: [
          {
            name: "Berry",
            color: "#b8d35b", // Lighter green-yellow
            children: [
              { name: "Blackcurrant", id: "blackcurrant" },
              { name: "Blueberry", id: "blueberry" },
              { name: "Raspberry", id: "raspberry" },
              { name: "Strawberry", id: "strawberry" }
            ]
          },
          {
            name: "Citrus",
            color: "#d2e27c", // Even lighter green-yellow
            children: [
              { name: "Bergamot", id: "bergamot" },
              { name: "Lemon", id: "lemon" },
              { name: "Lime", id: "lime" },
              { name: "Mandarin", id: "mandarin" },
              { name: "Orange", id: "orange" }
            ]
          },
          {
            name: "Vine",
            color: "#8aad37", // Darker green-yellow
            children: [
              { name: "Grape", id: "grape" },
              { name: "Muscatel", id: "muscatel" },
              { name: "Wine-like", id: "wine_like" }
            ]
          },
          {
            name: "Stone",
            color: "#c1d76c", // Medium-light green-yellow
            children: [
              { name: "Apricot", id: "apricot" },
              { name: "Peach", id: "peach" },
              { name: "Pear", id: "pear" },
              { name: "Plum", id: "plum" }
            ]
          },
          {
            name: "Tropical",
            color: "#7ba32f", // Darker green-yellow
            children: [
              { name: "Apple", id: "apple" },
              { name: "Banana", id: "banana" },
              { name: "Mango", id: "mango" },
              { name: "Melon", id: "melon" },
              { name: "Pineapple", id: "pineapple" }
            ]
          },
          {
            name: "Dried Fruit",
            color: "#6a8c29", // Darkest green-yellow
            children: [
              { name: "Date", id: "date" },
              { name: "Dried Apricot", id: "dried_apricot" },
              { name: "Fig", id: "fig" },
              { name: "Raisin", id: "raisin" }
            ]
          }
        ]
      },
      {
        name: "Vegetal",
        color: "#5b9c64", // Green
        children: [
          {
            name: "Herbs",
            color: "#5b9c64", // Green (same as parent)
            children: [
              { name: "Basil", id: "basil" },
              { name: "Fennel", id: "fennel" },
              { name: "Lavender", id: "lavender" },
              { name: "Mint", id: "mint" },
              { name: "Parsley", id: "parsley" },
              { name: "Rosemary", id: "rosemary" },
              { name: "Sage", id: "sage" },
              { name: "Thyme", id: "thyme" }
            ]
          },
          {
            name: "Vegetables",
            color: "#46a26c", // Deeper green
            children: [
              { name: "Artichoke", id: "artichoke" },
              { name: "Asparagus", id: "asparagus" },
              { name: "Beans", id: "beans" },
              { name: "Bean Sprouts", id: "bean_sprouts" },
              { name: "Green Peas", id: "green_peas" },
              { name: "Spinach", id: "spinach" }
            ]
          },
          {
            name: "Grass",
            color: "#98cb4a", // Bright green
            children: [
              { name: "Alfalfa", id: "alfalfa" },
              { name: "Bamboo", id: "bamboo" },
              { name: "Cut Grass", id: "cut_grass" },
              { name: "Fresh Hay", id: "fresh_hay" },
              { name: "Fresh Straw", id: "fresh_straw" },
              { name: "Wet Straw", id: "wet_straw" }
            ]
          }
        ]
      },
      {
        name: "Earth",
        color: "#714a2f", // Dark brown
        children: [
          {
            name: "Mineral",
            color: "#714a2f", // Same as parent
            children: [
              { name: "Chalk", id: "chalk" },
              { name: "Granite", id: "granite" },
              { name: "Volcanic", id: "volcanic" },
              { name: "Wet Stone", id: "wet_stone" }
            ]
          },
          {
            name: "Metallic",
            color: "#8c6e5a", // Lighter brown with gray undertone
            children: [
              { name: "Metal", id: "metal" },
              { name: "Sulphur", id: "sulphur" },
              { name: "Iron", id: "iron" }
            ]
          },
          {
            name: "Wood",
            color: "#966939", // Brown
            children: [
              { name: "Cedar", id: "cedar" },
              { name: "Mahogany", id: "mahogany" },
              { name: "Oak", id: "oak" },
              { name: "Pine", id: "pine" },
              { name: "Pine Wood", id: "pine_wood" },
              { name: "Sawdust", id: "sawdust" },
              { name: "Decaying Bark", id: "decaying_bark" }
            ]
          },
          {
            name: "Forest",
            color: "#805c3e", // Darker brown
            children: [
              { name: "Forest Floor", id: "forest_floor" },
              { name: "Wet Leaves", id: "wet_leaves" },
              { name: "Moss", id: "moss" },
              { name: "Compost", id: "compost" },
              { name: "Humus", id: "humus" },
              { name: "Musty", id: "musty" }
            ]
          }
        ]
      },
      {
        name: "Marine",
        color: "#3b83bd", // Blue
        children: [
          {
            name: "Oceanic",
            color: "#5e99cc", // Lighter blue
            children: [
              { name: "Ocean Air", id: "ocean_air" },
              { name: "Seasalt", id: "seasalt" },
              { name: "Sea Breeze", id: "sea_breeze" },
              { name: "Coastal Air", id: "coastal_air" }
            ]
          },
          {
            name: "Marine Life",
            color: "#2d6da3", // Deeper blue
            children: [
              { name: "Oyster/Shrimps", id: "oyster_shrimps" },
              { name: "Seaweed/Fish", id: "seaweed_fish" },
              { name: "Kombu", id: "kombu" },
              { name: "Nori", id: "nori" }
            ]
          }
        ]
      },
      {
        name: "Mouthfeel",
        color: "#a67c52", // Medium brown
        children: [
          {
            name: "Astringency",
            color: "#bf8040", // Reddish brown
            children: [
              { name: "Drying", id: "drying" },
              { name: "Tannic", id: "tannic" },
              { name: "Puckering", id: "puckering" },
              { name: "Brisk", id: "brisk" }
            ]
          },
          {
            name: "Texture",
            color: "#d9b38c", // Light tan
            children: [
              { name: "Silky", id: "silky" },
              { name: "Thick", id: "thick" },
              { name: "Velvety", id: "velvety" },
              { name: "Smooth", id: "smooth" }
            ]
          }
        ]
      }
    ]
  },
  
  // Restructured flavor profiles with detailed information
  flavorProfiles: {
    floral: {
      delicate_floral: {
        flavors: ['Chrysanthemum', 'Honeysuckle', 'Peony'],
        intensity: 'Delicate',
        effects: 'Light, subtle, elegant aroma'
      },
      aromatic_floral: {
        flavors: ['Jasmine', 'Rose', 'Osmanthus'],
        intensity: 'Aromatic',
        effects: 'Fragrant, sweet, perfumed'
      },
      pronounced_floral: {
        flavors: ['Gardenia', 'Geranium'],
        intensity: 'Pronounced',
        effects: 'Bold, heady, complex aroma'
      }
    },
    milky: {
      creamy: {
        flavors: ['Creamy', 'Milk', 'Condensed milk'],
        intensity: 'Smooth',
        effects: 'Rich, smooth, coating mouthfeel'
      },
      buttery: {
        flavors: ['Fresh Butter', 'Brown butter'],
        intensity: 'Rich',
        effects: 'Luxurious, substantial, indulgent'
      }
    },
    nutty: {
      mild_nutty: {
        flavors: ['Almond', 'Pine Nut', 'Walnut'],
        intensity: 'Medium',
        effects: 'Warm, comforting, savory-sweet'
      },
      robust_nutty: {
        flavors: ['Chestnut', 'Peanut', 'Roasted Nuts'],
        intensity: 'Strong',
        effects: 'Bold, earthy, satisfying'
      }
    },
    sweet: {
      caramelized: {
        flavors: ['Brown Sugar', 'Caramel', 'Toffee'],
        intensity: 'Rich',
        effects: 'Decadent, warming, indulgent'
      },
      honey_sweet: {
        flavors: ['Honey/Beeswax', 'Syrup', 'Malt'],
        intensity: 'Medium',
        effects: 'Natural sweetness, smooth finish'
      },
      vanilla: {
        flavors: ['Vanilla', 'Cream', 'Custard'],
        intensity: 'Smooth',
        effects: 'Comforting, mellow, round'
      }
    },
    spicy: {
      warming_spice: {
        flavors: ['Cinnamon', 'Nutmeg', 'Clove', 'Star Anise'],
        intensity: 'Warming',
        effects: 'Comforting, aromatic, complex'
      },
      pungent_spice: {
        flavors: ['Ginger', 'Pepper', 'Anise', 'Licorice'],
        intensity: 'Sharp',
        effects: 'Stimulating, distinctive, assertive'
      }
    },
    fire_animal: {
      toasted: {
        flavors: ['Toast', 'Biscuit', 'Charred wood'],
        intensity: 'Medium',
        effects: 'Comforting, homey, depth'
      },
      leather_smoke: {
        flavors: ['Leather', 'Smoke', 'Cured meat'],
        intensity: 'Strong',
        effects: 'Deep, distinctive, complex'
      }
    },
    fruit: {
      berry: {
        flavors: ['Blackcurrant', 'Blueberry', 'Raspberry', 'Strawberry'],
        intensity: 'Bright',
        effects: 'Juicy, vibrant, sweet-tart'
      },
      citrus: {
        flavors: ['Bergamot', 'Lemon', 'Lime', 'Mandarin', 'Orange'],
        intensity: 'Zesty',
        effects: 'Refreshing, tangy, uplifting'
      },
      vine: {
        flavors: ['Grape', 'Muscatel'],
        intensity: 'Complex',
        effects: 'Wine-like, refined, distinctive'
      },
      stone: {
        flavors: ['Apricot', 'Peach', 'Pear'],
        intensity: 'Sweet',
        effects: 'Juicy, rounded, mellow'
      },
      tropical: {
        flavors: ['Apple', 'Banana', 'Mango', 'Melon', 'Pineapple'],
        intensity: 'Exotic',
        effects: 'Sweet, luscious, refreshing'
      }
    },
    vegetal: {
      herbs: {
        aromatic_herbs: {
          flavors: ['Basil', 'Lavender', 'Rosemary', 'Thyme'],
          intensity: 'Aromatic',
          effects: 'Fragrant, complex, refreshing'
        },
        culinary_herbs: {
          flavors: ['Fennel', 'Mint', 'Parsley', 'Sage'],
          intensity: 'Fresh',
          effects: 'Clean, invigorating, stimulating'
        }
      },
      vegetables: {
        leafy_vegetables: {
          flavors: ['Spinach', 'Bean Sprouts', 'Green Peas'],
          intensity: 'Green',
          effects: 'Fresh, light, clean'
        },
        robust_vegetables: {
          flavors: ['Artichoke', 'Asparagus', 'Beans'],
          intensity: 'Vegetal',
          effects: 'Substantial, green, nourishing'
        }
      },
      grass: {
        fresh_grass: {
          flavors: ['Cut Grass', 'Fresh Hay', 'Fresh Straw'],
          intensity: 'Green',
          effects: 'Vibrant, spring-like, uplifting'
        },
        mature_grass: {
          flavors: ['Alfalfa', 'Bamboo', 'Wet Straw'],
          intensity: 'Complex',
          effects: 'Deeper, earthy, developed'
        }
      }
    },
    earth: {
      mineral: {
        flavors: ['Chalk', 'Granite', 'Volcanic'],
        intensity: 'Subtle',
        effects: 'Clean, refined, distinctive'
      },
      metallic: {
        flavors: ['Metal', 'Sulphur'],
        intensity: 'Strong',
        effects: 'Sharp, distinctive, polarizing'
      },
      wood: {
        fresh_wood: {
          flavors: ['Pine', 'Pine Wood', 'Sawdust'],
          intensity: 'Resinous',
          effects: 'Clean, fragrant, natural'
        },
        aged_wood: {
          flavors: ['Cedar', 'Mahogany', 'Oak'],
          intensity: 'Rich',
          effects: 'Deep, complex, satisfying'
        },
        decaying_wood: {
          flavors: ['Decaying Bark', 'Wet bark'],
          intensity: 'Musty',
          effects: 'Damp, earthy, evolving'
        }
      },
      forest: {
        forest_floor: {
          flavors: ['Forest Floor', 'Wet Leaves', 'Moss'],
          intensity: 'Complex',
          effects: 'Rich, seasonal, multi-layered'
        },
        compost: {
          flavors: ['Compost', 'Humus', 'Musty'],
          intensity: 'Deep',
          effects: 'Earthy, grounding, aged'
        }
      }
    },
    mineral: {
      marine_mineral: {
        flavors: ['Ocean Air', 'Seasalt'],
        intensity: 'Fresh',
        effects: 'Briny, clean, revitalizing'
      },
      marine_life: {
        flavors: ['Oyster/Shrimps', 'Seaweed/Fish'],
        intensity: 'Distinctive',
        effects: 'Briny, umami, complex'
      }
    },
    marine: {
      oceanic: {
        flavors: ['Sea breeze', 'Tide pools', 'Coastal air'],
        intensity: 'Refreshing',
        effects: 'Clean, invigorating, salty'
      }
    }
  },
  
  // Mapping specific flavors to compatible tea types
  // This allows us to suggest flavors based on tea type
  teaTypeToFlavors: {
    white: [
      "chrysanthemum", "gardenia", "honeysuckle", "jasmine", "peony", 
      "creamy", "fresh_butter", 
      "honey", 
      "cut_grass", "fresh_hay", "bamboo", 
      "apricot", "peach", "pear"
    ],
    green: [
      "artichoke", "asparagus", "beans", "spinach", "green_peas",
      "cut_grass", "alfalfa", "fresh_hay", 
      "mint", "sage", "thyme",
      "bamboo", "pine",
      "seaweed_fish", "ocean_air",
      "jasmine", "lavender"
    ],
    yellow: [
      "honey", "brown_sugar",
      "chestnut", "pine_nut",
      "cut_grass", "bamboo",
      "chrysanthemum"
    ],
    oolong: [
      "osmanthus", "gardenia", "honeysuckle", "orchid",
      "creamy", "fresh_butter",
      "roasted_nuts", "almond", "chestnut",
      "honey", "caramel", "brown_sugar",
      "peach", "apricot", "pear",
      "bamboo", "pine_wood"
    ],
    black: [
      "caramel", "honey", "malt", "brown_sugar", "toffee",
      "cinnamon", "nutmeg", "clove",
      "raspberry", "strawberry", "blackcurrant",
      "orange", "bergamot", "lemon",
      "forest_floor", "wet_leaves",
      "toast"
    ],
    pu_er: [
      "forest_floor", "compost", "humus", "moss", "wet_leaves",
      "cedar", "mahogany", "oak", "pine_wood", "decaying_bark",
      "leather", "smoke",
      "caramel", "brown_sugar"
    ]
  },
  
  // Mapping flavors to their intensity levels
  flavorIntensity: {
    "chrysanthemum": "Delicate",
    "gardenia": "Pronounced",
    "geranium": "Medium",
    "honeysuckle": "Delicate",
    "jasmine": "Aromatic",
    "osmanthus": "Aromatic",
    "peony": "Delicate",
    "rose": "Aromatic",
    
    "creamy": "Smooth",
    "fresh_butter": "Rich",
    
    "almond": "Medium",
    "chestnut": "Medium",
    "peanut": "Strong",
    "pine_nut": "Subtle",
    "roasted_nuts": "Strong",
    "walnut": "Medium",
    
    "brown_sugar": "Rich",
    "caramel": "Rich",
    "honey": "Medium",
    "malt": "Medium",
    "syrup": "Rich",
    "toffee": "Rich",
    "vanilla": "Smooth",
    
    "anise": "Sharp",
    "cinnamon": "Warming",
    "clove": "Strong",
    "ginger": "Pungent",
    "licorice": "Distinctive",
    "nutmeg": "Warming",
    "pepper": "Sharp",
    "star_anise": "Distinctive",
    
    "leather": "Deep",
    "smoke": "Strong",
    "toast": "Medium",
    
    "blackcurrant": "Bright",
    "blueberry": "Medium",
    "raspberry": "Bright",
    "strawberry": "Sweet",
    
    "bergamot": "Distinctive",
    "lemon": "Bright",
    "lime": "Zesty",
    "mandarin": "Sweet",
    "orange": "Medium",
    
    "grape": "Sweet",
    "muscatel": "Complex",
    
    "apricot": "Juicy",
    "peach": "Sweet",
    "pear": "Mild",
    
    "apple": "Crisp",
    "banana": "Sweet",
    "mango": "Tropical",
    "melon": "Light",
    "pineapple": "Bright",
    
    "basil": "Aromatic",
    "fennel": "Sweet",
    "lavender": "Floral",
    "mint": "Refreshing",
    "parsley": "Fresh",
    "rosemary": "Piney",
    "sage": "Earthy",
    "thyme": "Subtle",
    
    "artichoke": "Vegetal",
    "asparagus": "Green",
    "beans": "Mild",
    "bean_sprouts": "Fresh",
    "green_peas": "Sweet",
    "spinach": "Green",
    
    "alfalfa": "Grassy",
    "bamboo": "Fresh",
    "cut_grass": "Green",
    "fresh_hay": "Sweet",
    "fresh_straw": "Light",
    "wet_straw": "Earthy",
    
    "cedar": "Woody",
    "decaying_bark": "Musty",
    "mahogany": "Rich",
    "oak": "Robust",
    "pine": "Resinous",
    "pine_wood": "Fragrant",
    "sawdust": "Dry",
    
    "compost": "Earthy",
    "forest_floor": "Complex",
    "humus": "Deep",
    "moss": "Damp",
    "musty": "Aged",
    "wet_leaves": "Autumn",
    
    "chalk": "Dry",
    "granite": "Mineral",
    "metal": "Strong",
    "sulphur": "Distinctive",
    "volcanic": "Strong",
    
    "ocean_air": "Fresh",
    "oyster_shrimps": "Briny",
    "seaweed_fish": "Umami",
    "seasalt": "Mineral"
  },
  
  // Mapping for complementary and contrasting flavors
  // This can be used for suggesting flavor combinations
  flavorRelationships: {
    // Example: compatible flavors that enhance each other
    complementary: {
      "jasmine": ["honey", "peach", "pear"],
      "honey": ["cinnamon", "lemon", "ginger"],
      "blackcurrant": ["vanilla", "caramel"],
      "bergamot": ["honey", "lemon", "orange"],
      "mint": ["lemon", "honey"],
      "cinnamon": ["apple", "honey", "brown_sugar"],
      "forest_floor": ["wet_leaves", "oak", "mushroom"]
    },
    
    // Example: contrasting flavors that create interesting combinations
    contrasting: {
      "jasmine": ["smoke", "leather", "roasted_nuts"],
      "mint": ["chocolate", "cinnamon", "brown_sugar"],
      "lemon": ["honey", "caramel", "vanilla"],
      "roasted_nuts": ["honey", "caramel"]
    }
  },
  
  // Flavor descriptions for detailed information
  flavorDescriptions: {
    // Floral
    "chrysanthemum": "Delicate, slightly sweet floral note with a hint of honey and a clean finish.",
    "gardenia": "Rich, heady floral aroma with creamy undertones and a sweet lingering finish.",
    "geranium": "Bright, slightly citrusy floral note with green undertones.",
    "honeysuckle": "Sweet, delicate floral note with a distinct honey-like character.",
    "jasmine": "Intensely aromatic floral note with sweet, intoxicating qualities.",
    "osmanthus": "Delicate apricot-like floral note with a sweet, fruity character.",
    "peony": "Soft, subtle floral note with a fresh, slightly sweet character.",
    "rose": "Distinctive floral note with sweet, sometimes fruity undertones.",
    "orchid": "Complex floral note with a creamy, sometimes vanilla-like quality.",
    
    // Milky
    "creamy": "Smooth, rich mouthfeel with a gentle dairy-like sweetness.",
    "milk": "Soft, rounded dairy note with a gentle sweetness.",
    "condensed_milk": "Rich, concentrated dairy sweetness with caramelized notes.",
    "fresh_butter": "Rich, creamy note with a clean dairy character.",
    "brown_butter": "Nutty, toasty dairy note with caramelized qualities.",
    "ghee": "Rich, nutty clarified butter note with a deep complexity.",
    
    // Nutty
    "almond": "Mild, sweet nutty note with a clean finish.",
    "chestnut": "Sweet, earthy nut character with a starchy quality.",
    "peanut": "Distinctive roasted legume note with savory qualities.",
    "pine_nut": "Delicate, buttery nut note with a slight resinous quality.",
    "roasted_nuts": "Rich, complex mix of toasted nut flavors with caramelized notes.",
    "walnut": "Slightly bitter, earthy nut note with tannic qualities.",
    
    // Sweet
    "brown_sugar": "Warm, molasses-like sweetness with caramelized notes.",
    "caramel": "Rich, cooked sugar note with buttery, toasty qualities.",
    "honey": "Floral, distinctive sweetness that varies based on nectar source.",
    "malt": "Grainy sweetness with toasted, sometimes chocolate-like notes.",
    "syrup": "Concentrated, sometimes viscous sweetness with a clean finish.",
    "toffee": "Rich, buttery caramelized sugar note with depth and complexity.",
    "vanilla": "Sweet, aromatic spice note with creamy, sometimes woody qualities.",
    "cream": "Smooth, rich dairy note with a gentle sweetness.",
    "custard": "Rich, eggy sweetness with vanilla notes and a creamy texture.",
    
    // Spicy
    "anise": "Distinctive licorice-like spice note with sweet qualities.",
    "cinnamon": "Warm, sweet-spicy note with woody undertones.",
    "clove": "Intense, warming spice with numbing qualities and sweetness.",
    "ginger": "Pungent, warming spice with citrusy, sometimes peppery notes.",
    "licorice": "Sweet, distinctive root note with anise-like qualities.",
    "nutmeg": "Warm, aromatic spice with sweet and slightly woody notes.",
    "pepper": "Sharp, pungent spice that can range from fruity to hot.",
    "star_anise": "Distinctive licorice-like spice with complex, sweet qualities.",
    
    // Fire/Animal
    "ash": "Dry, sometimes bitter note reminiscent of burnt material.",
    "leather": "Rich, tannic note with animal-like qualities and depth.",
    "musk": "Deep, animal-like note with sweet, sometimes earthy qualities.",
    "smoke": "Aromatic note reminiscent of burning wood or leaves.",
    "stable": "Complex, earthy note with animal and hay-like qualities.",
    "tobacco": "Rich, sometimes sweet note with woody, earthy qualities.",
    "toast": "Warm, grain-like note with caramelized qualities.",
    
    // Fruit - Berry
    "blackcurrant": "Tart, distinctive berry note with deep, sometimes wine-like qualities.",
    "blueberry": "Sweet-tart berry note with sometimes floral undertones.",
    "raspberry": "Bright, tart-sweet berry note with distinctive aroma.",
    "strawberry": "Sweet, aromatic berry note with sometimes creamy qualities.",
    
    // Fruit - Citrus
    "bergamot": "Distinctive citrus note with floral, sometimes spicy qualities.",
    "lemon": "Bright, sour citrus note with zesty, sometimes sweet qualities.",
    "lime": "Sharp, green citrus note with distinctive zesty character.",
    "mandarin": "Sweet, gentle citrus note with floral undertones.",
    "orange": "Sweet-tart citrus note with distinctive aromatic qualities.",
    
    // Fruit - Vine
    "grape": "Sweet, sometimes tart fruit note with distinctive aroma.",
    "muscatel": "Complex, grape-like note with floral, honey-like qualities.",
    "wine_like": "Complex, fermented grape note with depth and sometimes tannic qualities.",
    
    // Fruit - Stone
    "apricot": "Sweet, slightly tart stone fruit note with distinctive aroma.",
    "peach": "Sweet, juicy stone fruit note with floral qualities.",
    "pear": "Delicate, sweet fruit note with sometimes floral undertones.",
    "plum": "Sweet-tart stone fruit note with deep, sometimes wine-like qualities.",
    
    // Fruit - Tropical
    "apple": "Crisp, sometimes tart fruit note with clean sweetness.",
    "banana": "Sweet, distinctive tropical fruit note with sometimes creamy qualities.",
    "mango": "Sweet, aromatic tropical fruit note with sometimes resinous qualities.",
    "melon": "Refreshing, sweet fruit note with clean, watery qualities.",
    "pineapple": "Sweet-tart tropical fruit note with distinctive aroma.",
    
    // Fruit - Dried
    "date": "Rich, concentrated sweetness with caramel-like qualities.",
    "dried_apricot": "Concentrated stone fruit sweetness with tangy notes.",
    "fig": "Rich, honey-like sweetness with seedy texture notes.",
    "raisin": "Deep, concentrated grape sweetness with sometimes wine-like qualities.",
    
    // Vegetal - Herbs
    "basil": "Aromatic herb note with sweet, sometimes peppery qualities.",
    "fennel": "Distinctive anise-like herb note with sweet qualities.",
    "lavender": "Aromatic floral-herb note with sometimes medicinal qualities.",
    "mint": "Cooling, distinctive herb note with sweet undertones.",
    "parsley": "Fresh, green herb note with clean qualities.",
    "rosemary": "Aromatic, piney herb note with resinous qualities.",
    "sage": "Earthy, slightly musty herb note with savory qualities.",
    "thyme": "Aromatic herb note with floral, sometimes medicinal qualities.",
    
    // Vegetal - Vegetables
    "artichoke": "Distinctive vegetal note with sometimes metallic qualities.",
    "asparagus": "Green, distinctive vegetal note with sometimes sulfurous qualities.",
    "beans": "Mild, starchy vegetal note with sometimes sweet qualities.",
    "bean_sprouts": "Fresh, crisp vegetal note with clean qualities.",
    "green_peas": "Sweet, green vegetal note with sometimes starchy qualities.",
    "spinach": "Green, sometimes mineral-rich vegetal note.",
    
    // Vegetal - Grass
    "alfalfa": "Sweet, green grassy note with sometimes bean-like qualities.",
    "bamboo": "Fresh, green note with sometimes sweet qualities.",
    "cut_grass": "Fresh, green note with distinctive aroma.",
    "fresh_hay": "Sweet, dried grass note with sometimes floral qualities.",
    "fresh_straw": "Dry, clean grassy note with sometimes sweet qualities.",
    "wet_straw": "Damp, sometimes fermented grassy note.",
    
    // Earth - Wood
    "cedar": "Aromatic wood note with sometimes pencil-like qualities.",
    "decaying_bark": "Damp, earthy wood note with fungal qualities.",
    "mahogany": "Rich, deep wood note with sometimes sweet qualities.",
    "oak": "Distinctive wood note with sometimes vanilla-like qualities.",
    "pine": "Resinous, aromatic wood note with fresh qualities.",
    "pine_wood": "Distinctive resinous wood note with fresh qualities.",
    "sawdust": "Dry, woody note with sometimes sweet qualities.",
    
    // Earth - Forest
    "compost": "Rich, earthy note with decomposing organic qualities.",
    "forest_floor": "Complex mix of earth, leaves, and fungal notes.",
    "humus": "Rich, earthy note with decomposed organic qualities.",
    "moss": "Damp, green earth note with sometimes sweet qualities.",
    "musty": "Earthy note with aged, sometimes damp qualities.",
    "wet_leaves": "Damp, earthy note with distinctive autumn qualities.",
    
    // Earth - Mineral
    "chalk": "Dry, dusty mineral note with sometimes bitter qualities.",
    "granite": "Clean, stony mineral note with sometimes metallic qualities.",
    "iron": "Distinctive metallic note with sometimes blood-like qualities.",
    "metal": "Sharp, distinctive note with sometimes bitter qualities.",
    "sulphur": "Distinctive mineral note with sometimes egg-like qualities.",
    "volcanic": "Complex mineral note with sometimes smoky qualities.",
    "wet_stone": "Clean, fresh mineral note with sometimes sweet qualities.",
    
    // Marine
    "coastal_air": "Fresh, saline note with clean qualities.",
    "kombu": "Rich, umami seaweed note with briny qualities.",
    "nori": "Distinctive seaweed note with sometimes sweet qualities.",
    "ocean_air": "Fresh, saline note with sometimes iodine-like qualities.",
    "oyster_shrimps": "Briny, distinctive seafood note with umami qualities.",
    "sea_breeze": "Fresh, saline note with clean qualities.",
    "seaweed_fish": "Complex marine note with umami, sometimes fishy qualities.",
    "seasalt": "Clean, mineral-rich saline note.",
    
    // Mouthfeel - Astringency
    "brisk": "Clean, refreshing quality that stimulates the palate.",
    "drying": "Sensation that removes moisture from the mouth.",
    "puckering": "Intense astringency that causes mouth to contract.",
    "tannic": "Complex astringency with grip and structure.",
    
    // Mouthfeel - Texture
    "silky": "Smooth, flowing texture with elegant qualities.",
    "smooth": "Even, unbroken texture without rough edges.",
    "thick": "Full-bodied, substantial texture with weight.",
    "velvety": "Rich, smooth texture with depth and substance."
  }
};

// Export the data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = flavorWheelData;
} 
