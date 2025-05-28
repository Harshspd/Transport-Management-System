import React, { useEffect, useState } from "react";
import { styled, Button, Typography, Container, List, ListItem, ListItemText, ListItemIcon, Checkbox, Divider, FormControlLabel, Switch, ButtonGroup, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { getAccountById, updateAccount } from "../../actions/settingAction";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 33,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(26px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: 'primary',
        '&:before': {
          content: '"On"',
          display: 'block',
          padding: '4px',
          position: 'absolute',
          width: '100%',
          textAlign: 'left',
          color: '#fff',
        },
      },
    },
  },
  '& .MuiSwitch-thumb': {
    padding: "4px",
    height: '27px',
    width: "25px",
    paddingTop: "2px"
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    backgroundColor: '#6e6e6e',
    position: 'relative',
    '&:before': {
      content: '"Off"',
      display: 'block',
      padding: '5px',
      position: 'absolute',
      width: '100%',
      textAlign: 'right',
      color: '#fff',
    },
  },
}));

export default function Notification() {
  const items = [
    { id: 1, text: 'Estimate sent' },
    { id: 2, text: 'Estimate sent error' },
    { id: 3, text: 'Estimate PDF viewed' },
    { id: 4, text: 'Estimate email viewed' },
    { id: 5, text: 'Estimate sent spam' },
    { id: 6, text: 'Estimate was approved' },
    { id: 7, text: 'Invoice Sent' },
    { id: 8, text: 'Invoice Sent Error' },
    { id: 9, text: 'Estimate Email viewed' }
  ];

  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [accountDetails, setAccountDetails] = useState({});
  const [notificationSettings, setNotificationSettings] = useState({});
  const [checked, setChecked] = useState(notificationSettings?.options || []);
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hasChnaged, setHasChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);

  const Editclients = async () => {
    try {
      const clientDataById = await getAccountById(id);
      if (clientDataById) {
        setAccountDetails(clientDataById);
        setChecked(clientDataById.notificationSettings.options || []);
        setNotificationStatus(clientDataById.notificationSettings.notificationStatus);
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
    Editclients();
    setTimeout(() => setLoaded(true), 500);
  }, [id]);

  useEffect(() => {
    setNotificationSettings({
      options: checked,
      notificationStatus: notificationStatus
    });
  }, [checked, notificationStatus]);

  const handleSave = () => {
    if (!hasChnaged) return;
    dispatch(updateAccount({ ...accountDetails, client_id: id, notificationSettings: notificationSettings }));
    setSaving(false);
    setTimeout(() => {
      setSavingMessage(false);
    }, 1000);
    setHasChanged(false);
  };

  useEffect(() => {
    if (loaded) {
      setHasChanged(true);
      setSaving(true);
      setSavingMessage(true);
    }
  }, [notificationSettings]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleSelectAll = () => {
    const allIds = items.map(item => item.id);
    setChecked(allIds);
  };

  const handleUnselectAll = () => {
    setChecked([]);
  };

  return (
    <div onMouseLeave={handleSave}>
      <Box sx={{ display: "flex", justifyContent: "left", gap: "20px", alignContent: "center", mt: "10px" }}>
        <Typography variant="h2" sx={{ mb: 3, color: "#575555", fontWeight: '400' }}>
          Notifications:
        </Typography>
        {savingMessage &&
          <Box sx={{ alignContent: "center", mb: 2 }}>
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
        }
      </Box>
      <Divider/>
      <Box sx={{ paddingLeft: "20px", mt: "2px" }}>
        <FormControlLabel
          control={
            <CustomSwitch
              checked={notificationStatus}
              onChange={() => setNotificationStatus(!notificationStatus)}
              name="toggleSwitch"
            />
          }
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", paddingX: "1%" }}>
      <Typography variant="subtitle1" sx={{ color: "#575555" }}>
          Events:
        </Typography>
        <ButtonGroup>
          <Button variant="outlined" onClick={handleSelectAll}>Select All</Button>
          <Button variant="outlined" onClick={handleUnselectAll}>Unselect All</Button>
        </ButtonGroup>
      </Box>

      <List>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem button onClick={handleToggle(item.id)}>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={item.text} />
              <Checkbox
                edge="start"
                checked={checked.indexOf(item.id) !== -1}
                tabIndex={-1}
                disableRipple
              />
            </ListItem>
            {index < items.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}