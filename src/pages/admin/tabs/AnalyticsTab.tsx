import React, { useState } from 'react';
import { PieChart, BarChart, TrendingUp, Users, Home, Car, Calendar } from 'lucide-react';

const AnalyticsTab: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0], // today
  });
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  return (
    <div className="card">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold">Site Analytics</h2>
      </div>
      
      <div className="p-4">
        {/* Date Range Selector */}
        <div className="mb-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-primary-600" />
            <h3 className="font-medium">Select Date Range</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-secondary-700 mb-1">
                Start Date
              </label>
              <input
                id="start"
                name="start"
                type="date"
                value={dateRange.start}
                onChange={handleDateChange}
                className="input w-full"
              />
            </div>
            
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-secondary-700 mb-1">
                End Date
              </label>
              <input
                id="end"
                name="end"
                type="date"
                value={dateRange.end}
                onChange={handleDateChange}
                className="input w-full"
              />
            </div>
          </div>
        </div>
        
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Total Visitors</p>
                <h3 className="text-2xl font-bold mt-1">12,543</h3>
                <p className="text-success-600 text-sm flex items-center mt-1">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+12.5% from previous period</span>
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Users size={20} className="text-primary-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">New Garages</p>
                <h3 className="text-2xl font-bold mt-1">48</h3>
                <p className="text-success-600 text-sm flex items-center mt-1">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+8.2% from previous period</span>
                </p>
              </div>
              <div className="bg-accent-100 p-3 rounded-full">
                <Home size={20} className="text-accent-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">New Users</p>
                <h3 className="text-2xl font-bold mt-1">156</h3>
                <p className="text-success-600 text-sm flex items-center mt-1">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+15.8% from previous period</span>
                </p>
              </div>
              <div className="bg-success-100 p-3 rounded-full">
                <Users size={20} className="text-success-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm">Garage Searches</p>
                <h3 className="text-2xl font-bold mt-1">2,342</h3>
                <p className="text-success-600 text-sm flex items-center mt-1">
                  <TrendingUp size={14} className="mr-1" />
                  <span>+23.4% from previous period</span>
                </p>
              </div>
              <div className="bg-warning-100 p-3 rounded-full">
                <Car size={20} className="text-warning-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitor Statistics */}
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Visitor Statistics</h3>
              <div className="flex items-center gap-1 text-sm text-secondary-500">
                <BarChart size={16} className="text-primary-600" />
                <span>Daily visitors</span>
              </div>
            </div>
            
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for chart */}
              <div className="bg-secondary-50 rounded-lg border border-secondary-200 w-full h-full flex items-center justify-center">
                <div className="text-center p-4">
                  <BarChart size={40} className="text-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-500">Visitor statistics chart would appear here</p>
                  <p className="text-xs text-secondary-400 mt-1">Data from {dateRange.start} to {dateRange.end}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top Garages */}
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Most Visited Garages</h3>
              <div className="flex items-center gap-1 text-sm text-secondary-500">
                <PieChart size={16} className="text-accent-600" />
                <span>Top 5 garages</span>
              </div>
            </div>
            
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for chart */}
              <div className="bg-secondary-50 rounded-lg border border-secondary-200 w-full h-full flex items-center justify-center">
                <div className="text-center p-4">
                  <PieChart size={40} className="text-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-500">Garage popularity chart would appear here</p>
                  <p className="text-xs text-secondary-400 mt-1">Data from {dateRange.start} to {dateRange.end}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Data Tables */}
        <div className="mt-6">
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Popular Search Terms</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary-50">
                    <th className="px-4 py-2 text-left font-medium text-secondary-700">Search Term</th>
                    <th className="px-4 py-2 text-left font-medium text-secondary-700">Count</th>
                    <th className="px-4 py-2 text-left font-medium text-secondary-700">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-secondary-100">
                    <td className="px-4 py-3">Bakım</td>
                    <td className="px-4 py-3">325</td>
                    <td className="px-4 py-3">18.4%</td>
                  </tr>
                  <tr className="border-b border-secondary-100">
                    <td className="px-4 py-3">Lastik değişimi</td>
                    <td className="px-4 py-3">287</td>
                    <td className="px-4 py-3">16.2%</td>
                  </tr>
                  <tr className="border-b border-secondary-100">
                    <td className="px-4 py-3">Motor tamiri</td>
                    <td className="px-4 py-3">254</td>
                    <td className="px-4 py-3">14.4%</td>
                  </tr>
                  <tr className="border-b border-secondary-100">
                    <td className="px-4 py-3">Kaporta</td>
                    <td className="px-4 py-3">198</td>
                    <td className="px-4 py-3">11.2%</td>
                  </tr>
                  <tr className="border-b border-secondary-100">
                    <td className="px-4 py-3">Elektrik arıza</td>
                    <td className="px-4 py-3">156</td>
                    <td className="px-4 py-3">8.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Device and Browser Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <h3 className="font-medium mb-4">Device Distribution</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-700">Mobile</span>
                  <span className="text-sm text-secondary-700">65%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-700">Desktop</span>
                  <span className="text-sm text-secondary-700">28%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-700">Tablet</span>
                  <span className="text-sm text-secondary-700">7%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-secondary-200 shadow-sm">
            <h3 className="font-medium mb-4">Browser Usage</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-700">Chrome</span>
                  <span className="text-sm text-secondary-700">54%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-accent-600 h-2 rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-700">Safari</span>
                  <span className="text-sm text-secondary-700">22%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-accent-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-700">Firefox</span>
                  <span className="text-sm text-secondary-700">14%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-accent-600 h-2 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-700">Edge</span>
                  <span className="text-sm text-secondary-700">8%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-accent-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-secondary-700">Others</span>
                  <span className="text-sm text-secondary-700">2%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div className="bg-accent-600 h-2 rounded-full" style={{ width: '2%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab; 