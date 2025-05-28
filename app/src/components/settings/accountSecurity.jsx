import React, { useState, useEffect } from 'react';
import { Box, Grid, Divider, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import { updateAccount, getAccountById } from '../../actions/settingAction';
import { changeAccountEmail, generateOtp, changePassword } from 'actions/authAction';
import { validatePassword } from 'utils/validationUtils';
import { toast } from 'react-toastify';

export default function AccountSecurity() {
  const dispatch = useDispatch();
  const [accountDetails, setAccountDetails] = useState({});
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [id, setId] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [changePasswordVisibility, setChangePasswordVisibility] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setId(parsedData?.account_id);
    }
  }, []);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (id) {
        try {
          const accountDataById = await getAccountById(id);
          if (accountDataById) {
            setAccountDetails(accountDataById);
            setEmail(accountDataById?.account_email || '');
          }
        } catch (error) {
          console.error('Error fetching account details:', error);
        }
      }
    };
    fetchAccountDetails();
  }, [id]);

  const handleEmailChangeClick = () => {
    setIsEditable(true);
    setNewEmail(email);
  };

  const handleSaveEmail = async () => {
    if (newEmail !== email) {
      const resultAction = await dispatch(generateOtp({ email: newEmail, mode: 'new' }));
      if (generateOtp.fulfilled.match(resultAction)) {
        setOtpSent(true);
        setError('');
      } else {
        setIsEditable(false);
      }
    } else {
      setIsEditable(false);
    }
  };

  const handleEmailVerification = async () => {
    try {
      const resultAction = await dispatch(changeAccountEmail({ email: newEmail, otp }));
      if (changeAccountEmail.fulfilled.match(resultAction)) {
        setOtpVerified(true);
        setEmail(newEmail);
        setIsEditable(false);
        setOtpSent(false);
        toast.success('Account Email Changed Successfully');
      }
    } catch (error) {
      setError('OTP verification failed.');
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordError(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const resultAction = await dispatch(changePassword({ email, newPassword, password: currentPassword }));
      if (changePassword.fulfilled.match(resultAction)) {
        setError('');
        toast.success('Password Changed Successfully');
        setChangePasswordVisibility(false);
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      }
    } catch (error) {}
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2" color="#575757" sx={{ fontWeight: '400' }}>
          Account Settings
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: '#575555' }}>
          Account Email
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, alignItems: 'start' }}>
          {isEditable ? (
            <TextField
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              fullWidth
              sx={{ width: '50%' }}
            />
          ) : (
            <Typography>{email}</Typography>
          )}
          {isEditable ? (
            <Button variant="contained" color="primary" onClick={handleSaveEmail} sx={{ width: 'auto', px: 3 }}>
              Send OTP
            </Button>
          ) : (
            <Button variant="outlined" onClick={handleEmailChangeClick} sx={{ width: 'auto', px: 3 }}>
              Change Email
            </Button>
          )}
        </Box>

        {otpSent && !otpVerified && (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'start' }}>
            <Typography variant="h6" fontWeight="bold">
              Enter OTP
            </Typography>
            <TextField value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" fullWidth sx={{ width: '50%' }} />
            <Button variant="contained" color="primary" onClick={handleEmailVerification} sx={{ width: 'auto', px: 3 }}>
              Verify OTP
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        )}
        <Divider sx={{ my: 4 }} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: '#575555' }}>
          Change Password
        </Typography>
        {!changePasswordVisibility ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, alignItems: 'start' }}>
            <Typography>**************</Typography>
            <Button variant="outlined" onClick={() => setChangePasswordVisibility(true)} sx={{ width: 'auto', px: 3 }}>
              Change Password
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'start' }}>
            <TextField
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ width: '50%' }}
            />
            <TextField
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError(!validatePassword(e.target.value));
              }}
              error={passwordError}
              helperText={passwordError ? 'At least 6 characters with 1 special character & number' : ''}
              sx={{ width: '50%' }}
            />
            <TextField
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error}
              helperText={error}
              sx={{ width: '50%' }}
            />
            <Button variant="contained" color="primary" onClick={handleChangePassword} sx={{ width: 'auto', px: 3 }}>
              Save
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
