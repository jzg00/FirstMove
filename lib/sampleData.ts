import { SignalDataset } from '@/lib/types'

const logistics: SignalDataset = {
  id: 'logistics',
  name: 'Logistics exceptions',
  description: 'Delivery failures by region, carrier, and root cause — last 30 days',
  rows: [
    { region: 'Pacific Northwest', carrier: 'Veho', week: 'W17', failureRate: 0.14, prevWeekRate: 0.06, rootCause: 'Temperature excursion in transit', affectedBoxes: 3820, customerImpactScore: 8.4, dollarImpact: 91200, reshipRate: 0.71 },
    { region: 'Southeast', carrier: 'LaserShip', week: 'W17', failureRate: 0.09, prevWeekRate: 0.08, rootCause: 'Driver capacity shortfall', affectedBoxes: 6110, customerImpactScore: 6.1, dollarImpact: 73300, reshipRate: 0.55 },
    { region: 'Midwest', carrier: 'OnTrac', week: 'W17', failureRate: 0.11, prevWeekRate: 0.05, rootCause: 'Hub sorting delay (Chicago hub storm)', affectedBoxes: 4450, customerImpactScore: 7.2, dollarImpact: 53400, reshipRate: 0.62 },
    { region: 'Northeast', carrier: 'UPS', week: 'W17', failureRate: 0.04, prevWeekRate: 0.04, rootCause: 'Address errors (customer)', affectedBoxes: 1230, customerImpactScore: 3.1, dollarImpact: 14800, reshipRate: 0.40 },
    { region: 'Southwest', carrier: 'FedEx Home', week: 'W17', failureRate: 0.07, prevWeekRate: 0.07, rootCause: 'Access issues (gated communities)', affectedBoxes: 2900, customerImpactScore: 4.8, dollarImpact: 34800, reshipRate: 0.48 },
    { region: 'Mid-Atlantic', carrier: 'LaserShip', week: 'W17', failureRate: 0.06, prevWeekRate: 0.09, rootCause: 'Driver capacity shortfall', affectedBoxes: 1980, customerImpactScore: 4.2, dollarImpact: 23700, reshipRate: 0.51 },
    { region: 'Pacific Northwest', carrier: 'Veho', week: 'W16', failureRate: 0.06, prevWeekRate: 0.05, rootCause: 'Temperature excursion in transit', affectedBoxes: 1640, customerImpactScore: 5.0, dollarImpact: 39200, reshipRate: 0.68 },
    { region: 'Southeast', carrier: 'OnTrac', week: 'W17', failureRate: 0.05, prevWeekRate: 0.05, rootCause: 'Mis-sort at hub', affectedBoxes: 870, customerImpactScore: 3.8, dollarImpact: 10400, reshipRate: 0.44 },
    { region: 'Great Plains', carrier: 'UPS', week: 'W17', failureRate: 0.03, prevWeekRate: 0.03, rootCause: 'Weather delay (ice)', affectedBoxes: 590, customerImpactScore: 2.9, dollarImpact: 7100, reshipRate: 0.38 },
    { region: 'Texas', carrier: 'FedEx Home', week: 'W17', failureRate: 0.08, prevWeekRate: 0.04, rootCause: 'New depot go-live instability', affectedBoxes: 3200, customerImpactScore: 6.7, dollarImpact: 38400, reshipRate: 0.59 },
    { region: 'California', carrier: 'OnTrac', week: 'W17', failureRate: 0.04, prevWeekRate: 0.04, rootCause: 'Traffic / delivery window misses', affectedBoxes: 2100, customerImpactScore: 3.5, dollarImpact: 25200, reshipRate: 0.42 },
    { region: 'Florida', carrier: 'LaserShip', week: 'W17', failureRate: 0.06, prevWeekRate: 0.05, rootCause: 'Heat damage (no insulation upgrade yet)', affectedBoxes: 1760, customerImpactScore: 5.9, dollarImpact: 21100, reshipRate: 0.53 },
    { region: 'Mountain West', carrier: 'UPS', week: 'W17', failureRate: 0.03, prevWeekRate: 0.04, rootCause: 'Rural routing gaps', affectedBoxes: 430, customerImpactScore: 2.4, dollarImpact: 5200, reshipRate: 0.35 },
    { region: 'Midwest', carrier: 'FedEx Home', week: 'W16', failureRate: 0.05, prevWeekRate: 0.04, rootCause: 'Hub sorting delay', affectedBoxes: 1200, customerImpactScore: 4.1, dollarImpact: 14400, reshipRate: 0.49 },
    { region: 'Pacific Northwest', carrier: 'UPS', week: 'W17', failureRate: 0.03, prevWeekRate: 0.03, rootCause: 'Recipient not home', affectedBoxes: 710, customerImpactScore: 2.7, dollarImpact: 8500, reshipRate: 0.39 },
    { region: 'Northeast', carrier: 'LaserShip', week: 'W17', failureRate: 0.05, prevWeekRate: 0.04, rootCause: 'Building access (urban)', affectedBoxes: 1050, customerImpactScore: 3.6, dollarImpact: 12600, reshipRate: 0.45 },
    { region: 'Southeast', carrier: 'FedEx Home', week: 'W17', failureRate: 0.04, prevWeekRate: 0.05, rootCause: 'Weather delay', affectedBoxes: 800, customerImpactScore: 3.0, dollarImpact: 9600, reshipRate: 0.41 },
    { region: 'Texas', carrier: 'UPS', week: 'W16', failureRate: 0.04, prevWeekRate: 0.04, rootCause: 'Address errors (customer)', affectedBoxes: 650, customerImpactScore: 2.8, dollarImpact: 7800, reshipRate: 0.37 },
  ],
}

