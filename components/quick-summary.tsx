"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"

const summaryData = [
  {
    title: "Total Volume (24h)",
    value: "$2.4B",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Addresses",
    value: "45,231",
    change: "+8.2%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Transactions (24h)",
    value: "892,456",
    change: "-3.1%",
    trend: "down",
    icon: TrendingUp,
  },
  {
    title: "Avg Gas Fee",
    value: "$0.12",
    change: "-15.4%",
    trend: "down",
    icon: TrendingDown,
  },
]

export function QuickSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {summaryData.map((item, index) => {
        const Icon = item.icon
        return (
          <Card
            key={item.title}
            className="hover:shadow-lg transition-all duration-200 hover:scale-105 animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p
                className={`text-xs flex items-center gap-1 ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}
              >
                {item.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {item.change} from yesterday
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
