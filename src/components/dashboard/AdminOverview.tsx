import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card } from '../ui/Card';
import { TrendingUp, Users, AlertCircle, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const data = [
  { name: 'Mon', incidents: 4, rescues: 2 },
  { name: 'Tue', incidents: 7, rescues: 5 },
  { name: 'Wed', incidents: 12, rescues: 8 },
  { name: 'Thu', incidents: 8, rescues: 10 },
  { name: 'Fri', incidents: 15, rescues: 12 },
  { name: 'Sat', incidents: 20, rescues: 18 },
  { name: 'Sun', incidents: 14, rescues: 15 },
];

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

export const AdminOverview = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title={t('dashboard.overview_charts.disasterTrends')} subtitle={t('dashboard.overview_charts.weeklySubtitle')}>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a8a29e'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#a8a29e'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="incidents" stroke="#ef4444" fillOpacity={1} fill="url(#colorInc)" strokeWidth={3} />
                <Area type="monotone" dataKey="rescues" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRes)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t('dashboard.overview_charts.resourceDistribution')} subtitle={t('dashboard.overview_charts.assetSubtitle')}>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: t('dashboard.overview_charts.medical'), value: 400 },
                    { name: t('dashboard.overview_charts.food'), value: 300 },
                    { name: t('dashboard.overview_charts.shelter'), value: 300 },
                    { name: t('dashboard.overview_charts.transport'), value: 200 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-8">
              {[
                t('dashboard.overview_charts.medical'),
                t('dashboard.overview_charts.food'),
                t('dashboard.overview_charts.shelter'),
                t('dashboard.overview_charts.transport')
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-widest">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
