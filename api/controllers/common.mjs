import Country from '../models/Country.mjs';

// TODO: rename to fetchCountries instesd of getAllCountries
// TODO: remove unused var
async function getAllCountries(req, res) {
  try {
    const countries = await Country.find({});
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// TODO: check if this getting used any where else remove
async function getCountryById(req, res) {
  res.json(res.country);
}

// TODO : After removing getCountryById rename this function with GetCountryById
async function getCountry(req, res, next) {
  // TODO: move inside try and use cost instead of let
  let country;
  try {
    country = await Country.findById(req.params.id);
    // TODO :  use ! operator
    if (country == null) {
      return res.status(404).json({ message: 'Country not found' });
    }
    // TODO : return this as json response with coutry data
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // TODO: return this as json response
  res.country = country;
  return next();
}

export { getAllCountries, getCountryById, getCountry };
