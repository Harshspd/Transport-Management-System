"use client";

import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography, Paper } from '@mui/material';
import { TabPanel, TabContext } from '@mui/lab';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Import your components here
import Account from './tabs/Account';
import AccountSecurity from './tabs/AccountSecurity';
import Application from './tabs/Application';
import Invoice from './tabs/Invoice';
import Estimate from './tabs/Estimate';
import Notification from './tabs/Notification';

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Paper sx={{ width: '100%', bgcolor: 'background.paper', p: 3 }}>
      <Box sx={{ p: 1 }}>
        <Typography sx={{ fontSize: "2rem", color: '#575757' }}>
          Settings
        </Typography>
      </Box>

      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 48,
                color: '#666',
                fontSize: '0.95rem',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: '#2196f3',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#2196f3',
                height: '3px',
              },
            }}
          >
            <Tab icon={<PersonOutlineIcon />} iconPosition="start" label="Account" value="account" />
            <Tab icon={<SecurityIcon />} iconPosition="start" label="Account Security" value="account-settings" />
            <Tab icon={<ReceiptIcon />} iconPosition="start" label="Invoice" value="invoice" />
            <Tab icon={<DescriptionIcon />} iconPosition="start" label="Estimate" value="estimate" />
            <Tab icon={<NotificationsNoneIcon />} iconPosition="start" label="Notifications" value="notification" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value="account"><Account /></TabPanel>
          <TabPanel value="account-settings"><AccountSecurity /></TabPanel>
          <TabPanel value="application"><Application /></TabPanel>
          <TabPanel value="invoice"><Invoice /></TabPanel>
          <TabPanel value="estimate"><Estimate /></TabPanel>
          <TabPanel value="notification"><Notification /></TabPanel>
        </Box>
      </TabContext>
    </Paper>
  );
}
