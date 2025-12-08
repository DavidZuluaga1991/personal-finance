import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function SummaryCard({ label, value, color = '#3b82f6' }: SummaryCardProps) {
  return (
    <Card className="shadow-sm" style={{ borderLeftWidth: '6px', borderLeftColor: color }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

