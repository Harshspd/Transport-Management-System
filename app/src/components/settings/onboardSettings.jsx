import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Stepper, Step, StepLabel } from '@mui/material';

import Account from './account';
import Invoice from './invoice';

const steps = ['Account', 'Invoice'];
const SettingsOnboard = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = steps.length;

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep(prevStep => prevStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevStep => prevStep - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <Paper sx={{ width: '100%', bgcolor: 'background.paper', p: 3 }}>
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: "2rem", color: '#575757' }}>
          Complete Your Profile
        </Typography>
        <Typography sx={{ color: '#666' }}>
          Step {activeStep + 1} of {totalSteps}
        </Typography>
      </Box>
      
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 3 }}>
        {activeStep === 0 && <Account />}
        {activeStep === 1 && <Invoice />}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          {activeStep > 0 && (
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
          )}
          
          {activeStep < totalSteps - 1 && (
            <Button variant="outlined" color="info" onClick={handleSkip}>
              Skip
            </Button>
          )}

          <Button variant="contained" onClick={handleNext}>
            {activeStep === totalSteps - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SettingsOnboard;
