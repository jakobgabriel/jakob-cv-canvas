import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Cookie, Shield, BarChart3, Download, Trash2 } from 'lucide-react';
import { CookieManager } from '@/lib/cookieManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

export const AnalyticsDashboard = () => {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState(CookieManager.getPreferences());
  const [analyticsData, setAnalyticsData] = useState(CookieManager.getAnalyticsData());

  useEffect(() => {
    // Refresh data periodically
    const interval = setInterval(() => {
      setAnalyticsData(CookieManager.getAnalyticsData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePreferenceChange = (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    CookieManager.setPreferences(newPreferences);
  };

  const handleClearData = () => {
    CookieManager.clearTrackingData();
    setAnalyticsData([]);
    setPreferences({});
  };

  const handleExportData = () => {
    const data = {
      preferences,
      interactions: analyticsData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getActionStats = () => {
    const stats: Record<string, number> = {};
    analyticsData.forEach(item => {
      stats[item.action] = (stats[item.action] || 0) + 1;
    });
    return stats;
  };

  const actionStats = getActionStats();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-4 left-4 z-40 bg-background/80 backdrop-blur-sm"
        >
          <Settings className="w-4 h-4 mr-1" />
          Analytics
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cookie Preferences */}
          <Card className="p-4">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              Cookie Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Essential Cookies</span>
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                </div>
                <Switch checked={true} disabled />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Analytics Cookies</span>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                <Switch 
                  checked={preferences.analytics || false}
                  onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Analytics Summary */}
          {preferences.analytics && (
            <Card className="p-4">
              <h3 className="font-medium mb-4">Analytics Summary</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold">{analyticsData.length}</div>
                  <div className="text-sm text-muted-foreground">Total Interactions</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold">{Object.keys(actionStats).length}</div>
                  <div className="text-sm text-muted-foreground">Action Types</div>
                </div>
              </div>
              
              {/* Action Breakdown */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Action Breakdown:</h4>
                {Object.entries(actionStats).map(([action, count]) => (
                  <div key={action} className="flex justify-between text-sm">
                    <span className="capitalize">{action.replace(/_/g, ' ')}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Data Management */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Data Management</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportData}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-1" />
                Export Data
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleClearData}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All Data
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Export your data as JSON or permanently delete all stored analytics data.
            </p>
          </Card>

          {/* Recent Activity */}
          {preferences.analytics && analyticsData.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium mb-4">Recent Activity</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {analyticsData.slice(-10).reverse().map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-b pb-1">
                    <span className="capitalize">{item.action.replace(/_/g, ' ')}</span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};