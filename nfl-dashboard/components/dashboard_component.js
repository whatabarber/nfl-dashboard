import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, Calendar, RefreshCw, Award, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [currentWeek, setCurrentWeek] = useState(8);
  const [selectedPosition, setSelectedPosition] = useState('QB');
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('2024-10-27 10:30 AM');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data - in production, this would come from your backend API
  const playerRecommendations = {
    QB: [
      { name: 'Josh Allen', team: 'BUF', avgPoints: 24.3, trend: 2.1, consistency: 'High', projectedPoints: 26.2, confidence: 92 },
      { name: 'Lamar Jackson', team: 'BAL', avgPoints: 23.8, trend: 1.8, consistency: 'High', projectedPoints: 25.1, confidence: 89 },
      { name: 'Patrick Mahomes', team: 'KC', avgPoints: 22.1, trend: -0.5, consistency: 'High', projectedPoints: 21.8, confidence: 85 },
      { name: 'Jalen Hurts', team: 'PHI', avgPoints: 21.4, trend: 1.2, consistency: 'Medium', projectedPoints: 22.3, confidence: 78 },
      { name: 'Dak Prescott', team: 'DAL', avgPoints: 20.8, trend: -1.1, consistency: 'Medium', projectedPoints: 19.2, confidence: 72 }
    ],
    RB: [
      { name: 'Christian McCaffrey', team: 'SF', avgPoints: 22.1, trend: 0.8, consistency: 'High', projectedPoints: 23.5, confidence: 88 },
      { name: 'Derrick Henry', team: 'BAL', avgPoints: 18.9, trend: 1.4, consistency: 'High', projectedPoints: 20.2, confidence: 84 },
      { name: 'Saquon Barkley', team: 'PHI', avgPoints: 17.6, trend: 2.3, consistency: 'Medium', projectedPoints: 19.8, confidence: 81 },
      { name: 'Josh Jacobs', team: 'GB', avgPoints: 16.2, trend: -0.7, consistency: 'Medium', projectedPoints: 15.1, confidence: 73 },
      { name: 'Alvin Kamara', team: 'NO', avgPoints: 15.8, trend: 1.1, consistency: 'Medium', projectedPoints: 16.9, confidence: 76 }
    ],
    WR: [
      { name: 'Tyreek Hill', team: 'MIA', avgPoints: 19.4, trend: 1.2, consistency: 'High', projectedPoints: 21.1, confidence: 86 },
      { name: 'Davante Adams', team: 'LV', avgPoints: 18.2, trend: -0.8, consistency: 'High', projectedPoints: 17.3, confidence: 82 },
      { name: 'Cooper Kupp', team: 'LAR', avgPoints: 17.8, trend: 1.8, consistency: 'High', projectedPoints: 19.2, confidence: 84 },
      { name: 'Stefon Diggs', team: 'HOU', avgPoints: 16.9, trend: 0.5, consistency: 'Medium', projectedPoints: 17.4, confidence: 79 },
      { name: 'DeAndre Hopkins', team: 'TEN', avgPoints: 16.1, trend: 2.1, consistency: 'Medium', projectedPoints: 18.3, confidence: 77 }
    ],
    TE: [
      { name: 'Travis Kelce', team: 'KC', avgPoints: 14.8, trend: -1.2, consistency: 'High', projectedPoints: 13.1, confidence: 75 },
      { name: 'Mark Andrews', team: 'BAL', avgPoints: 12.9, trend: 1.6, consistency: 'Medium', projectedPoints: 14.2, confidence: 78 },
      { name: 'T.J. Hockenson', team: 'MIN', avgPoints: 11.4, trend: 0.9, consistency: 'Medium', projectedPoints: 12.1, confidence: 72 },
      { name: 'George Kittle', team: 'SF', avgPoints: 10.8, trend: 1.1, consistency: 'Medium', projectedPoints: 11.6, confidence: 69 },
      { name: 'Evan Engram', team: 'JAX', avgPoints: 9.7, trend: 0.3, consistency: 'Low', projectedPoints: 10.2, confidence: 64 }
    ],
    K: [
      { name: 'Justin Tucker', team: 'BAL', avgPoints: 9.8, trend: 0.2, consistency: 'High', projectedPoints: 10.1, confidence: 85 },
      { name: 'Harrison Butker', team: 'KC', avgPoints: 9.4, trend: 0.5, consistency: 'High', projectedPoints: 9.8, confidence: 82 },
      { name: 'Tyler Bass', team: 'BUF', avgPoints: 8.9, trend: -0.3, consistency: 'Medium', projectedPoints: 8.4, confidence: 78 },
      { name: 'Daniel Carlson', team: 'LV', avgPoints: 8.6, trend: 0.8, consistency: 'Medium', projectedPoints: 9.2, confidence: 76 },
      { name: 'Jake Elliott', team: 'PHI', avgPoints: 8.3, trend: 0.1, consistency: 'Medium', projectedPoints: 8.4, confidence: 74 }
    ]
  };

  const weeklyTrends = [
    { week: 4, points: 18.2, projectedPoints: 17.8 },
    { week: 5, points: 21.4, projectedPoints: 19.2 },
    { week: 6, points: 19.8, projectedPoints: 20.1 },
    { week: 7, points: 23.6, projectedPoints: 21.4 },
    { week: 8, points: 22.1, projectedPoints: 22.8 }
  ];

  const matchupData = [
    { matchup: 'BUF vs MIA', total: 47.5, confidence: 'High', weatherImpact: 'None' },
    { matchup: 'KC vs LV', total: 43.5, confidence: 'Medium', weatherImpact: 'Wind' },
    { matchup: 'BAL vs CLE', total: 41.0, confidence: 'High', weatherImpact: 'None' },
    { matchup: 'PHI vs WAS', total: 49.0, confidence: 'Medium', weatherImpact: 'Rain' }
  ];

  const prizePicksRecommendations = [
    { 
      player: 'Josh Allen', 
      stat: 'Passing Yards', 
      line: 267.5, 
      recommendation: 'OVER', 
      confidence: 84, 
      reasoning: 'Strong trend, favorable matchup vs MIA secondary' 
    },
    { 
      player: 'Christian McCaffrey', 
      stat: 'Rushing Yards', 
      line: 89.5, 
      recommendation: 'OVER', 
      confidence: 91, 
      reasoning: 'Consistent volume, SF favored by 7' 
    },
    { 
      player: 'Tyreek Hill', 
      stat: 'Receiving Yards', 
      line: 74.5, 
      recommendation: 'OVER', 
      confidence: 78, 
      reasoning: 'High target share, BUF allows 8th most yards to WRs' 
    },
    { 
      player: 'Travis Kelce', 
      stat: 'Receptions', 
      line: 5.5, 
      recommendation: 'UNDER', 
      confidence: 72, 
      reasoning: 'Declining trend, tough LV defense vs TEs' 
    }
  ];

  const positions = ['QB', 'RB', 'WR', 'TE', 'K'];
  const teams = ['ALL', 'BUF', 'MIA', 'NE', 'NYJ', 'BAL', 'CIN', 'CLE', 'PIT', 'HOU', 'IND', 'JAX', 'TEN', 'DEN', 'KC', 'LV', 'LAC', 'DAL', 'NYG', 'PHI', 'WAS', 'CHI', 'DET', 'GB', 'MIN', 'ATL', 'CAR', 'NO', 'TB', 'ARI', 'LAR', 'SF', 'SEA'];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // In production, this would call your backend API
    // const response = await fetch('/api/refresh-data');
    // const newData = await response.json();
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdate(new Date().toLocaleString());
    }, 2000);
  };

  const fetchData = async (endpoint) => {
    try {
      // In production, replace with your actual API URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading NFL Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">NFL Analytics Dashboard</h1>
                <p className="text-gray-400">Week {currentWeek} • Last updated: {lastUpdate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select 
                value={currentWeek} 
                onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
                className="bg-gray-700 text-white rounded px-3 py-2"
              >
                {Array.from({length: 18}, (_, i) => i + 1).map(week => (
                  <option key={week} value={week}>Week {week}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <select 
                value={selectedPosition} 
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="bg-gray-700 text-white rounded px-3 py-2"
              >
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-400" />
              <select 
                value={selectedTeam} 
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-gray-700 text-white rounded px-3 py-2"
              >
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Player Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Top {selectedPosition} Recommendations
              </h2>
              <div className="space-y-4">
                {playerRecommendations[selectedPosition].map((player, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-gray-400">{player.team}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">{player.avgPoints}</span>
                          <span className="text-sm text-gray-400">avg</span>
                          {player.trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          Projected: {player.projectedPoints} ({player.confidence}%)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prize Picks Recommendations */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                Prize Picks Recommendations
              </h2>
              <div className="space-y-4">
                {prizePicksRecommendations.map((pick, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{pick.player}</div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        pick.recommendation === 'OVER' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {pick.recommendation}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      {pick.stat}: {pick.line} • Confidence: {pick.confidence}%
                    </div>
                    <div className="text-sm text-gray-300">{pick.reasoning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Trends Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Weekly Performance Trends</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="points" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="projectedPoints" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Matchup Analysis */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Key Matchups</h3>
              <div className="space-y-3">
                {matchupData.map((matchup, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3">
                    <div className="font-semibold text-sm">{matchup.matchup}</div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                      <span>O/U: {matchup.total}</span>
                      <span className={`px-2 py-1 rounded ${
                        matchup.confidence === 'High' ? 'bg-green-600' : 'bg-yellow-600'
                      }`}>
                        {matchup.confidence}
                      </span>
                    </div>
                    {matchup.weatherImpact !== 'None' && (
                      <div className="text-xs text-orange-400 mt-1">
                        Weather: {matchup.weatherImpact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Players Tracked</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Games Analyzed</span>
                  <span className="font-bold">128</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prediction Accuracy</span>
                  <span className="font-bold text-green-500">78.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Next Update</span>
                  <span className="font-bold">In 2h 15m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;