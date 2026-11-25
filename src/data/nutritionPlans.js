// Rural Healthcare Nutrition Guidelines & Indigenous Superfood Recommendations
// Formulated for Indian Anganwadi and POSHAN Abhiyaan contexts

export const RURAL_NUTRITION_PLANS = {
  SAM_RECOVERY: {
    category: "Severe Acute Malnutrition (SAM)",
    targetGroup: "Children with WHZ < -3 SD or MUAC < 11.5 cm or nutritional edema",
    calorieGoal: "150 - 220 kcal/kg/day",
    proteinGoal: "4 - 6 g/kg/day",
    feedingFrequency: "6 - 8 meals daily (small frequent feeds)",
    clinicalProtocol: "Direct referral to nearest Nutrition Rehabilitation Centre (NRC) or Malnutrition Treatment Centre (MTC).",
    indigenousRecipes: [
      {
        name: "Energy-Dense Amrutham Laddu (THR Poshan Mix)",
        ingredients: "Wheat flour (45g), roasted Bengal gram sattu (25g), groundnuts (20g), jaggery (30g), cow ghee (15g).",
        calories: "480 kcal per 100g",
        protein: "14.2 g",
        preparation: "Roast ingredients gently, grind to fine powder, bind with warm ghee and jaggery syrup into balls. Feed twice daily.",
        costCategory: "Very Low / Anganwadi Supplied"
      },
      {
        name: "Moringa & Moong Dal Khichdi with Ghee",
        ingredients: "Yellow moong dal (30g), parboiled rice (40g), washed drumstick leaves (moringa 20g), ghee (10ml), turmeric, cumin.",
        calories: "340 kcal per bowl",
        protein: "11.5 g",
        preparation: "Pressure cook moong dal, rice, and shredded moringa leaves till soft and mushy. Stir in warm ghee.",
        costCategory: "Locally accessible backyard produce"
      },
      {
        name: "Egg & Ragi (Finger Millet) Malt",
        ingredients: "Sprouted ragi flour (30g), 1 boiled egg yolk, whole milk/water (150ml), crushed jaggery (15g).",
        calories: "290 kcal",
        protein: "10.0 g",
        preparation: "Whisk ragi in cold water, cook on low flame till glossy. Mash cooked egg yolk smoothly into warm porridge.",
        costCategory: "Low cost"
      }
    ],
    dosAndDonts: {
      dos: [
        "Continue active breastfeeding on demand day and night.",
        "Always wash mother's hands with soap before preparing feeds and feeding the child.",
        "Ensure child drinks clean boiled and cooled water.",
        "Monitor child's temperature and urine output daily."
      ],
      donts: [
        "Do not force-feed if child is vomiting; give sips of ORS or express breastmilk.",
        "Do not feed diluted watery animal milk or market tea/biscuits.",
        "Do not discontinue complementary feeding during diarrhea or fever episodes."
      ]
    }
  },

  MAM_INTERVENTION: {
    category: "Moderate Acute Malnutrition (MAM)",
    targetGroup: "Children with WHZ between -2 and -3 SD or MUAC 11.5 - 12.5 cm",
    calorieGoal: "120 - 150 kcal/kg/day",
    proteinGoal: "3 - 4 g/kg/day",
    feedingFrequency: "4 - 5 meals daily + breastfeeding",
    clinicalProtocol: "Enrolled in Community-based Management of Acute Malnutrition (CMAM) & Poshan Tracker monitoring.",
    indigenousRecipes: [
      {
        name: "Roasted Chana Sattu Drink with Jaggery",
        ingredients: "Bengal gram sattu flour (35g), warm boiled water/curd (150ml), organic jaggery (15g), pinch of roasted cumin.",
        calories: "220 kcal",
        protein: "9.2 g",
        preparation: "Whisk roasted sattu with warm water and dissolved jaggery. Instant digestible protein source.",
        costCategory: "Extremely affordable"
      },
      {
        name: "Sweet Potato & Peanut Mash",
        ingredients: "Boiled orange/white sweet potato (1 medium), crushed roasted peanuts (20g), warm milk/curd (50ml).",
        calories: "260 kcal",
        protein: "6.8 g",
        preparation: "Peel and mash sweet potato smoothly. Stir in powdered roasted peanuts and warm milk to semi-solid consistency.",
        costCategory: "Village market staple"
      },
      {
        name: "Spinach, Tomato & Masoor Dal Puree",
        ingredients: "Red lentils (masoor 25g), local palak/chaulai spinach (20g), tomato (15g), mustard oil (5ml).",
        calories: "190 kcal",
        protein: "7.5 g",
        preparation: "Cook until creamy, mash with spoon. High bio-available iron and vitamin A to prevent nutritional anemia.",
        costCategory: "Kitchen garden produce"
      }
    ],
    dosAndDonts: {
      dos: [
        "Add one teaspoon of mustard oil or desi ghee to each meal to boost caloric density without extra bulk.",
        "Provide 1 seasonal local fruit daily (banana, papaya, guava, mango).",
        "Bring child for bi-weekly growth weighing at the Anganwadi center."
      ],
      donts: [
        "Avoid packaged commercial chips, cold drinks, or candies that blunt child's appetite.",
        "Do not skip the scheduled Anganwadi supplementary take-home ration (THR)."
      ]
    }
  },

  NORMAL_PREVENTATIVE: {
    category: "Healthy & Age-Appropriate Nutrition",
    targetGroup: "Children with normal WHO growth trajectory (WHZ >= -2, MUAC >= 12.5 cm)",
    calorieGoal: "Age-appropriate standard dietary intake (900 - 1300 kcal/day)",
    proteinGoal: "13 - 16 g/day",
    feedingFrequency: "3 family meals + 2 nutritious snacks",
    clinicalProtocol: "Routine monthly growth monitoring and full immunization tracking at VHSND.",
    indigenousRecipes: [
      {
        name: "Tricolor Vegetable Khichdi",
        ingredients: "Rice, mixed pulses (tuar & moong), carrots, green beans, pumpkin, cumin seasoning with ghee.",
        calories: "280 kcal",
        protein: "8.5 g",
        preparation: "Soft-cooked traditional wholesome one-pot meal incorporating dietary colors for micronutrients.",
        costCategory: "Standard household meal"
      },
      {
        name: "Curd, Flattened Rice (Poha) & Banana Porridge",
        ingredients: "Washed soft poha (40g), fresh homemade curd (60g), ripe mashed banana (1/2), crushed jaggery (10g).",
        calories: "240 kcal",
        protein: "5.5 g",
        preparation: "Mix and serve fresh without cooking. Excellent probiotic and gut-friendly breakfast.",
        costCategory: "Low cost"
      }
    ],
    dosAndDonts: {
      dos: [
        "Encourage self-feeding with clean hands to foster motor development.",
        "Ensure child drinks safe potable water from an approved tap or water filter.",
        "Administer biannual Vitamin A syrup doses and deworming (Albendazole) tablets."
      ],
      donts: [
        "Do not delay starting complementary foods past 6 months of age."
      ]
    }
  }
};

export const MICRONUTRIENT_DEFICIENCIES = [
  {
    nutrient: "Iron (Nutritional Anemia)",
    symptoms: "Pale inner eyelids, pale tongue and nailbeds, unusual tiredness, frequent irritability, pica (eating dirt/chalk).",
    remedy: "Weekly Iron-Folic Acid (IFA) syrup as per POSHAN protocol, sprouted grains, moringa leaves, jaggery, amla (Indian gooseberry)."
  },
  {
    nutrient: "Vitamin A Deficiency",
    symptoms: "Night blindness, dry conjunctiva (Bitot's spots), recurrent respiratory infections, delayed wound healing.",
    remedy: "Biannual high-dose Vitamin A oral syrup, yellow-orange fruits (papaya, ripe mango, pumpkin), dark green leafy greens."
  },
  {
    nutrient: "Zinc & Protein (Stunting)",
    symptoms: "Stagnant linear height gain, thinning hair, cracked skin or angular stomatitis, recurring episodes of diarrhea.",
    remedy: "Zinc supplementation during diarrhea episodes (14-day course), whole eggs, roasted chickpeas, dairy curd, pulses."
  }
];
