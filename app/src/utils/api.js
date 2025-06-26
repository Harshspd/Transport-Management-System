// Mocked backend storage object
const mockDB = {
    Consigner: [],
    Consignee: [],
    Driver: [],
    Vehicle: [],
    Provider: [],
    ServiceType: [],
    UnitWeight: [],
    Mode: []
};

// Simulate async save to backend
export const saveModalEntry = async (type, data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (mockDB[type]) {
                mockDB[type].push(data);
                resolve({ success: true, data });
            } else {
                resolve({ success: false, message: 'Invalid type' });
            }
        }, 500); // simulate latency
    });
};

// Simulate async fetch from backend
export const getModalEntries = async (type) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockDB[type] || []);
        }, 500);
    });
};
