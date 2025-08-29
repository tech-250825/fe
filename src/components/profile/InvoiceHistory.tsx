"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
// Using simple state-based collapsible instead of shadcn component
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Receipt, Calendar } from "lucide-react";
import { config } from "@/config";

interface Invoice {
  id: number;
  trackId: string;
  amount: number;
  currency: string;
  status: string;
  approvedAt: string;
}

interface InvoiceHistoryResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: Invoice[];
}

export function InvoiceHistory() {
  const [isOpen, setIsOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.apiUrl}/api/oxapay/invoices`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data: InvoiceHistoryResponse = await response.json();

      if (data.statusCode === 200) {
        setInvoices(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to load invoices');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoice history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && invoices.length === 0) {
      fetchInvoices();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <Card className="mb-8 p-0">
      <CardContent className="p-6 cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-md p-2">
              <Receipt className="text-muted-foreground size-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">See My Invoices</h2>
              <p className="text-muted-foreground text-sm">
                View your payment history and invoices
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardContent>
      
      {isOpen && (
        <CardContent className="pt-0 px-6 pb-6 border-t">
            {isLoading ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Loading invoices...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <p className="text-red-500 mb-3">{error}</p>
                <Button 
                  onClick={fetchInvoices} 
                  variant="outline" 
                  size="sm"
                >
                  Try Again
                </Button>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-6">
                <Receipt className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                <p className="text-muted-foreground">No invoices found</p>
                <p className="text-sm text-muted-foreground/70">
                  Your payment history will appear here once you make a purchase
                </p>
              </div>
            ) : (
              <div className="overflow-hidden border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-sm w-32">Track ID</th>
                        <th className="text-left py-3 px-4 font-medium text-sm w-24">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-sm w-20">Currency</th>
                        <th className="text-left py-3 px-4 font-medium text-sm w-20">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice, index) => (
                        <tr key={invoice.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                          <td className="py-3 px-4 text-sm font-mono text-muted-foreground">
                            {invoice.trackId}
                          </td>
                          <td className="py-3 px-4 text-sm font-semibold">
                            ${invoice.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              {invoice.currency}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {formatDate(invoice.approvedAt)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </CardContent>
      )}
    </Card>
  );
}