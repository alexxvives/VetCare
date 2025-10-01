import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Card, 
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Pets,
  CalendarToday,
  AttachMoney,
  Settings,
  Security,
  Analytics,
  Warning,
  CheckCircle,
  PersonAdd,
  Add,
  Notifications,
  Assignment,
  LocalHospital,
  Schedule,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  const userName = user ? `${user.first_name} ${user.last_name}` : 'User';
  const userRole = user?.role || 'client';
  const userInitials = user ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}` : 'U';

  // MVP Super Admin Dashboard Content
  if (userRole === 'super_admin') {
    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Super Admin Header */}
        <Paper 
          sx={{ 
            mb: 4, 
            p: 3, 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mr: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '1.5rem',
                }}
              >
                👑
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  Super Admin Control Panel
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  VetCare Animal Hospital • Complete System Access
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Notifications />
              </IconButton>
              <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <Settings />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* System Health Alert */}
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            🟢 All Systems Operational
          </Typography>
          System health: Excellent • Database: Connected • Last backup: 2 hours ago
        </Alert>

        {/* Key Metrics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: 3,
          mb: 4
        }}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                <People />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                327
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Users
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: 'success.main' }}>
                  +15 this month
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                <Pets />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                1,248
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Registered Pets
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: 'success.main' }}>
                  +47 this week
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                <CalendarToday />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                28
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Today's Appointments
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  12 completed • 16 pending
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ textAlign: 'center', p: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                <AttachMoney />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                $18.4K
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Monthly Revenue
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: 'success.main' }}>
                  +8% vs last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Main Dashboard Content */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          
          {/* Admin Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <AdminPanelSettings sx={{ mr: 1 }} />
                Admin Actions
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PersonAdd />}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Manage Users
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add staff, manage permissions
                    </Typography>
                  </Box>
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Analytics />}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      View Reports
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Financial & performance analytics
                    </Typography>
                  </Box>
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Settings />}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Clinic Settings
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hours, services, general config
                    </Typography>
                  </Box>
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Security />}
                  sx={{ justifyContent: 'flex-start', p: 2 }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Security & Backup
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      System security & data management
                    </Typography>
                  </Box>
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* System Status & Activity */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} />
                System Status
              </Typography>

              {/* System Health */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Database Performance
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={92} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4, mb: 1 }} 
                />
                <Typography variant="caption" color="text.secondary">
                  92% - Excellent
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Storage Usage
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={67} 
                  color="info"
                  sx={{ height: 8, borderRadius: 4, mb: 1 }} 
                />
                <Typography variant="caption" color="text.secondary">
                  67% - 3.2GB of 5GB used
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Recent Activity */}
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Recent Activity
              </Typography>
              
              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="New user registered"
                    secondary="Dr. Sarah Johnson joined as veterinarian"
                  />
                  <Typography variant="caption" color="text.secondary">
                    2h ago
                  </Typography>
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <Schedule color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="System backup completed"
                    secondary="All data successfully backed up"
                  />
                  <Typography variant="caption" color="text.secondary">
                    3h ago
                  </Typography>
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="High appointment volume"
                    secondary="Today's bookings 40% above average"
                  />
                  <Typography variant="caption" color="text.secondary">
                    5h ago
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  // Default dashboard for other roles
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Paper 
        sx={{ 
          mb: 4, 
          p: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mr: 3,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              fontSize: '1.5rem',
            }}
          >
            {userInitials}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome back, {userName}! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Role: {userRole} • {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 3 
      }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dashboard Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personalized dashboard is ready! Role: {userRole}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role-based actions for {userRole} users.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your recent activities will appear here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;