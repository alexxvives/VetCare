import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Paper,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CalendarToday,
  Pets,
  People,
  AttachMoney,
  Add,
  Event,
  MedicalServices,
  Phone,
  Email,
  AccessTime,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

/**
 * Dashboard Component
 * Main dashboard showing key metrics, recent activity, and quick actions
 */
const Dashboard: React.FC = () => {
  // Mock data - in a real app, this would come from Redux/API
  const stats = [
    {
      title: 'Today\'s Appointments',
      value: '12',
      change: '+8%',
      trend: 'up',
      icon: <CalendarToday />,
      color: 'primary.main',
    },
    {
      title: 'Active Patients',
      value: '248',
      change: '+12%',
      trend: 'up',
      icon: <Pets />,
      color: 'success.main',
    },
    {
      title: 'New Clients',
      value: '34',
      change: '+15%',
      trend: 'up',
      icon: <People />,
      color: 'info.main',
    },
    {
      title: 'Monthly Revenue',
      value: '$24,580',
      change: '-3%',
      trend: 'down',
      icon: <AttachMoney />,
      color: 'warning.main',
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      petName: 'Buddy',
      ownerName: 'John Smith',
      time: '09:00 AM',
      type: 'Check-up',
      status: 'confirmed',
      phone: '(555) 123-4567',
    },
    {
      id: 2,
      petName: 'Luna',
      ownerName: 'Sarah Davis',
      time: '10:30 AM',
      type: 'Vaccination',
      status: 'confirmed',
      phone: '(555) 987-6543',
    },
    {
      id: 3,
      petName: 'Max',
      ownerName: 'Mike Johnson',
      time: '02:00 PM',
      type: 'Surgery',
      status: 'pending',
      phone: '(555) 456-7890',
    },
    {
      id: 4,
      petName: 'Bella',
      ownerName: 'Emily Wilson',
      time: '03:30 PM',
      type: 'Emergency',
      status: 'urgent',
      phone: '(555) 234-5678',
    },
  ];

  const quickActions = [
    {
      title: 'New Appointment',
      description: 'Schedule a new appointment',
      icon: <Event />,
      action: () => console.log('New appointment'),
      color: 'primary',
    },
    {
      title: 'Add Client',
      description: 'Register a new client',
      icon: <People />,
      action: () => console.log('Add client'),
      color: 'secondary',
    },
    {
      title: 'Medical Record',
      description: 'Create medical record',
      icon: <MedicalServices />,
      action: () => console.log('Medical record'),
      color: 'success',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle fontSize="small" />;
      case 'pending':
        return <AccessTime fontSize="small" />;
      case 'urgent':
        return <Warning fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome back, Dr. Smith! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening at your clinic today.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 3,
          mb: 4
        }}
      >
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    width: 48,
                    height: 48,
                    mr: 2,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {stat.trend === 'up' ? (
                      <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: stat.trend === 'up' ? 'success.main' : 'error.main',
                        fontWeight: 600,
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3
        }}
      >
        {/* Recent Appointments */}
        <Card sx={{ height: '100%' }}>
          <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  Today's Appointments
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={() => console.log('Add appointment')}
                >
                  Add New
                </Button>
              </Box>

              <List sx={{ p: 0 }}>
                {recentAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        '&:hover': { bgcolor: 'action.hover' },
                        borderRadius: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48,
                          }}
                        >
                          <Pets />
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {appointment.petName}
                            </Typography>
                            <Chip
                              icon={getStatusIcon(appointment.status)}
                              label={appointment.status}
                              size="small"
                              color={getStatusColor(appointment.status) as any}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Owner: {appointment.ownerName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Type: {appointment.type} • Time: {appointment.time}
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Phone fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Email fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < recentAppointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="text" color="primary">
                  View All Appointments
                </Button>
              </Box>
            </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ height: '100%' }}>
          <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {quickActions.map((action, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 3,
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={action.action}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: `${action.color}.main`,
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Activity Summary */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Today's Progress
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'between', mb: 1 }}>
                    <Typography variant="body2">Appointments</Typography>
                    <Typography variant="body2">8/12</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(8 / 12) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'between', mb: 1 }}>
                    <Typography variant="body2">Revenue Goal</Typography>
                    <Typography variant="body2">$850/$1200</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(850 / 1200) * 100}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;