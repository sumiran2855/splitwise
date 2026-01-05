"use client";
import AppLayout from '@/src/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { mockExpenses, expenseCategories } from '@/src/data/mockData';
import { useState } from 'react';
import { useNavigation } from '@/src/contexts/navigationContext';

export default function InsightsPage() {
  const { navigate } = useNavigation();
  const [timeRange, setTimeRange] = useState('month');

  // Calculate category spending
  const categoryData = expenseCategories.map(category => {
    const total = mockExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: category, value: total };
  }).filter(d => d.value > 0);

  // Monthly spending trend
  const monthlyData = [
    { month: 'Aug', spending: 850, income: 920 },
    { month: 'Sep', spending: 1240, income: 1100 },
    { month: 'Oct', spending: 980, income: 1050 },
    { month: 'Nov', spending: 1420, income: 1200 },
    { month: 'Dec', spending: 1680, income: 1400 },
    { month: 'Jan', spending: 1150, income: 1300 },
  ];

  // Top expenses
  const topExpenses = [...mockExpenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const COLORS = ['#1cc29f', '#5bc5a7', '#ff9500', '#ff652f', '#6366f1', '#8b5cf6', '#ec4899'];

  const totalSpent = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = totalSpent / mockExpenses.length;
  const thisMonthSpent = mockExpenses
    .filter(e => e.date.getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);
  const lastMonthSpent = 1420; // Mock data
  const percentChange = ((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100;

  return (
    <AppLayout currentPage="dashboard" navigate={navigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-1">Insights & Reports</h1>
            <p className="text-muted-foreground">Analyze your spending patterns</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total spent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-[#1cc29f] mb-1">
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">
                ${thisMonthSpent.toFixed(2)}
              </div>
              <div className={`flex items-center ${percentChange > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {percentChange > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span>{Math.abs(percentChange).toFixed(1)}% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average expense</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">
                ${avgExpense.toFixed(2)}
              </div>
              <p className="text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl mb-1">
                {mockExpenses.length}
              </div>
              <p className="text-muted-foreground">Transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList>
            <TabsTrigger value="trends">Spending trends</TabsTrigger>
            <TabsTrigger value="categories">By category</TabsTrigger>
            <TabsTrigger value="top">Top expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly spending & income</CardTitle>
                <CardDescription>Track your financial patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#ff652f" 
                      strokeWidth={2}
                      name="Spending"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#1cc29f" 
                      strokeWidth={2}
                      name="Income"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending by category</CardTitle>
                  <CardDescription>Visual breakdown of your expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number | undefined) => value !== undefined ? `$${value.toFixed(2)}` : '$0.00'}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category breakdown</CardTitle>
                  <CardDescription>Detailed spending by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888888" angle={-45} textAnchor="end" height={100} />
                      <YAxis stroke="#888888" />
                      <Tooltip 
                        formatter={(value: number | undefined) => value !== undefined ? `$${value.toFixed(2)}` : '$0.00'}
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#1cc29f" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="top" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Highest expenses</CardTitle>
                <CardDescription>Your top 5 largest expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topExpenses.map((expense, index) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
                      onClick={() => navigate('expense-detail', { expenseId: expense.id })}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-[#1cc29f] text-white flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <p className="truncate max-w-xs">{expense.description}</p>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <span>{expense.category}</span>
                            <span>•</span>
                            <span>{expense.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl text-[#1cc29f]">${expense.amount.toFixed(2)}</p>
                        <p className="text-muted-foreground">Paid by {expense.paidBy.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
