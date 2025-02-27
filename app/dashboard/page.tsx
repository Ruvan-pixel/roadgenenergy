"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/firebase";
import { collection, query, orderBy, limit, onSnapshot, getDocs, Timestamp, addDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, ReferenceLine
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState<{ id: string; Time: string; Voltage: number; Current: number; Energy: number }[]>([]);
  const [averages, setAverages] = useState({ Voltage: 0, Current: 0, Energy: 0 });
  const [batteryPercentage, setBatteryPercentage] = useState(75);
  const [batteryCharging, setBatteryCharging] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);

  // Function to subscribe to real-time updates
  useEffect(() => {
    try {
      const userId = "user_2tP7JJYbW7SvUpE3KU2zBcGLvNY";
      const simulatedDataRef = collection(db, "users", userId, "simulatedData");
      const q = query(simulatedDataRef, orderBy("Time", "asc"), limit(10));
      
      // Create a real-time listener
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("Real-time update received with", querySnapshot.docs.length, "documents");
        
        if (querySnapshot.empty) {
          // If no data exists, start simulating data
          simulateDataIfNeeded(userId);
          return;
        }
        
        const fetchedData = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          return { 
            id: doc.id, 
            Time: docData.Time || "Unknown",
            Voltage: Number(docData.Voltage) || 0,
            Current: Number(docData.Current) || 0,
            Energy: Number(docData.Energy) || 0
          };
        });
        
        // Update last timestamp
        if (fetchedData.length > 0) {
          setLastTimestamp(fetchedData[0].Time);
        }
        
        // Sort by time and display oldest first
        const sortedData = [...fetchedData].sort((a, b) => {
          return a.Time.localeCompare(b.Time);
        });
        
        setData(sortedData);
        
        // Calculate averages
        if (sortedData.length > 0) {
          const totals = sortedData.reduce((acc, item) => {
            return {
              Voltage: acc.Voltage + item.Voltage,
              Current: acc.Current + item.Current,
              Energy: acc.Energy + item.Energy
            };
          }, { Voltage: 0, Current: 0, Energy: 0 });
          
          const newAverages = {
            Voltage: Number((totals.Voltage / sortedData.length).toFixed(2)),
            Current: Number((totals.Current / sortedData.length).toFixed(2)),
            Energy: Number((totals.Energy / sortedData.length).toFixed(2))
          };
          
          setAverages(newAverages);
        }
        
        setLoading(false);
        setError(null);
      }, (err) => {
        console.error("Firebase real-time listener error:", err);
        setError(`Error with real-time updates: ${err.message}`);
        setLoading(false);
      });
      
      // Cleanup
      return () => unsubscribe();
    } catch (err) {
      console.error("Setup error:", err);
      setError(`Failed to set up real-time listener: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  }, []);

  // Function to simulate new data if needed
  const simulateDataIfNeeded = useCallback(async (userId: string) => {
    // Check if we need to start simulating
    if (data.length === 0) {
      // Start simulation timer
      const simulationInterval = setInterval(async () => {
        try {
          const simulatedDataRef = collection(db, "users", userId, "simulatedData");
          
          // Generate current time in HH:MM:SS format
          const now = new Date();
          const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
          
          // Generate random sensor values
          const newData = {
            Time: timeStr,
            Voltage: Number((Math.random() * 6 + 4).toFixed(2)),  // Range 4-10
            Current: Number((Math.random() * 2 + 0.5).toFixed(2)), // Range 0.5-2.5
            Energy: Number((Math.random() * 8 + 2).toFixed(2))     // Range 2-10
          };
          
          // Add to Firestore
          await addDoc(simulatedDataRef, newData);
          console.log("Simulated data added:", newData);
          
        } catch (err) {
          console.error("Error simulating data:", err);
        }
      }, 3000); // Add new data every 3 seconds
      
      // Clean up
      return () => clearInterval(simulationInterval);
    }
  }, [data.length]);
  
  // Simulate battery percentage changes
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryCharging(prev => !prev);
      setBatteryPercentage(prev => {
        // Random fluctuation between -5 and +5
        const change = Math.random() * 10 - 5;
        const newValue = prev + (batteryCharging ? Math.abs(change) : -Math.abs(change));
        // Keep between 10 and 95
        return Math.min(95, Math.max(10, newValue));
      });
    }, 3000);
    
    return () => clearInterval(batteryInterval);
  }, [batteryCharging]);
  
  // Format average data for bar chart
  const averageData = [
    { name: 'Voltage', value: averages.Voltage },
    { name: 'Current', value: averages.Current },
    { name: 'Energy', value: averages.Energy }
  ];

  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 mt-16 space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Real-Time Sensor Data</CardTitle>
          {loading && data.length === 0 && <p className="text-gray-500">Loading initial data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && data.length === 0 && <p className="text-amber-500">No data available. Simulating data now...</p>}
          {lastTimestamp && <p className="text-sm text-gray-500">Last update: {lastTimestamp}</p>}
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="Time" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis domain={[0, 'dataMax + 2']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Voltage" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={300}
              />
              <Line 
                type="monotone" 
                dataKey="Current" 
                stroke="#4ade80" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={300}
              />
              <Line 
                type="monotone" 
                dataKey="Energy" 
                stroke="#ff7300" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average of Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={averageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'dataMax + 2']} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <ReferenceLine y={0} stroke="#000" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Battery Percentage</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-64 border-2 border-gray-400 rounded-lg overflow-hidden">
              {/* Battery Terminal */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-8 h-4 bg-gray-400 rounded-t-md" />
              
              {/* Battery Level */}
              <div 
                className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out ${
                  batteryPercentage > 60 ? 'bg-green-500' : 
                  batteryPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ height: `${batteryPercentage}%` }}
              />
              
              {/* Charging Indicator */}
              {batteryCharging && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl">
                  ⚡
                </div>
              )}
              
              {/* Percentage Text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-white drop-shadow-md">
                {Math.round(batteryPercentage)}%
              </div>
            </div>
            <p className="mt-4 text-center font-medium">
              {batteryCharging ? "Charging" : "Discharging"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;