import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useDispatch } from "react-redux";
import { updateAccount, getAccountById } from "../../actions/settingAction";
import { Divider, MenuItem, Select } from "@mui/material";

// Custom styled Switch component
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 60,
  height: 34,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(26px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 30,
    height: 30,
  },
  '& .MuiSwitch-track': {
    borderRadius: 34 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
    '&::before': {
      content: '"On"',
      color: theme.palette.mode === 'light' ? '#000' : '#fff',
    },
    '&::after': {
      content: '"Off"',
      color: theme.palette.mode === 'light' ? '#000' : '#fff',
    },
  },
}));

export default function InvoiceSettings() {
  const [invoiceSettings, setInvoiceSettings] = useState({});
  const [heading, setHeading] = useState('');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [id, setId] = useState("");
  const [accountDetails, setAccountDetails] = useState({});
  const [datachange, setDatachange] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
  const [latePaymentReminder, setLatePaymentReminder] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [error, setError] = useState('');
  const [defaultDueDate, setDefaultDueDate] = useState(10);
  const [invoice_cc, setInvoiceCC] = useState('');
  const [invoice_bcc, setinvoice_bcc] = useState('');
  const dispatch = useDispatch();

  const validateAndSavePrefix = (e) => {
    const value = e.target.value;
    if (value.length > 20) {
      setError('Prefix cannot exceed 20 characters');
      return;
    }
    setError('');
    setPrefix(value);
    handleChange(e);
  };

  const fetchClientData = async () => {
    try {
      const clientDataById = await getAccountById(id);
      if (clientDataById) {
        setAccountDetails(clientDataById);
        setInvoiceSettings(clientDataById?.invoiceSettings || {});
        setHeading(clientDataById?.invoiceSettings?.heading || '');
        setNotes(clientDataById?.invoiceSettings?.notes || '');
        setTerms(clientDataById?.invoiceSettings?.terms || '');
        setLatePaymentReminder(clientDataById?.invoiceSettings?.reminder_invoice || '');
        setPrefix(clientDataById?.invoiceSettings?.prefix);
        setInvoiceCC(clientDataById?.invoiceSettings?.invoice_cc || '');
        setinvoice_bcc(clientDataById?.invoiceSettings?.invoice_bcc || '');
        setLoaded(true);
        setDefaultDueDate(clientDataById?.invoiceSettings?.defaultDueDate || 10);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let storedData = localStorage.getItem("user");
    if (storedData) {
      storedData = JSON.parse(storedData);
      setId(storedData?.account_id);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchClientData();
    }
  }, [id]);

  const handleChange = (e) => {
    setInvoiceSettings(prevSettings => ({
      ...prevSettings,
      [e.target.name]: e.target.value
    }));
    setDatachange(true);
    setSaving(true);
    setSavingMessage(true);
    if(e.target.name === 'defaultDueDate') {
      handleMouseLeave();
    }
  };

  const handleMouseLeave = async () => {
    if (datachange && loaded && !error) {
      await dispatch(updateAccount({
        ...accountDetails,
        client_id: id,
        invoiceSettings: {
          ...invoiceSettings,
          'reminder_invoice': latePaymentReminder
        }
      }));
      setDatachange(false);
      setSaving(false);
      setTimeout(() => {
        setSavingMessage(false);
      }, 1000);
    }
  };

  const handleToggleChange = (event) => {
    setLatePaymentReminder(event.target.checked);
    setDatachange(true);
    setSaving(true);
    setSavingMessage(true);
  };

  return (
    <Box onMouseLeave={handleMouseLeave}>
      <Box sx={{ display: "flex", justifyContent: "left", gap: "20px", alignContent: "center", }}>
      <Typography variant="h2" sx={{ mb: 3, color: "#575555", fontWeight: '400' }}>
      Invoice Settings</Typography>
        {savingMessage && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {saving ? (
              <span style={{ color: "#1976d2", fontSize: "large", fontWeight: "bold" }}>
                Unsaved Changes <PendingIcon sx={{ verticalAlign: "middle" }} />
              </span>
            ) : (
              <span style={{ color: "#1976d2", fontSize: "large", fontWeight: "bold" }}>
                Saved <CheckCircleIcon sx={{ verticalAlign: "middle" }} />
              </span>
            )}
          </Box>
        )}
      </Box>
      <Divider sx={{ mb: 4 }} />

      <Grid item xs={12} md={12}>
        <Typography variant="subtitle1" sx={{ color: "#575555" }}>Prefix</Typography>
        <TextField
          fullWidth
          sx={{ width: "90%" }}
          name="prefix"
          onChange={validateAndSavePrefix}
          margin="normal"
          rows={4}
          onBlur={handleMouseLeave}
          value={prefix}
          placeholder="prefix"
          error={!!error}
          helperText={error}
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
        <Typography variant="subtitle1" sx={{ color: "#575555" }}>Heading</Typography>
          <TextField
            fullWidth
            onBlur={handleMouseLeave}
            sx={{ width: "90%" }}
            name="heading"
            onChange={(e) => { handleChange(e); setHeading(e.target.value) }}
            margin="normal"
            value={heading}
            placeholder="Heading"
          />
        </Grid>
        <Grid item xs={12} md={12}>
        <Typography variant="subtitle1" sx={{ color: "#575555" }}>Notes</Typography>
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            name="notes"
            onChange={(e) => { handleChange(e); setNotes(e.target.value) }}
            margin="normal"
            multiline={true}
            rows={4}
            value={notes}
            onBlur={handleMouseLeave}
            placeholder="Notes"
          />
        </Grid>
        <Grid item xs={12} md={12}>
        <Typography variant="subtitle1" sx={{ color: "#575555" }}>Terms</Typography>
          <TextField
            fullWidth
            sx={{ width: "90%" }}
            name="terms"
            onChange={(e) => { handleChange(e); setTerms(e.target.value) }}
            margin="normal"
            multiline={true}
            rows={4}
            onBlur={handleMouseLeave}
            value={terms}
            placeholder="Terms"
          />
        </Grid>
        <Grid item xs={12} md={12}>
        <Typography variant="subtitle1" sx={{ mb:2, color: "#575555" }}>
            Default Due Date
          </Typography>
          <Select
            name="defaultDueDate"
            value={defaultDueDate}
            onChange={(e) => { handleChange(e); setDefaultDueDate(e.target.value); }}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Due Date</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={12}>
        <Typography variant="subtitle1" sx={{ color: "#575555" }}>Invoice CC</Typography>
          <TextField
            fullWidth
            type="email"
            sx={{ width: "90%" }}
            name="invoice_cc"
            onChange={(e) => { handleChange(e); setInvoiceCC(e.target.value) }}
            margin="normal"
            value={invoice_cc}
            placeholder="Invoice CC"
          />
        </Grid>
        <Grid item xs={12} md={12}>
        <Typography variant="subtitle1" sx={{ color: "#575555" }}>Invoice BCC</Typography>
          <TextField
            fullWidth
            type="email"
            sx={{ width: "90%" }}
            name="invoice_bcc"
            onChange={(e) => { handleChange(e); setinvoice_bcc(e.target.value) }}
            margin="normal"
            value={invoice_bcc}
            placeholder="Invoice BCC"
          />
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center' }}>
         <Typography variant="subtitle1" sx={{ mr: 2, color: "#575555" }}>
            Late Payment Reminder
          </Typography>
          <Tooltip title={latePaymentReminder ? 'Reminder is Enabled' : 'Reminder is Disabled'}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IOSSwitch
                checked={latePaymentReminder}
                onChange={handleToggleChange}
                inputProps={{ 'aria-label': 'Late Payment Reminder' }}
              />
            </Box>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}