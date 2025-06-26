
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Target, Clock, TrendingUp, Utensils, Lightbulb, Download, Share2, Camera } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface MealPlanResult {
  goal: string;
  timeline: string;
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    name: string;
    description: string;
    calories: number;
    tags: string[];
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }[];
  motivationTip: string;
}

const MealPlanner = () => {
  const [currentBodyImage, setCurrentBodyImage] = useState<File | null>(null);
  const [goalBodyImage, setGoalBodyImage] = useState<File | null>(null);
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [dietPreference, setDietPreference] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlanResult | null>(null);
  const [currentDay, setCurrentDay] = useState(1);

  const handleImageUpload = (type: 'current' | 'goal') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'current') {
        setCurrentBodyImage(file);
      } else {
        setGoalBodyImage(file);
      }
    }
  };

  const generateMealPlan = async () => {
    if (!currentBodyImage || !goalBodyImage) {
      toast.error("Please upload both current and goal body photos");
      return;
    }

    setIsLoading(true);

    // Mock data for now - in real implementation, this would call OpenAI with images
    setTimeout(() => {
      const mockResult: MealPlanResult = {
        goal: "Lean Muscle Gain (+4 kg)",
        timeline: "~12 weeks",
        dailyCalories: 2600,
        macroSplit: {
          protein: 40,
          carbs: 30,
          fat: 30
        },
        meals: [
          {
            name: "Plantain Omelette + Avocado",
            description: "3 eggs with fried plantain and half avocado",
            calories: 500,
            tags: ["High Protein", "Gluten-Free"],
            type: "breakfast"
          },
          {
            name: "Grilled Chicken + Ndole + Rice",
            description: "150g grilled chicken breast with ndole sauce and brown rice",
            calories: 700,
            tags: ["Heart-Healthy", "High Protein"],
            type: "lunch"
          },
          {
            name: "Steamed Fish + Sweet Potatoes + Greens",
            description: "200g steamed fish with roasted sweet potatoes and vegetables",
            calories: 650,
            tags: ["Low Carb", "Heart-Healthy"],
            type: "dinner"
          },
          {
            name: "Roasted Groundnuts + Banana",
            description: "30g roasted peanuts with one medium banana",
            calories: 400,
            tags: ["Vegan-Friendly", "Energy Boost"],
            type: "snack"
          }
        ],
        motivationTip: "Stay consistent, hydrate well, and include resistance training 3x/week. You're on track to see real changes in 90 days!"
      };

      setMealPlan(mockResult);
      setIsLoading(false);
      toast.success("Meal plan generated successfully!");
    }, 2000);
  };

  const generateDayPlan = (day: number) => {
    setCurrentDay(day);
    // In real implementation, this would generate different meals for different days
    toast.success(`Generated Day ${day} meal plan!`);
  };

  const exportPlan = () => {
    if (!mealPlan) return;
    
    // Create a simple text export of the meal plan
    const planText = `
🎯 Your Fitness Goal Summary
Goal: ${mealPlan.goal}
Timeline: ${mealPlan.timeline}
Daily Calories: ${mealPlan.dailyCalories} kcal
Macro Split: ${mealPlan.macroSplit.protein}P / ${mealPlan.macroSplit.carbs}C / ${mealPlan.macroSplit.fat}F

🍽️ Your Personalized Daily Meal Plan (Day ${currentDay})
${mealPlan.meals.map(meal => 
  `${getMealIcon(meal.type)} ${meal.name}\n• ${meal.calories} kcal | ${meal.tags.join(' | ')}\n• ${meal.description}`
).join('\n\n')}

💡 Personal Motivation Tip
${mealPlan.motivationTip}
    `;

    navigator.clipboard.writeText(planText).then(() => {
      toast.success("Meal plan copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy meal plan");
    });
  };

  const sharePlan = () => {
    if (navigator.share && mealPlan) {
      navigator.share({
        title: 'My AI Generated Meal Plan',
        text: `Check out my personalized meal plan: ${mealPlan.goal} in ${mealPlan.timeline}!`,
        url: window.location.href,
      }).catch(() => {
        toast.error("Sharing not supported on this device");
      });
    } else {
      exportPlan(); // Fallback to copy to clipboard
    }
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🥣';
      case 'lunch': return '🍛';
      case 'dinner': return '🥗';
      case 'snack': return '🍪';
      default: return '🍽️';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'high protein':
      case 'heart-healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'gluten-free':
      case 'vegan-friendly':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low carb':
      case 'energy boost':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AI Body Goal Meal Planner</h1>
          <p className="text-lg text-gray-600">
            Upload your current and goal body photos to get a personalized meal plan
          </p>
        </div>

        {/* Image Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Body Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Body Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload('current')}
                    className="hidden"
                    id="current-upload"
                  />
                  <label htmlFor="current-upload" className="cursor-pointer">
                    {currentBodyImage ? (
                      <div className="text-green-600">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">{currentBodyImage.name}</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Click to upload current photo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Body Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload('goal')}
                    className="hidden"
                    id="goal-upload"
                  />
                  <label htmlFor="goal-upload" className="cursor-pointer">
                    {goalBodyImage ? (
                      <div className="text-green-600">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">{goalBodyImage.name}</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Click to upload goal photo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Optional Preferences */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender (Optional)</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Level</label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Diet Preference</label>
                <Select value={dietPreference} onValueChange={setDietPreference}>
                  <SelectTrigger>
                    <SelectValue placeholder="Diet preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Restrictions</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="halal">Halal</SelectItem>
                    <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateMealPlan} 
              disabled={isLoading || !currentBodyImage || !goalBodyImage}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Generating Your Meal Plan..." : "Generate AI Meal Plan"}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {mealPlan && (
          <div className="space-y-6">
            {/* Section Header: Goal Summary */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800">
                <span className="text-3xl">👤</span>
                Your Fitness Goal Summary
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
            </div>

            {/* Goal Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">Goal</p>
                    <p className="font-semibold">{mealPlan.goal}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600">Timeline</p>
                    <p className="font-semibold">{mealPlan.timeline}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Utensils className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm text-gray-600">Daily Intake</p>
                    <p className="font-semibold">{mealPlan.dailyCalories} kcal</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-2">⚖️</div>
                    <p className="text-sm text-gray-600">Macro Split</p>
                    <p className="font-semibold text-xs">
                      {mealPlan.macroSplit.protein}P / {mealPlan.macroSplit.carbs}C / {mealPlan.macroSplit.fat}F
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Header: Daily Meal Plan */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800">
                <span className="text-3xl">🍽️</span>
                Your Personalized Daily Meal Plan
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto"></div>
            </div>

            {/* Day Switcher */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((day) => (
                <Button
                  key={day}
                  variant={currentDay === day ? "default" : "outline"}
                  size="sm"
                  onClick={() => generateDayPlan(day)}
                >
                  Day {day}
                </Button>
              ))}
            </div>

            {/* Daily Meal Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Day {currentDay} Meal Plan
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportPlan}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Plan
                    </Button>
                    <Button variant="outline" size="sm" onClick={sharePlan}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Plan
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mealPlan.meals.map((meal, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getMealIcon(meal.type)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{meal.name}</h3>
                          <p className="text-gray-600 text-sm">{meal.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{meal.calories} kcal</p>
                        <p className="text-xs text-gray-500 capitalize">{meal.type}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {meal.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className={getTagColor(tag)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section Header: Motivation Tip */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800">
                <span className="text-3xl">💡</span>
                Personal Motivation Tip
              </div>
              <div className="w-28 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
            </div>

            {/* Motivation Tip */}
            <Card>
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 italic leading-relaxed">{mealPlan.motivationTip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <span className="text-3xl">🏁</span>
                    Ready to start your journey?
                  </div>
                  <p className="text-gray-600 mb-6">
                    Take your meal planning to the next level with AI-powered food analysis
                  </p>
                  <Link to="/">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3">
                      <Camera className="h-5 w-5 mr-2" />
                      Upload Next Meal for AI Analysis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
