
'use client';

import { users } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
       <div className="flex items-center gap-4 mb-8">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground">View and manage all registered users.</p>
            </div>
       </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Registered Users</CardTitle>
          <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                     <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/40?u=${user.email}`} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
