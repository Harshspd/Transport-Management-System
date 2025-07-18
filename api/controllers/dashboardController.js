import Shipment from '../models/Shipment.js';
import Consignee from '../models/Consignee.js';
import Consigner from '../models/Consigner.js';
import Driver from '../models/Driver.js';
import Vehicle from '../models/Vehicle.js';
import Agent from '../models/Agent.js'; 

export const getDashboardStats = async (req, res) => {
  try {
    const organizationId = req.user.organization_id;

    const [
      shipmentCount,
      consigneeCount,
      consignerCount,
      driverCount,
      vehicleCount,
      agentCount
    ] = await Promise.all([
      Shipment.countDocuments({ organization_id: organizationId }),
      Consignee.countDocuments({ organization_id: organizationId }),
      Consigner.countDocuments({ organization_id: organizationId }),
      Driver.countDocuments({ organization_id: organizationId }),
      Vehicle.countDocuments({ organization_id: organizationId }),
      Agent.countDocuments({ organization_id: organizationId }),
    ]);

   res.status(200).json({
  message: 'Dashboard data fetched successfully',
  data: {
    shipmentCount,
    consigneeCount,
    consignerCount,
    driverCount,
    vehicleCount,
    agentCount
  },
  error: false
});

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
