
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Target, Clock, TrendingUp, Utensils, Lightbulb, Download, Share2, Camera, CheckCircle2 } from "lucide-react";
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
    toast.success(`Generated Day ${day} meal plan!`);
  };

  const exportPlan = () => {
    if (!mealPlan) return;
    
    const planText = `🎯 Your Fitness Goal Summary
Goal: ${mealPlan.goal}
Timeline: ${mealPlan.timeline}
Daily Calories: ${mealPlan.dailyCalories} kcal
Macro Split: ${mealPlan.macroSplit.protein}P / ${mealPlan.macroSplit.carbs}C / ${mealPlan.macroSplit.fat}F

🍽️ Your Personalized Daily Meal Plan (Day ${currentDay})
${mealPlan.meals.map(meal => 
  `${getMealIcon(meal.type)} ${meal.name}\n• ${meal.calories} kcal | ${meal.tags.join(' | ')}\n• ${meal.description}`
).join('\n\n')}

💡 Personal Motivation Tip
${mealPlan.motivationTip}`;

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
      exportPlan();
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
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'gluten-free':
      case 'vegan-friendly':
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
      case 'low carb':
      case 'energy boost':
        return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/20">
            <Target className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Body Goal Meal Planner
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your current and goal body photos to get a personalized meal plan tailored to your fitness journey
          </p>
        </div>

        {/* Image Upload Section */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Upload className="h-6 w-6 text-blue-600" />
              Upload Body Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Current Body Photo</label>
                <div className="group border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload('current')}
                    className="hidden"
                    id="current-upload"
                  />
                  <label htmlFor="current-upload" className="cursor-pointer">
                    {currentBodyImage ? (
                      <div className="text-green-600 space-y-2">
                        <CheckCircle2 className="h-12 w-12 mx-auto" />
                        <p className="font-medium">{currentBodyImage.name}</p>
                        <p className="text-xs text-gray-500">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-gray-500 group-hover:text-blue-600 transition-colors space-y-2">
                        <Upload className="h-12 w-12 mx-auto" />
                        <p className="font-medium">Upload current photo</p>
                        <p className="text-xs">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Goal Body Photo</label>
                <div className="group border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload('goal')}
                    className="hidden"
                    id="goal-upload"
                  />
                  <label htmlFor="goal-upload" className="cursor-pointer">
                    {goalBodyImage ? (
                      <div className="text-green-600 space-y-2">
                        <CheckCircle2 className="h-12 w-12 mx-auto" />
                        <p className="font-medium">{goalBodyImage.name}</p>
                        <p className="text-xs text-gray-500">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-gray-500 group-hover:text-purple-600 transition-colors space-y-2">
                        <Upload className="h-12 w-12 mx-auto" />
                        <p className="font-medium">Upload goal photo</p>
                        <p className="text-xs">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Optional Preferences */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Optional Preferences</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="bg-white">
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
                  <label className="text-sm font-medium text-gray-600">Activity Level</label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger className="bg-white">
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
                  <label className="text-sm font-medium text-gray-600">Diet Preference</label>
                  <Select value={dietPreference} onValueChange={setDietPreference}>
                    <SelectTrigger className="bg-white">
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
            </div>

            <Button 
              onClick={generateMealPlan} 
              disabled={isLoading || !currentBodyImage || !goalBodyImage}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Your Meal Plan...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Generate AI Meal Plan
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {mealPlan && (
          <div className="space-y-8 animate-fade-in">
            {/* Section Header: Goal Summary */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">👤</span>
                <h2 className="text-3xl font-bold text-gray-800">Your Fitness Goal Summary</h2>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
            </div>

            {/* Goal Summary */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <TrendingUp className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <p className="text-sm text-gray-600 mb-1">Goal</p>
                    <p className="font-bold text-lg">{mealPlan.goal}</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <Clock className="h-8 w-8 mx-auto mb-3 text-green-600" />
                    <p className="text-sm text-gray-600 mb-1">Timeline</p>
                    <p className="font-bold text-lg">{mealPlan.timeline}</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <Utensils className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                    <p className="text-sm text-gray-600 mb-1">Daily Intake</p>
                    <p className="font-bold text-lg">{mealPlan.dailyCalories} kcal</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="text-3xl mb-3">⚖️</div>
                    <p className="text-sm text-gray-600 mb-1">Macro Split</p>
                    <p className="font-bold text-sm">
                      {mealPlan.macroSplit.protein}P / {mealPlan.macroSplit.carbs}C / {mealPlan.macroSplit.fat}F
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Header: Daily Meal Plan */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">🍽️</span>
                <h2 className="text-3xl font-bold text-gray-800">Your Personalized Daily Meal Plan</h2>
              </div>
              <div className="w-40 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto"></div>
            </div>

            {/* Day Switcher */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((day) => (
                <Button
                  key={day}
                  variant={currentDay === day ? "default" : "outline"}
                  size="sm"
                  onClick={() => generateDayPlan(day)}
                  className={currentDay === day ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                >
                  Day {day}
                </Button>
              ))}
            </div>

            {/* Daily Meal Plan */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Utensils className="h-6 w-6 text-blue-600" />
                    Day {currentDay} Meal Plan
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportPlan} className="hover:bg-blue-50">
                      <Download className="h-4 w-4 mr-2" />
                      Download Plan
                    </Button>
                    <Button variant="outline" size="sm" onClick={sharePlan} className="hover:bg-green-50">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Plan
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {mealPlan.meals.map((meal, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl bg-white rounded-full p-3 shadow-sm">
                          {getMealIcon(meal.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">{meal.name}</h3>
                          <p className="text-gray-600 mt-1">{meal.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-blue-600">{meal.calories}</p>
                        <p className="text-sm text-gray-500">kcal</p>
                        <p className="text-xs text-gray-400 capitalize mt-1">{meal.type}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {meal.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tagIndex} 
                          variant="outline" 
                          className={`${getTagColor(tag)} transition-colors cursor-default`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Section Header: Motivation Tip */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">💡</span>
                <h2 className="text-3xl font-bold text-gray-800">Personal Motivation Tip</h2>
              </div>
              <div className="w-36 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
            </div>

            {/* Motivation Tip */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="pt-8">
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 italic leading-relaxed text-lg font-medium">{mealPlan.motivationTip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-100 via-pink-50 to-orange-100">
              <CardContent className="pt-8">
                <div className="text-center space-y-6">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl">🏁</span>
                    <h2 className="text-3xl font-bold text-gray-800">Ready to start your journey?</h2>
                  </div>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Take your meal planning to the next level with AI-powered food analysis
                  </p>
                  <Link to="/">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 text-lg font-semibold shadow-lg">
                      <Camera className="h-6 w-6 mr-3" />
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
