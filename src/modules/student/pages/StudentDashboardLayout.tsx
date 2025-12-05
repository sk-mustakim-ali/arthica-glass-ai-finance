import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from '../components/StudentSidebar';
import { StudentHeader } from '../components/StudentHeader';
import { QuickAddExpense, FloatingAddButton } from '../components/QuickAddExpense';

export const StudentDashboardLayout: React.FC = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <StudentSidebar />
      <StudentHeader />
      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <Outlet />
      </main>
      <FloatingAddButton onClick={() => setShowAddExpense(true)} />
      <QuickAddExpense open={showAddExpense} onOpenChange={setShowAddExpense} />
    </div>
  );
};
