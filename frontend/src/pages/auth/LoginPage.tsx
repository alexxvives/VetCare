import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import { RootState, AppDispatch } from '../../store/store';
import { loginUser, clearError } from '../../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const from = (location.state as any)?.from || '/app/dashboard';

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear any auth errors when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      const result = await dispatch(loginUser({ 
        email: email.trim(), 
        password 
      }));
      
      if (loginUser.fulfilled.match(result)) {
        // Login successful - redirect will happen via useEffect
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Error is handled by the rejected case in the slice
      console.error('Login error:', error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%',
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
        Welcome Back
      </Typography>

      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Sign in to your veterinary practice account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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

      {/* Demo Credentials */}
      <Paper sx={{ mt: 3, p: 3, width: '100%', background: 'rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.primary" sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}>
          Demo Accounts
        </Typography>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
            🛡️ Super Admin: superadmin@vetcare.com / SuperAdmin123!
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
            🏥 Clinic Admin: admin@vetcare-demo.com / Admin123!
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
            👨‍⚕️ Veterinarian: dr.smith@vetcare-demo.com / Vet123!
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;