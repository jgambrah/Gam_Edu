"use client";

import { useRole } from '@/context/role-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bell, Calendar, DollarSign, GraduationCap, Users } from 'lucide-react';

function ParentDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Sports Day, Science Fair, Art Expo</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Announcements</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2 New</div>
          <p className="text-xs text-muted-foreground">Check the communication hub</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Grades Overview</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">B+</div>
          <p className="text-xs text-muted-foreground">Average grade this semester</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">95%</div>
          <p className="text-xs text-muted-foreground">1 day absent this month</p>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Classes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4 Classes</div>
          <p className="text-xs text-muted-foreground">Grade 5 Math, Grade 6 Science...</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2 Grades Due</div>
          <p className="text-xs text-muted-foreground">Mid-term reports due Friday</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Student Attendance</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98% Today</div>
          <p className="text-xs text-muted-foreground">2 students absent across all classes</p>
        </CardContent>
      </Card>
    </div>
  );
}

function GenericDashboard() {
  const { role } = useRole();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{role} Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to your dashboard. Role-specific widgets will be displayed here.</p>
      </CardContent>
    </Card>
  );
}

function DashboardPageContent() {
  const { role } = useRole();

  const renderDashboard = () => {
    switch (role) {
      case 'Parent':
        return <ParentDashboard />;
      case 'Teacher':
        return <TeacherDashboard />;
      default:
        return <GenericDashboard />;
    }
  };

  return <div className="space-y-4">{renderDashboard()}</div>;
}

export default function DashboardPage() {
  return (
    <DashboardPageContent />
  );
}
