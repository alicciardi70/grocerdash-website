import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBasket, Clock, ArrowRight } from "lucide-react"

const recentBaskets = [
  {
    id: 1,
    name: "Weekly Groceries",
    itemCount: 12,
    lastUpdated: "2 days ago",
    savings: "$8.45",
    bestStore: "Fresh Market",
  },
  {
    id: 2,
    name: "Healthy Snacks",
    itemCount: 6,
    lastUpdated: "5 days ago",
    savings: "$3.20",
    bestStore: "Organic Grocers",
  },
  {
    id: 3,
    name: "Dinner Party",
    itemCount: 8,
    lastUpdated: "1 week ago",
    savings: "$5.75",
    bestStore: "Value Supermarket",
  },
]

export default function RecentBaskets() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Baskets</h2>
        <Link href="/baskets" className="text-blue-600 font-medium hover:text-blue-700 flex items-center">
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentBaskets.map((basket) => (
          <Link key={basket.id} href={`/basket/${basket.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <ShoppingBasket className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">{basket.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {basket.lastUpdated}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{basket.itemCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Best price at:</span>
                    <span className="font-medium">{basket.bestStore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Potential savings:</span>
                    <span className="font-medium text-green-600">{basket.savings}</span>
                  </div>
                </div>

                <div className="text-blue-600 text-sm font-medium flex items-center">
                  Compare prices <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
