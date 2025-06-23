import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Building2, Globe, Calendar, Users } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  domain: string;
  keywords: any[];
  createdAt: Date;
}

interface BusinessManagerProps {
  businesses: Business[];
  onAddBusiness: (business: { name: string; domain: string }) => void;
  onClose: () => void;
}

export const BusinessManager = ({ businesses, onAddBusiness, onClose }: BusinessManagerProps) => {
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessDomain, setNewBusinessDomain] = useState('');

  const handleAddBusiness = () => {
    if (!newBusinessName.trim() || !newBusinessDomain.trim()) return;
    
    onAddBusiness({
      name: newBusinessName.trim(),
      domain: newBusinessDomain.trim(),
    });
    
    setNewBusinessName('');
    setNewBusinessDomain('');
  };

  const getTotalKeywords = (business: Business) => {
    return business.keywords.length;
  };

  const getRankedKeywords = (business: Business) => {
    return business.keywords.filter(k => k.currentPosition !== null).length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">Business Management</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Add New Business */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Add New Client Business
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <Input
                  placeholder="e.g., Joe's Coffee Shop"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website Domain
                </label>
                <Input
                  placeholder="e.g., joescoffee.com"
                  value={newBusinessDomain}
                  onChange={(e) => setNewBusinessDomain(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={handleAddBusiness}
              className="mt-4"
              disabled={!newBusinessName.trim() || !newBusinessDomain.trim()}
            >
              Add Business
            </Button>
          </Card>

          {/* Existing Businesses */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Client Businesses ({businesses.length})</h3>
            
            {businesses.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No businesses added yet</p>
                <p className="text-sm">Add your first client business above to get started</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businesses.map((business) => (
                  <Card key={business.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{business.name}</h4>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Globe className="w-4 h-4" />
                            {business.domain}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Keywords:</span>
                          <Badge variant="outline">{getTotalKeywords(business)}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Ranked:</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {getRankedKeywords(business)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        Added {business.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
