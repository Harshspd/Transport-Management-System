import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Divider, Grid, Avatar, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { updateAccount, createAccount, getAccountById } from '../../actions/settingAction';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchCountries } from '../../actions/clientAction';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getLastDayByMonthNumber } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import './../../App.css';
import Application from './application';

export default function Account({closeDrawer,OnEdit}) {
  const fiscalYears = [
    { value: '1-12', label: 'Jan - Dec (1 - 12)' },
    { value: '2-1', label: 'Feb - Jan (2 - 1)' },
    { value: '3-2', label: 'Mar - Feb (3 - 2)' },
    { value: '4-3', label: 'Apr - Mar (4 - 3)' },
    { value: '5-4', label: 'May - Apr (5 - 4)' },
    { value: '6-5', label: 'Jun - May (6 - 5)' },
    { value: '7-6', label: 'Jul - Jun (7 - 6)' },
    { value: '8-7', label: 'Aug - Jul (8 - 7)' },
    { value: '9-8', label: 'Sep - Aug (9 - 8)' },
    { value: '10-9', label: 'Oct - Sep (10 - 9)' },
    { value: '11-10', label: 'Nov - Oct (11 - 10)' },
    { value: '12-11', label: 'Dec - Nov (12 - 11)' }
  ];

  const dispatch = useDispatch();
  const [edit, setEdit] = useState({});
  const [id, setId] = useState('');
  const [isLoaded, setLoaded] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [countriesData, setCountriesData] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
  const [clickCountry, setClickCountry] = useState(false);

  const validationSchema = Yup.object().shape({
    first_name: Yup.string(),
    last_name: Yup.string(),
    name:Yup.string(),
    public_email: Yup.string(),
    mobile: Yup.string(),
    site_url: Yup.string(),
    information: Yup.string(),
    address: Yup.object().shape({
      address_line_1: Yup.string(),
      address_line_2: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      postal_code: Yup.string()
    })
  });

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      gstno: '',
      panno: '',
      company_registeration_no: '',
      public_email: '',
      mobile: '',
      site_url: '',
      information: '',
      selectedCountry: '',
      currency: '',
      fiscal_year: '',
      logo: '',
      name: '',
      address: {
        address_line_1: '',
        address_line_2: '',
        city: '',
        country_id: '',
        postal_code: '',
        state: ''
      }
    },
    validationSchema: validationSchema
  });

  const [logo, setLogo] = useState(formik.values.logo || '');

  useEffect(() => {
    let storedData = localStorage.getItem('user');
    if (storedData) {
      storedData = JSON.parse(storedData);
      setId(storedData?.account_id);
    }
  }, []);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
        formik.setFieldValue('logo', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (edit) {
      formik.setValues({
        ...edit,
        logo: edit.logo || '',
        address: {
          ...edit.address
        }
      });
    }
  }, [edit]);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (id) {
        try {
          const clientDataById = await getAccountById(id);
          if (clientDataById) {
            if (clientDataById?.fiscal_year) {
              let fy =
                clientDataById?.fiscal_year?.start_month && clientDataById?.fiscal_year?.end_month
                  ? `${clientDataById?.fiscal_year?.start_month}-${clientDataById?.fiscal_year?.end_month}`
                  : null;
              clientDataById.fiscal_year = fy;
            }
            setEdit(clientDataById);
            setSelectedCountry(clientDataById.address.country_id);
            setSelectedCurrency(clientDataById.currency);
          }
        } catch (error) {
          console.error(error);
        }
      }
      setLoaded(true);
    };

    fetchAccountData();
  }, [id]);

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const countries = await fetchCountries();
        setCountriesData(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountriesData();
  }, []);

  useEffect(() => {
    if (edit) {
      formik.setValues({
        first_name: edit.first_name || '',
        last_name: edit.last_name || '',
        name: edit.name || '',
        gstno: edit.gstno || '',
        panno: edit.panno || '',
        company_registeration_no: edit?.company_registeration_no || '',
        public_email: edit?.public_email || '',
        mobile: edit?.mobile || '',
        site_url: edit?.site_url || '',
        information: edit?.information || '',
        selectedCountry: edit?.address?.country || '',
        currency: edit?.currency || '',
        fiscal_year: edit?.fiscal_year || '',
        address: {
          address_line_1: edit?.address?.address_line_1 || '',
          address_line_2: edit?.address?.address_line_2 || '',
          city: edit?.address?.city || '',
          country_id: edit?.address?.country_id || '',
          postal_code: edit?.address?.postal_code || '',
          state: edit?.address?.state || ''
        }
      });
    }
  }, [edit]);

  useEffect(() => {
    if (isLoaded) {
      setIsChanged(true);
    }
  }, [formik.values]);

  const handleInputChange = (field, value) => {
    setSavingMessage(true);
    setSaving(true);
    if (field.startsWith('address.')) {
      const addressField = field.replace('address.', '');
      setEdit((prevEdit) => ({
        ...prevEdit,
        address: {
          ...prevEdit.address,
          [addressField]: value
        }
      }));
      formik.setFieldValue(`address.${addressField}`, value);
    } else {
      setEdit((prevEdit) => ({ ...prevEdit, [field]: value }));
      formik.setFieldValue(field, value);
    }
  };

  const handleCountries = () => {
    setClickCountry(true);
  };

  const handleBlur = async (event) => {
    if (!formik.isValid) {
      toast.error('Enter Valid Data');
      return;
    }
    if (!isChanged) return;

    formik.handleBlur(event);
    let formik_value = { ...formik.values };

    if (formik_value?.fiscal_year && typeof formik_value?.fiscal_year === 'string' && formik_value?.fiscal_year.includes('-')) {
      let fy = formik_value?.fiscal_year.split('-');
      formik_value.fiscal_year = {
        start_month: Number(fy[0]),
        end_month: Number(fy[1]),
        start_day: 1,
        end_day: getLastDayByMonthNumber(fy[1])
      };
    }

    try {
      if (id) {
        formik_value._id = id;
        const result=await dispatch(updateAccount(formik_value));
        if(OnEdit) OnEdit(result.payload)
      } else {
        const clientResponse = await dispatch(createAccount(formik_value));
        if (clientResponse) {
          const newId = clientResponse.payload._id;
          localStorage.setItem('accountData', JSON.stringify(clientResponse.payload));
          setId(newId);
        }
      }
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSavingMessage(false);
      }, 1000);
      setIsChanged(false);
    } catch (error) {
      console.error('Error saving account:', error);
      toast.error('Error saving changes');
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
       {!closeDrawer && <Grid item xs={4}>
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              p: 3
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 2 }}>
              <Application />

              <Box sx={{ ml: 4, textAlign: 'start',mt: 1 }}>
                <Typography variant="caption" color="text.secondary" fontSize={16}>
                  {[
                      formik.values.first_name,
                      formik.values.last_name,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formik.values.name}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ my: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2">{formik.values.public_email || 'Not specified'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2">{formik.values.mobile || 'Not specified'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">{formik.values.address?.address_line_1 || 'Not specified'}</Typography>
                  {formik.values.address?.address_line_2 && (
                    <Typography variant="body2">{formik.values.address?.address_line_2}</Typography>
                  )}
                  <Typography variant="body2">
                    {[
                      formik.values.address?.city,
                      formik.values.address?.state,
                      formik.values.address?.postal_code,
                      countriesData.find((c) => c._id === formik.values.address?.country_id)?.name
                    ]
                      .filter(Boolean)
                      .join(', ') || 'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    GST Number
                  </Typography>
                  <Typography variant="body2">{formik.values.gstno || 'Not specified'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    PAN Number
                  </Typography>
                  <Typography variant="body2">{formik.values.panno || 'Not specified'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarTodayIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Fiscal Year
                  </Typography>
                  <Typography variant="body2">{formik.values.fiscal_year || 'Not specified'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Registration Number
                  </Typography>
                  <Typography variant="body2">{formik.values.company_registeration_no || 'Not specified'}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>}

        <Grid item xs={8} spacing={8}>
          <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "left", gap: "20px", alignContent: "center" }}>
            <Typography variant="h2" sx={{ fontWeight: '400', mb: 3, color: '#575757' }}>
              Organization Profile
            </Typography>
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company"
                  variant="outlined"
                  value={formik.values.name}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  value={formik.values.first_name}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  value={formik.values.last_name}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  value={formik.values.mobile}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={formik.values.public_email}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('public_email', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Website"
                  variant="outlined"
                  value={formik.values.site_url}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('site_url', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Info"
                  variant="outlined"
                  value={formik.values.information}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('information', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: '400', color: '#575757' }}>
              Account Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="GST No."
                  variant="outlined"
                  value={formik.values.gstno}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('gstno', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="PAN No."
                  variant="outlined"
                  value={formik.values.panno}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('panno', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Registration No."
                  variant="outlined"
                  value={formik.values.company_registeration_no}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('company_registeration_no', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="fiscal-year-label">Fiscal Year</InputLabel>
                  <Select
                    labelId="fiscal-year-label"
                    id="fiscal_year"
                    name="fiscal_year"
                    value={formik.values.fiscal_year || ''}
                    label="Fiscal Year"
                    onChange={(e) => handleInputChange('fiscal_year', e.target.value)}
                    onBlur={handleBlur}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {fiscalYears.map((year) => (
                      <MenuItem key={year.value} value={year.value} sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {year.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="currency-label">Currency</InputLabel>
                  <Select
                    labelId="currency-label"
                    value={selectedCurrency}
                    label="Currency"
                    onChange={(e) => {
                      setSelectedCurrency(e.target.value);
                      handleInputChange('currency', e.target.value);
                    }}
                    onBlur={handleBlur}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {countriesData.map((data) => (
                      <MenuItem key={data._id} value={data._id} sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {data.currency} - {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: '400', color: '#575757' }}>
              Address Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  variant="outlined"
                  value={formik.values.address.address_line_1}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('address.address_line_1', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  variant="outlined"
                  value={formik.values.address.address_line_2}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('address.address_line_2', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  variant="outlined"
                  value={formik.values.address.city}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  variant="outlined"
                  value={formik.values.address.state}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  variant="outlined"
                  value={formik.values.address.postal_code}
                  InputProps={{
                    style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }
                  }}
                  onBlur={handleBlur}
                  onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    value={selectedCountry}
                    label="Country"
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      handleInputChange('address.country_id', e.target.value);
                    }}
                    onBlur={handleBlur}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {countriesData.map((data) => (
                      <MenuItem key={data._id} value={data._id} sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
