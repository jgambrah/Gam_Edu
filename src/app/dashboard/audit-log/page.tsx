
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, FileText } from 'lucide-react';
import { AuditLog } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuditLogPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const canAccess = role === 'Administrator' || role === 'Director';

  const auditLogQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'auditLogs'), orderBy('timestamp', 'desc')) : null),
    [firestore]
  );
  const { data: logs, isLoading } = useCollection<AuditLog>(auditLogQuery);

  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter(log =>
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  if (!canAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>This module is restricted to Administrators and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText />
            System Audit Log
          </CardTitle>
          <CardDescription>A chronological record of key actions performed in the system.</CardDescription>
          <div className="pt-4">
             <Input
                placeholder="Filter by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.timestamp ? format(log.timestamp.toDate(), 'PPP p') : 'N/A'}
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell><span className="font-mono text-xs bg-muted px-2 py-1 rounded">{log.action}</span></TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
           {!isLoading && filteredLogs.length === 0 && (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No audit logs found matching your criteria.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
