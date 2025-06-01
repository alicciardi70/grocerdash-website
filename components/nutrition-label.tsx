interface NutritionProps {
  nutrition: {
    servingSize: string
    servingsPerContainer: string
    calories: number
    totalFat: string
    saturatedFat: string
    transFat: string
    cholesterol: string
    sodium: string
    totalCarbs: string
    dietaryFiber: string
    sugars: string
    protein: string
    vitaminD: string
    calcium: string
    iron: string
    potassium: string
  }
}

export default function NutritionLabel({ nutrition }: NutritionProps) {
  return (
    <div className="max-w-md border border-gray-900 p-4 font-sans text-gray-900">
      <h4 className="text-3xl font-bold text-center border-b-8 border-black pb-1 mb-1">Nutrition Facts</h4>
      <div className="text-sm border-b border-gray-900 pb-1 mb-1">
        <p>
          <span className="font-bold">Serving Size</span> {nutrition.servingSize}
        </p>
        <p>
          <span className="font-bold">Servings Per Container</span> {nutrition.servingsPerContainer}
        </p>
      </div>
      <div className="border-b-8 border-black pb-1 mb-1">
        <div className="flex justify-between items-end">
          <p className="font-bold">Calories</p>
          <p className="text-4xl font-bold">{nutrition.calories}</p>
        </div>
      </div>
      <p className="text-right text-sm border-b border-gray-900 pb-1 mb-1">% Daily Value*</p>
      <div className="border-b border-gray-900 pb-1 mb-1">
        <div className="flex justify-between">
          <p>
            <span className="font-bold">Total Fat</span> {nutrition.totalFat}
          </p>
          <p className="font-bold">5%</p>
        </div>
        <div className="flex justify-between pl-4">
          <p>Saturated Fat {nutrition.saturatedFat}</p>
          <p className="font-bold">3%</p>
        </div>
        <div className="pl-4">
          <p>Trans Fat {nutrition.transFat}</p>
        </div>
      </div>
      <div className="flex justify-between border-b border-gray-900 pb-1 mb-1">
        <p>
          <span className="font-bold">Cholesterol</span> {nutrition.cholesterol}
        </p>
        <p className="font-bold">0%</p>
      </div>
      <div className="flex justify-between border-b border-gray-900 pb-1 mb-1">
        <p>
          <span className="font-bold">Sodium</span> {nutrition.sodium}
        </p>
        <p className="font-bold">0%</p>
      </div>
      <div className="border-b border-gray-900 pb-1 mb-1">
        <div className="flex justify-between">
          <p>
            <span className="font-bold">Total Carbohydrate</span> {nutrition.totalCarbs}
          </p>
          <p className="font-bold">10%</p>
        </div>
        <div className="flex justify-between pl-4">
          <p>Dietary Fiber {nutrition.dietaryFiber}</p>
          <p className="font-bold">11%</p>
        </div>
        <div className="pl-4">
          <p>Total Sugars {nutrition.sugars}</p>
        </div>
      </div>
      <div className="flex justify-between border-b-8 border-black pb-1 mb-1">
        <p>
          <span className="font-bold">Protein</span> {nutrition.protein}
        </p>
        <p className="font-bold">3%</p>
      </div>
      <div className="text-sm space-y-1 mb-2">
        <div className="flex justify-between">
          <p>Vitamin D {nutrition.vitaminD}</p>
          <p>0%</p>
        </div>
        <div className="flex justify-between">
          <p>Calcium {nutrition.calcium}</p>
          <p>0%</p>
        </div>
        <div className="flex justify-between">
          <p>Iron {nutrition.iron}</p>
          <p>2%</p>
        </div>
        <div className="flex justify-between">
          <p>Potassium {nutrition.potassium}</p>
          <p>9%</p>
        </div>
      </div>
      <p className="text-xs">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000
        calories a day is used for general nutrition advice.
      </p>
    </div>
  )
}
