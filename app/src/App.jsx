// 'use client';
// import React, { useState } from "react";
// import ShipmentFrom from "./components/ShipmentForm";
// import AddConsignee from "./components/modals/AddConsignee";
// import AddConsigner from "./components/modals/AddConsigner";
// import AddDriver from "./components/modals/AddDriver";
// import AddVehicle from "./components/modals/AddVehicle";


// export default function App() {
//     const [modalType, setModalType] = useState(null);
//     const openModal = (type) => setModalType(type);
//     const closeModal = () => setModalType(null);

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <ShipmentFrom onOpenModal={openModal} />
//             {modalType === 'consigner' && <AddConsigner onClose={closeModal} />}
//             {modalType === 'consignee' && <AddConsignee onClose={closeModal} />}
//             {modalType === 'driver' && <AddDriver onClose={closeModal} />}
//             {modalType === 'vehicle' && <AddVehicle onClose={closeModal} />}
//         </div>
//     )

//     // return (
//     //     <Router>
//     //         <ShipmentFrom/>
//     //     </Router>
//     // )
// }