const suppliers: SignalDataset = {
  id: 'suppliers',
  name: 'Supplier performance',
  description: 'Lead time variance, quality reject rates, and cost trends by supplier — last 90 days',
  rows: [
    { supplier: 'Greenfield Proteins', ingredient: 'Chicken breast', avgLeadTimeDays: 4.2, targetLeadTimeDays: 3.0, leadTimeVariance: 1.2, qualityRejectRate: 0.031, prevQualityRejectRate: 0.011, costPerKg: 8.40, prevCostPerKg: 7.20, activeSkus: 14, weeklyVolumeKg: 28000, contractExpiry: '2025-09-30', escalationOpen: true },
    { supplier: 'Pacific Fresh Seafood', ingredient: 'Atlantic salmon', avgLeadTimeDays: 2.8, targetLeadTimeDays: 3.0, leadTimeVariance: -0.2, qualityRejectRate: 0.008, prevQualityRejectRate: 0.009, costPerKg: 22.10, prevCostPerKg: 19.80, activeSkus: 6, weeklyVolumeKg: 8400, contractExpiry: '2026-03-15', escalationOpen: false },
    { supplier: 'Rio Verde Produce', ingredient: 'Mixed peppers', avgLeadTimeDays: 5.1, targetLeadTimeDays: 4.0, leadTimeVariance: 1.1, qualityRejectRate: 0.019, prevQualityRejectRate: 0.018, costPerKg: 3.60, prevCostPerKg: 3.55, activeSkus: 22, weeklyVolumeKg: 41000, contractExpiry: '2025-12-01', escalationOpen: false },
    { supplier: 'Alpine Dairy Co.', ingredient: 'Heavy cream', avgLeadTimeDays: 2.1, targetLeadTimeDays: 2.0, leadTimeVariance: 0.1, qualityRejectRate: 0.004, prevQualityRejectRate: 0.005, costPerKg: 5.10, prevCostPerKg: 5.05, activeSkus: 9, weeklyVolumeKg: 12000, contractExpiry: '2026-06-30', escalationOpen: false },
    { supplier: 'Harvest Grain Partners', ingredient: 'Arborio rice', avgLeadTimeDays: 6.8, targetLeadTimeDays: 5.0, leadTimeVariance: 1.8, qualityRejectRate: 0.012, prevQualityRejectRate: 0.010, costPerKg: 2.90, prevCostPerKg: 2.75, activeSkus: 5, weeklyVolumeKg: 9500, contractExpiry: '2025-08-15', escalationOpen: false },
    { supplier: 'SunBloom Herbs', ingredient: 'Fresh basil', avgLeadTimeDays: 3.5, targetLeadTimeDays: 3.0, leadTimeVariance: 0.5, qualityRejectRate: 0.027, prevQualityRejectRate: 0.014, costPerKg: 18.20, prevCostPerKg: 16.90, activeSkus: 11, weeklyVolumeKg: 3200, contractExpiry: '2025-11-01', escalationOpen: true },
    { supplier: 'Golden Valley Oils', ingredient: 'Olive oil', avgLeadTimeDays: 4.0, targetLeadTimeDays: 4.0, leadTimeVariance: 0.0, qualityRejectRate: 0.006, prevQualityRejectRate: 0.007, costPerKg: 9.80, prevCostPerKg: 9.75, activeSkus: 18, weeklyVolumeKg: 7600, contractExpiry: '2026-01-15', escalationOpen: false },
    { supplier: 'Eastland Pork Co.', ingredient: 'Pork tenderloin', avgLeadTimeDays: 3.9, targetLeadTimeDays: 3.0, leadTimeVariance: 0.9, qualityRejectRate: 0.016, prevQualityRejectRate: 0.017, costPerKg: 11.30, prevCostPerKg: 10.10, activeSkus: 8, weeklyVolumeKg: 14500, contractExpiry: '2025-10-31', escalationOpen: false },
    { supplier: 'TerraFresh Roots', ingredient: 'Sweet potato', avgLeadTimeDays: 3.2, targetLeadTimeDays: 3.0, leadTimeVariance: 0.2, qualityRejectRate: 0.009, prevQualityRejectRate: 0.009, costPerKg: 1.85, prevCostPerKg: 1.82, activeSkus: 7, weeklyVolumeKg: 23000, contractExpiry: '2026-04-01', escalationOpen: false },
    { supplier: 'Greenfield Proteins', ingredient: 'Ground beef (80/20)', avgLeadTimeDays: 4.5, targetLeadTimeDays: 3.0, leadTimeVariance: 1.5, qualityRejectRate: 0.024, prevQualityRejectRate: 0.012, costPerKg: 9.70, prevCostPerKg: 8.80, activeSkus: 16, weeklyVolumeKg: 31000, contractExpiry: '2025-09-30', escalationOpen: true },
    { supplier: 'Pacific Fresh Seafood', ingredient: 'Shrimp (16/20)', avgLeadTimeDays: 3.1, targetLeadTimeDays: 3.0, leadTimeVariance: 0.1, qualityRejectRate: 0.011, prevQualityRejectRate: 0.012, costPerKg: 17.40, prevCostPerKg: 16.90, activeSkus: 5, weeklyVolumeKg: 5800, contractExpiry: '2026-03-15', escalationOpen: false },
    { supplier: 'Rio Verde Produce', ingredient: 'Roma tomatoes', avgLeadTimeDays: 4.8, targetLeadTimeDays: 4.0, leadTimeVariance: 0.8, qualityRejectRate: 0.022, prevQualityRejectRate: 0.021, costPerKg: 2.10, prevCostPerKg: 2.05, activeSkus: 19, weeklyVolumeKg: 38000, contractExpiry: '2025-12-01', escalationOpen: false },
    { supplier: 'Harvest Grain Partners', ingredient: 'Farro', avgLeadTimeDays: 7.2, targetLeadTimeDays: 5.0, leadTimeVariance: 2.2, qualityRejectRate: 0.014, prevQualityRejectRate: 0.011, costPerKg: 4.40, prevCostPerKg: 4.10, activeSkus: 4, weeklyVolumeKg: 4200, contractExpiry: '2025-08-15', escalationOpen: false },
    { supplier: 'Alpine Dairy Co.', ingredient: 'Parmesan', avgLeadTimeDays: 2.3, targetLeadTimeDays: 2.0, leadTimeVariance: 0.3, qualityRejectRate: 0.005, prevQualityRejectRate: 0.005, costPerKg: 28.50, prevCostPerKg: 27.90, activeSkus: 6, weeklyVolumeKg: 2900, contractExpiry: '2026-06-30', escalationOpen: false },
    { supplier: 'SunBloom Herbs', ingredient: 'Flat-leaf parsley', avgLeadTimeDays: 3.8, targetLeadTimeDays: 3.0, leadTimeVariance: 0.8, qualityRejectRate: 0.033, prevQualityRejectRate: 0.015, costPerKg: 14.60, prevCostPerKg: 13.20, activeSkus: 9, weeklyVolumeKg: 1800, contractExpiry: '2025-11-01', escalationOpen: true },
    { supplier: 'Eastland Pork Co.', ingredient: 'Bacon (sliced)', avgLeadTimeDays: 4.1, targetLeadTimeDays: 3.0, leadTimeVariance: 1.1, qualityRejectRate: 0.013, prevQualityRejectRate: 0.014, costPerKg: 12.80, prevCostPerKg: 11.40, activeSkus: 7, weeklyVolumeKg: 9800, contractExpiry: '2025-10-31', escalationOpen: false },
    { supplier: 'Golden Valley Oils', ingredient: 'Sesame oil', avgLeadTimeDays: 4.2, targetLeadTimeDays: 4.0, leadTimeVariance: 0.2, qualityRejectRate: 0.005, prevQualityRejectRate: 0.006, costPerKg: 16.30, prevCostPerKg: 16.20, activeSkus: 5, weeklyVolumeKg: 1500, contractExpiry: '2026-01-15', escalationOpen: false },
    { supplier: 'TerraFresh Roots', ingredient: 'Beets', avgLeadTimeDays: 3.4, targetLeadTimeDays: 3.0, leadTimeVariance: 0.4, qualityRejectRate: 0.010, prevQualityRejectRate: 0.010, costPerKg: 1.60, prevCostPerKg: 1.58, activeSkus: 3, weeklyVolumeKg: 6700, contractExpiry: '2026-04-01', escalationOpen: false },
  ],
}

