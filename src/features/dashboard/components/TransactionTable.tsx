'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/features/transactions/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TransactionTableProps {
  title?: string;
  data: Transaction[];
}

export default function TransactionTable({
  title = 'Recent Transactions',
  data,
}: TransactionTableProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground bg-muted/50">
                  Name
                </th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground bg-muted/50">
                  Amount
                </th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground bg-muted/50">
                  Type
                </th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground bg-muted/50">
                  Category
                </th>
                <th className="text-left p-3 text-sm font-semibold text-muted-foreground bg-muted/50">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No transactions found
                  </td>
                </tr>
              ) : (
                data.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3 text-sm">{t.title}</td>
                    <td className="p-3 text-sm font-medium">{formatCurrency(t.amount)}</td>
                    <td className="p-3">
                      <Badge variant={t.type === 'income' ? 'income' : 'expense'}>
                        {t.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{t.category}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {formatDate(t.date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

