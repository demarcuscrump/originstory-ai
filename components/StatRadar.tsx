import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from 'recharts';
import { Stats, Alignment } from '../types';

interface StatRadarProps {
  stats: Stats;
  alignment?: Alignment;
}

export const StatRadar: React.FC<StatRadarProps> = ({ stats, alignment }) => {
  const justiceLabel = alignment === Alignment.VILLAIN ? 'Infamy' : (alignment === Alignment.ANTI_HERO ? 'Vengeance' : 'Justice');

  const data = [
    { subject: 'Wealth', A: stats.wealth, fullMark: 100 },
    { subject: 'Sanity', A: stats.sanity, fullMark: 100 },
    { subject: justiceLabel, A: stats.justice, fullMark: 100 },
    { subject: 'Glory', A: stats.glory, fullMark: 100 },
    { subject: 'Suspicion', A: stats.suspicion, fullMark: 100 },
  ];

  return (
    <div className="w-full h-48 md:h-64 bg-white border-2 border-black shadow-comic p-2 relative">
      <div className="absolute top-0 left-0 bg-black text-white text-xs px-2 py-1 font-bold">CHARACTER STATS</div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#000" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontSize: 10, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#000"
            strokeWidth={2}
            fill="#F9F871"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};