const menu: SignalDataset = {
  id: 'menu',
  name: 'Menu & SKU performance',
  description: 'Recipe ratings, fulfillment difficulty, and cost trends — current active menu',
  rows: [
    { recipeId: 'HF-2841', recipeName: 'Smoky BBQ Chicken Flatbread', mealType: 'Family Friendly', avgRating: 3.6, prevAvgRating: 4.1, ratingTrend: -0.5, weeklyOrders: 18400, fulfillmentDifficulty: 'high', ingredientCostPerServing: 5.82, prevIngredientCost: 5.21, cancelledDueToStock: 0.08, weeksOnMenu: 6 },
    { recipeId: 'HF-3102', recipeName: 'Creamy Tuscan Salmon', mealType: 'Calorie Smart', avgRating: 4.7, prevAvgRating: 4.6, ratingTrend: 0.1, weeklyOrders: 11200, fulfillmentDifficulty: 'medium', ingredientCostPerServing: 8.10, prevIngredientCost: 7.40, cancelledDueToStock: 0.01, weeksOnMenu: 3 },
    { recipeId: 'HF-2994', recipeName: 'Korean BBQ Beef Bowls', mealType: 'Meat & Veggies', avgRating: 4.5, prevAvgRating: 4.5, ratingTrend: 0.0, weeklyOrders: 22100, fulfillmentDifficulty: 'low', ingredientCostPerServing: 6.40, prevIngredientCost: 6.35, cancelledDueToStock: 0.00, weeksOnMenu: 4 },
    { recipeId: 'HF-3018', recipeName: 'Mushroom & Farro Risotto', mealType: 'Veggie', avgRating: 3.9, prevAvgRating: 4.2, ratingTrend: -0.3, weeklyOrders: 7600, fulfillmentDifficulty: 'high', ingredientCostPerServing: 4.90, prevIngredientCost: 4.40, cancelledDueToStock: 0.05, weeksOnMenu: 8 },
    { recipeId: 'HF-3155', recipeName: 'Lemon Herb Chicken Piccata', mealType: 'Quick & Easy', avgRating: 4.4, prevAvgRating: 4.3, ratingTrend: 0.1, weeklyOrders: 15800, fulfillmentDifficulty: 'low', ingredientCostPerServing: 5.60, prevIngredientCost: 5.55, cancelledDueToStock: 0.00, weeksOnMenu: 2 },
    { recipeId: 'HF-2877', recipeName: 'Shrimp Tacos with Mango Slaw', mealType: 'Pescatarian', avgRating: 3.7, prevAvgRating: 4.0, ratingTrend: -0.3, weeklyOrders: 13500, fulfillmentDifficulty: 'medium', ingredientCostPerServing: 7.20, prevIngredientCost: 6.50, cancelledDueToStock: 0.03, weeksOnMenu: 5 },
    { recipeId: 'HF-3201', recipeName: 'One-Pan Pork Chops & Apples', mealType: 'Calorie Smart', avgRating: 4.3, prevAvgRating: 4.2, ratingTrend: 0.1, weeklyOrders: 9400, fulfillmentDifficulty: 'low', ingredientCostPerServing: 6.80, prevIngredientCost: 6.20, cancelledDueToStock: 0.01, weeksOnMenu: 3 },
    { recipeId: 'HF-2903', recipeName: 'Thai Basil Fried Rice', mealType: 'Veggie', avgRating: 4.6, prevAvgRating: 4.5, ratingTrend: 0.1, weeklyOrders: 12700, fulfillmentDifficulty: 'medium', ingredientCostPerServing: 3.95, prevIngredientCost: 3.90, cancelledDueToStock: 0.02, weeksOnMenu: 7 },
    { recipeId: 'HF-3089', recipeName: 'Poblano & Black Bean Enchiladas', mealType: 'Veggie', avgRating: 4.1, prevAvgRating: 4.0, ratingTrend: 0.1, weeklyOrders: 8200, fulfillmentDifficulty: 'medium', ingredientCostPerServing: 4.30, prevIngredientCost: 4.25, cancelledDueToStock: 0.01, weeksOnMenu: 4 },
    { recipeId: 'HF-2861', recipeName: 'Steak & Chimichurri with Roasted Veg', mealType: 'Gourmet Plus', avgRating: 4.8, prevAvgRating: 4.7, ratingTrend: 0.1, weeklyOrders: 9100, fulfillmentDifficulty: 'low', ingredientCostPerServing: 10.40, prevIngredientCost: 9.10, cancelledDueToStock: 0.00, weeksOnMenu: 5 },
    { recipeId: 'HF-3044', recipeName: 'Honey Garlic Salmon Packets', mealType: 'Calorie Smart', avgRating: 4.2, prevAvgRating: 4.3, ratingTrend: -0.1, weeklyOrders: 7800, fulfillmentDifficulty: 'low', ingredientCostPerServing: 8.90, prevIngredientCost: 7.90, cancelledDueToStock: 0.00, weeksOnMenu: 6 },
    { recipeId: 'HF-2918', recipeName: 'Cheesy Stuffed Peppers', mealType: 'Family Friendly', avgRating: 3.5, prevAvgRating: 3.8, ratingTrend: -0.3, weeklyOrders: 14200, fulfillmentDifficulty: 'high', ingredientCostPerServing: 5.10, prevIngredientCost: 4.80, cancelledDueToStock: 0.06, weeksOnMenu: 10 },
    { recipeId: 'HF-3178', recipeName: 'Miso Glazed Eggplant Bowl', mealType: 'Veggie', avgRating: 4.0, prevAvgRating: 3.8, ratingTrend: 0.2, weeklyOrders: 5900, fulfillmentDifficulty: 'medium', ingredientCostPerServing: 4.15, prevIngredientCost: 4.10, cancelledDueToStock: 0.01, weeksOnMenu: 2 },
    { recipeId: 'HF-2966', recipeName: 'Chicken Caesar Flatbread Pizza', mealType: 'Family Friendly', avgRating: 4.0, prevAvgRating: 4.4, ratingTrend: -0.4, weeklyOrders: 19600, fulfillmentDifficulty: 'high', ingredientCostPerServing: 5.50, prevIngredientCost: 4.95, cancelledDueToStock: 0.07, weeksOnMenu: 9 },
    { recipeId: 'HF-3130', recipeName: 'Butter Chicken with Basmati', mealType: 'Meat & Veggies', avgRating: 4.6, prevAvgRating: 4.5, ratingTrend: 0.1, weeklyOrders: 17300, fulfillmentDifficulty: 'low', ingredientCostPerServing: 6.10, prevIngredientCost: 5.95, cancelledDueToStock: 0.00, weeksOnMenu: 3 },
    { recipeId: 'HF-2839', recipeName: 'Classic Beef Bolognese', mealType: 'Meat & Veggies', avgRating: 4.3, prevAvgRating: 4.5, ratingTrend: -0.2, weeklyOrders: 21000, fulfillmentDifficulty: 'medium', ingredientCostPerServing: 6.90, prevIngredientCost: 6.10, cancelledDueToStock: 0.02, weeksOnMenu: 12 },
    { recipeId: 'HF-3062', recipeName: 'Beet & Goat Cheese Grain Bowl', mealType: 'Veggie', avgRating: 4.2, prevAvgRating: 4.1, ratingTrend: 0.1, weeklyOrders: 6400, fulfillmentDifficulty: 'low', ingredientCostPerServing: 5.30, prevIngredientCost: 5.25, cancelledDueToStock: 0.00, weeksOnMenu: 5 },
    { recipeId: 'HF-2985', recipeName: 'Pesto Gnocchi with Burst Tomatoes', mealType: 'Calorie Smart', avgRating: 3.8, prevAvgRating: 4.2, ratingTrend: -0.4, weeklyOrders: 8900, fulfillmentDifficulty: 'medium', ingredientCostPerServing: 4.60, prevIngredientCost: 4.30, cancelledDueToStock: 0.04, weeksOnMenu: 7 },
    { recipeId: 'HF-3220', recipeName: 'Spicy Sausage & Kale Pasta', mealType: 'Quick & Easy', avgRating: 4.4, prevAvgRating: 4.3, ratingTrend: 0.1, weeklyOrders: 13100, fulfillmentDifficulty: 'low', ingredientCostPerServing: 5.75, prevIngredientCost: 5.70, cancelledDueToStock: 0.00, weeksOnMenu: 2 },
    { recipeId: 'HF-2952', recipeName: 'Fish Tacos with Avocado Crema', mealType: 'Calorie Smart', avgRating: 4.5, prevAvgRating: 4.4, ratingTrend: 0.1, weeklyOrders: 10800, fulfillmentDifficulty: 'medium', ingredientCostPerServing: 7.80, prevIngredientCost: 7.10, cancelledDueToStock: 0.01, weeksOnMenu: 4 },
  ],
}

export const SAMPLE_DATASETS: SignalDataset[] = [logistics, suppliers, menu]

export function getDataset(id: string): SignalDataset | undefined {
  return SAMPLE_DATASETS.find((d) => d.id === id)
}
