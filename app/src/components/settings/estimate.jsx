import React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, Grid, TextField, Divider } from "@mui/material";
import { Box } from "@mui/material";
import { getAccountById, updateAccount } from "../../actions/settingAction";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

export default function Estimate() {
  const [estimateSettings, setEstimateSettings] = useState({});
  const [heading, setHeading] = useState('');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [id, setId] = useState("");
  const [accountDetails, setAccountDetails] = useState({});
  const [datachange, setDatachange] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [error, setError] = useState('');

  const validateAndSavePrefix = (e) => {
    const value = e.target.value;

    if (value.length > 10) {
      setError('Prefix cannot exceed 10 characters');
      return;
    } else {
      setError('');
    }

    setPrefix(value);
    handleChange(e);
  };

  const fetchClientData = async () => {
    try {
      const clientDataById = await getAccountById(id);
      if (clientDataById) {
        setAccountDetails(clientDataById);
        setEstimateSettings(clientDataById?.estimateSettings || {});
        setHeading(clientDataById?.estimateSettings?.heading || '');
        setNotes(clientDataById?.estimateSettings?.notes || '');
        setTerms(clientDataById?.estimateSettings?.terms || '');
        setPrefix(clientDataById?.estimateSettings?.prefix);
        setLoaded(true);
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

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setEstimateSettings(prevSettings => ({
      ...prevSettings,
      [e.target.name]: e.target.value
    }));
    setDatachange(true);
    setSaving(true);
    setSavingMessage(true);
  };

  const handleMouseLeave = () => {
    if (datachange && loaded) {
      dispatch(updateAccount({ ...accountDetails, client_id: id, estimateSettings: estimateSettings }));
      setSaving(false);
      setTimeout(() => {
        setSavingMessage(false);
      }, 1000);
      setDatachange(false);
    }
  };

  return (
    <Box onMouseLeave={handleMouseLeave}>
      <Box sx={{ display: "flex", justifyContent: "left", gap: "20px", alignContent: "center" }}>
        <Typography variant="h2" sx={{ mb: 3, color: "#575555", fontWeight: '400' }}>
          Estimate settings
        </Typography>

        {savingMessage && (
          <Box sx={{ alignContent: "center", mb:2 }}>
            {saving ? (
              <span style={{ color: "#1976d2", fontSize: "large", fontWeight: "bold" }}>
                Unsaved Changes<PendingIcon sx={{ verticalAlign: "middle" }} />
              </span>
            ) : (
              <span style={{ color: "#1976d2", fontSize: "large", fontWeight: "bold" }}>
                Saved<CheckCircleIcon sx={{ verticalAlign: "middle" }} />
              </span>
            )}
          </Box>
        )}
      </Box>
     <Divider sx={{ mb: 4 }} />


      <Typography sx={{ color: "black" }}>
        Default Heading Notes and Terms for estimates:
      </Typography>
      
      <Typography sx={{ mb:2, color: "grey" }}>
        (leave blank if you do not want default text)
      </Typography>

      <Grid item xs={12} md={12}>
      <Typography variant="subtitle1" sx={{ color: "#575555" }}>
          Prefix
        </Typography>
        <TextField
          fullWidth
          sx={{ width: "90%" }}
          name="prefix"
          onChange={validateAndSavePrefix}
          margin="normal"
          rows={4}
          value={prefix}
          placeholder="prefix"
          error={!!error}
          helperText={error}
        />
      </Grid>

      <Grid item xs={12} md={12}>
      <Typography variant="subtitle1" sx={{ color: "#575555" }}>
          Heading
        </Typography>
        <TextField
          sx={{ width: "90%" }}
          name="heading"
          autoComplete="false"
          onChange={(e) => { handleChange(e); setHeading(e.target.value); }}
          margin="normal"
          multiline
          value={heading}
          rows={4}
          placeholder="Default Heading"
        />
      </Grid>

      <Grid item xs={12} md={12}>
      <Typography variant="subtitle1" sx={{ color: "#575555" }}>
          Notes
        </Typography>
        <TextField
          fullWidth
          sx={{ width: "90%" }}
          name="notes"
          onChange={(e) => { handleChange(e); setNotes(e.target.value); }}
          margin="normal"
          value={notes}
          multiline
          rows={4}
          placeholder="Notes"
        />
      </Grid>

      <Grid item xs={12} md={12}>
      <Typography variant="subtitle1" sx={{ color: "#575555" }}>
          Terms
        </Typography>
        <TextField
          fullWidth
          sx={{ width: "90%" }}
          name="terms"
          onChange={(e) => { handleChange(e); setTerms(e.target.value); }}
          margin="normal"
          multiline
          rows={4}
          value={terms}
          placeholder="Terms & conditions"
        />
      </Grid>
    </Box>
  );
}