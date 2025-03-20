
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LogsTab = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">System Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="grid grid-cols-4 border-b bg-muted/50 p-2 text-sm font-medium">
            <div>Timestamp</div>
            <div>Type</div>
            <div className="col-span-2">Message</div>
          </div>
          <div className="divide-y max-h-96 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 p-2 text-sm items-center">
                <div className="text-gray-500">
                  {new Date(Date.now() - i * 3600000).toLocaleString()}
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    i % 3 === 0 
                      ? 'bg-red-100 text-red-800' 
                      : i % 3 === 1 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {i % 3 === 0 ? 'Error' : i % 3 === 1 ? 'Warning' : 'Info'}
                  </span>
                </div>
                <div className="col-span-2">
                  {i % 3 === 0 
                    ? `Failed to send SMS to +1234567${i}90: Invalid phone number` 
                    : i % 3 === 1 
                    ? `Retrying message delivery to user${i}@example.com` 
                    : `Successfully sent daily affirmation to ${10 - i} users`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsTab;
