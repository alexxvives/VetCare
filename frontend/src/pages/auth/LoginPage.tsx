import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LocalHospital,
} from '@mui/icons-material';
import { RootState } from '../../store/store';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // const dispatch = useDispatch<AppDispatch>(); // TODO: Will be used for login action
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const from = (location.state as any)?.from || '/app/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Implement login logic
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: 'white' }}>
        <LocalHospital sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          VetCare
        </Typography>
      </Box>

      <Paper elevation={24} sx={{ p: 4, width: '100%', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: 3 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
          Welcome Back
        </Typography>

        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to your veterinary practice account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Link to="/auth/forgot-password" style={{ textDecoration: 'none', color: '#1976d2', fontSize: '0.875rem' }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              New to VetCare?
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            component={Link}
            to="/auth/register"
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}
          >
            Create Account
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ mt: 3, p: 2, width: '100%', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
        <Typography variant="caption" color="white" sx={{ opacity: 0.9, textAlign: 'center', display: 'block' }}>
          Demo: admin@vetcare.com / demo123
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;