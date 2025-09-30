import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import {
  LocalHospital,
  Schedule,
  Assignment,
  Security,
  CloudQueue,
  PeopleAlt,
  HealthAndSafety,
  TrendingUp,
  ArrowForward,
} from '@mui/icons-material';
import { clearAuthState } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';

/**
 * LandingPage Component
 * Professional landing page showcasing VetCare SaaS platform
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  // const theme = useTheme(); // TODO: Will be used for theming

  // Debug function to clear auth state
  const handleClearAuth = () => {
    dispatch(clearAuthState());
    localStorage.clear(); // Clear all localStorage including Redux persist
    window.location.reload(); // Force reload to clear any cached state
  };

  // Debug: Log auth state changes
  useEffect(() => {
    console.log('🔍 LandingPage: Auth state:', { isAuthenticated });
    console.log('🔍 LandingPage: LocalStorage keys:', Object.keys(localStorage));
  }, [isAuthenticated]);

  const features = [
    {
      icon: <Schedule />,
      title: 'Appointment Scheduling',
      description: 'Streamlined booking system with automated reminders and calendar integration',
    },
    {
      icon: <Assignment />,
      title: 'Electronic Health Records',
      description: 'SOAP notes, medical history, and comprehensive pet records management',
    },
    {
      icon: <Security />,
      title: 'HIPAA Compliant',
      description: 'Enterprise-grade security with data encryption and audit trails',
    },
    {
      icon: <CloudQueue />,
      title: 'Cloud-Native SaaS',
      description: 'Reliable, scalable infrastructure with 99.9% uptime guarantee',
    },
    {
      icon: <PeopleAlt />,
      title: 'Multi-Clinic Support',
      description: 'Manage multiple clinic locations with role-based access control',
    },
    {
      icon: <TrendingUp />,
      title: 'Practice Analytics',
      description: 'Comprehensive reporting and insights to grow your practice',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Veterinarians' },
    { number: '50K+', label: 'Appointments' },
    { number: '99.9%', label: 'Uptime' },
    { number: '<200ms', label: 'Response Time' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Debug Banner - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.1)', 
          p: 1, 
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography variant="caption" sx={{ color: 'white', mr: 2 }}>
            Debug: Auth State = {isAuthenticated ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}
          </Typography>
          {isAuthenticated && (
            <Button 
              size="small" 
              variant="outlined" 
              sx={{ color: 'white', borderColor: 'white', fontSize: '0.7rem' }}
              onClick={handleClearAuth}
            >
              Clear Auth State
            </Button>
          )}
        </Box>
      )}

      {/* Header Navigation */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: 'white',
                  color: 'primary.main',
                }}
              >
                <LocalHospital sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  letterSpacing: '-0.5px',
                }}
              >
                VetCare
              </Typography>
              <Chip
                label="SaaS Platform"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Navigation Links */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                <Button
                  sx={{ 
                    color: 'white', 
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  About
                </Button>
                <Button
                  sx={{ 
                    color: 'white', 
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Features
                </Button>
                <Button
                  sx={{ 
                    color: 'white', 
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                  onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Testimonials
                </Button>
                <Button
                  sx={{ 
                    color: 'white', 
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact
                </Button>
              </Box>

              {/* Auth Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="text"
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                  onClick={() => navigate('/auth/login')}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                  onClick={() => navigate('/auth/register')}
                >
                  Get Started
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              lineHeight: 1.2,
              letterSpacing: '-1px',
            }}
          >
            Modern Veterinary Practice
            <br />
            Management Platform
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 300,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Multi-tenant SaaS platform designed for veterinary clinics focusing on
            appointment scheduling, electronic health records, and comprehensive practice management.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
              onClick={() => navigate('/auth/register')}
            >
              Start Your Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Watch Demo
            </Button>
          </Stack>

          {/* Stats */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 4,
            justifyItems: 'center'
          }}>
            {stats.map((stat, index) => (
              <Box key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: 'white',
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.8,
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Features Section */}
        <Box id="features" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              color: 'white',
              mb: 6,
              fontWeight: 'bold',
            }}
          >
            Everything Your Practice Needs
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 4
          }}>
            {features.map((feature, index) => (
              <Box key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          mr: 2,
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: { fontSize: 28, color: 'white' },
                        })}
                      </Avatar>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        opacity: 0.9,
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* About Us Section */}
        <Box
          id="about"
          sx={{
            mb: 8,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            p: 6,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
              mb: 6,
            }}
          >
            About VetCare
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 6,
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                Revolutionizing Veterinary Practice Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  opacity: 0.9,
                  mb: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                }}
              >
                VetCare was founded by veterinarians who understand the unique challenges 
                facing modern animal healthcare practices. We recognized the need for a 
                comprehensive, user-friendly platform that could handle everything from 
                appointment scheduling to complex medical record management.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  opacity: 0.9,
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                }}
              >
                Our mission is to empower veterinary professionals with technology that 
                enhances patient care, streamlines operations, and supports practice growth. 
                We believe that when veterinarians have the right tools, they can focus on 
                what they do best - caring for animals.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  500+
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    opacity: 0.8,
                  }}
                >
                  Veterinary Clinics
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  50k+
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    opacity: 0.8,
                  }}
                >
                  Animals Cared For
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  99.9%
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    opacity: 0.8,
                  }}
                >
                  Uptime Guarantee
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                  }}
                >
                  24/7
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    opacity: 0.8,
                  }}
                >
                  Support Available
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Testimonials Section */}
        <Box
          id="testimonials"
          sx={{
            mb: 8,
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
              mb: 6,
            }}
          >
            What Veterinarians Say
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4,
            }}
          >
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                p: 4,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontStyle: 'italic',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                "VetCare has transformed how we manage our practice. The integrated 
                scheduling and patient records have reduced our administrative time 
                by 40%, allowing us to focus more on patient care."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    Dr. Sarah Chen
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      opacity: 0.7,
                    }}
                  >
                    Pacific Animal Hospital
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                p: 4,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontStyle: 'italic',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                "The multi-location support and real-time synchronization have been 
                game-changers for our growing practice. VetCare scales with us as we 
                expand to new locations."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    Dr. Michael Rodriguez
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      opacity: 0.7,
                    }}
                  >
                    Metro Veterinary Group
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          id="pricing"
          sx={{
            textAlign: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            p: 6,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <HealthAndSafety
            sx={{
              fontSize: 60,
              color: 'white',
              mb: 3,
            }}
          />
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Ready to Transform Your Practice?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              opacity: 0.9,
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Join hundreds of veterinary practices using VetCare to streamline operations,
            improve patient care, and grow their business.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
            onClick={() => navigate('/auth/register')}
            endIcon={<ArrowForward />}
          >
            Get Started Today
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        id="contact"
        component="footer"
        sx={{
          py: 4,
          px: 3,
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 VetCare SaaS Platform. Built for veterinary excellence.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              HIPAA Compliant • 99.9% Uptime • Enterprise Security
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;