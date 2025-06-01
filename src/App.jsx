import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import DashboardPage from '@/pages/DashboardPage';
import { Toaster } from '@/components/ui/toaster';
import { USER_ROLES } from '@/lib/constants';
import { Checkbox } from "@/components/ui/checkbox"; // For "Remember Me" if needed elsewhere
import { Label } from "@/components/ui/label"; // For "Remember Me" if needed elsewhere

function App() {
  // Simulate user role and name. In a real app, this would come from auth.
  const currentUserRole = USER_ROLES.SUPER_ADMIN; // Or USER_ROLES.ADMIN
  const currentUserName = 'Sultan'; // Example admin name

  // Example of how "Remember Me" might be used if a login form existed
  const [rememberMe, setRememberMe] = React.useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-900">
        <Header userName={currentUserName} userRole={currentUserRole} />
        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route 
                path="/" 
                element={
                  <DashboardPage 
                    currentUserRole={currentUserRole} 
                    currentUserName={currentUserName} 
                  />
                } 
              />
              {/* 
                Example of a conceptual login form structure if it were here:
                <Route path="/login" element={
                  <div>
                    <h2>Login</h2>
                    <form>
                      ... other fields ...
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={setRememberMe} />
                        <Label htmlFor="rememberMe">Remember Me</Label>
                      </div>
                      <Button type="submit">Login</Button>
                    </form>
                  </div>
                } /> 
              */}
            </Routes>
          </motion.div>
        </main>
        <Toaster />
        <footer className="text-center p-4 text-sm text-muted-foreground border-t border-border/50 bg-background/50">
          <p>&copy; {new Date().getFullYear()} Giyo Inc. All rights reserved.</p>
          <p>Powered by Hostinger Horizons</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
