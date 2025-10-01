import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, Avatar } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

/**
 * AuthLayout Component
 * Layout for authentication pages (login, register, forgot password)
 * Provides a clean, centered design for auth forms
 */
const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3,
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mb: 2,
              boxShadow: 3,
            }}
          >
            <LocalHospital sx={{ fontSize: 40, color: 'white' }} />
          </Avatar>
          
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
            }}
          >
            🏥 VetCare
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            Veterinary Practice Management
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              width: '100%',
              maxWidth: 450,
            }}
          >
            <Outlet />
          </Paper>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            © 2025 VetCare SaaS. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;