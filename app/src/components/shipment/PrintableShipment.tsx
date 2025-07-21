import React, { forwardRef } from "react";
import { Shipment } from "@/types/shipment";

const PrintableShipment = forwardRef<HTMLDivElement, { shipment: Shipment }>(
  ({ shipment }, ref) => (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: "210mm", // Ensures it never exceeds A4
        maxHeight: "297mm",
        overflow: "hidden",
        margin: "0 auto",
        padding: 0,
        background: "#fff",
        color: "#222",
        fontFamily: "Arial, sans-serif",
        fontSize: 12,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 2 }}>SRD LOGISTICS</div>
          <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>
            3 OM CHAMBER, KHASRA NO. 15/3/3/3, SRD LOGISTICS<br />
            VILLAGE NANHERA, AMBALA CANTT-133 004<br />
            HARYANA. Email: srdlogisticsumb@gmail.com (M): 8307924548
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ fontWeight: 600 }}>Ambala Jurisdiction Only</div>
          <div style={{ fontWeight: 600 }}>
            GSTIN : <span style={{ fontWeight: 400 }}>06AGNPA6109K1ZF</span>
          </div>
        </div>
      </div>

      <div style={{ borderBottom: "2px solid #222", margin: "8px 0 12px 0" }} />

      {/* Top Row Inputs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
        {/* Left: Consigner/Consignee stacked */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", gap: 5, marginBottom: '4px', alignItems: 'center' }}>
            <div style={{ border: "1px solid #888", padding: '4px 2px', fontWeight: 600, borderRadius: '3px', minWidth: '70px' }}>Consigner</div>
            <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px' }}>
              {shipment?.consigner?.name}
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: '4px' }}>
            <div style={{ border: "1px solid #888", padding: '4px 2px', fontWeight: 600, borderRadius: '3px', minWidth: '70px' }}>Consignee</div>
            <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px' }}>
              {shipment?.consignee?.name}
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: '4px' }}>
            <div style={{ border: "1px solid #888", padding: '4px 2px', fontWeight: 600, borderRadius: '3px', minWidth: '70px' }}>GST No.</div>
            <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px' }}>{shipment?.consignee?.gstin}
            </div>
          </div>
        </div>
        {/* Right: Details in column */}
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: '4px' }}>
              <div style={{ fontWeight: 600, width: '60px', border: "1px solid #888", padding: '4px 2px', borderRadius: '3px' }}>Date</div>
              <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px', height: '30px' }}>
                {shipment?.consignee?.createdAt ? new Date(shipment?.consignee?.createdAt).toLocaleDateString() : ""}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5, marginBottom: '4px' }}>
              <div style={{ fontWeight: 600, width: '60px', border: "1px solid #888", padding: '4px 2px', borderRadius: '3px' }}>G.R. No.</div>
              <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px', height: '30px' }}>{shipment?.bility_no}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: '4px' }}>
              <div style={{ fontWeight: 600, width: '60px', border: "1px solid #888", padding: '4px 2px', borderRadius: '3px' }}>Bill No.</div>
              <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px', height: '30px' }}>
                {shipment?.goods_details?.bill_no}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5, marginBottom: '4px' }}>
              <div style={{ fontWeight: 600, width: '60px', border: "1px solid #888", padding: '4px 2px', borderRadius: '3px' }}>From</div>
              <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px', height: '30px' }}>Ambala</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: '4px' }}>
              <div style={{ fontWeight: 600, width: '60px', border: "1px solid #888", padding: '4px 2px', borderRadius: '3px' }}>Value</div>
              <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px', height: '30px' }}>
                {shipment?.goods_details?.bill_value}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5, marginBottom: '4px' }}>
              <div style={{ fontWeight: 600, width: '60px', border: "1px solid #888", padding: '4px 2px', borderRadius: '3px' }}>To</div>
              <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', minWidth: '150px', height: '30px' }}>
                {shipment?.delivery_location}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: "column", gap: 5 }}>
          <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', width: "130px", textAlign: "center", fontWeight: 600, height: '50px' }} >PACKAGES</div>
          <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', height: '190px', textAlign: 'center' }} >{shipment?.goods_details?.quantity}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: "column", gap: 5 }}>
          <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', width: "200px", textAlign: "center", fontWeight: 600, height: '50px' }} >DESCRIPTION <br /> <span>(Said to Contain)</span></div>
          <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', height: '190px', textAlign: 'center', position: 'relative' }}>
                {shipment?.goods_details?.description}
                <span style={{ position: 'absolute', bottom: '10px', left: '20px'}}> Vehicle No. {shipment?.vehicle?.vehicle_number}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: "column", gap: 5 }}>
          <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', width: "160px", textAlign: "center", fontWeight: 600, height: '50px' }} >
            WEIGHT (K.G)
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <span style={{ fontSize: '10px' }}>Actual</span>
              <span style={{ fontSize: '10px' }}>Charged</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ border: "1px solid #888", borderRadius: '3px', width: "80px", height: '190px', textAlign: 'center' }} >{shipment?.goods_details?.actual_weight}</div>
            <div style={{ border: "1px solid #888", borderRadius: '3px', width: "80px", height: '190px', textAlign: 'center' }} >{shipment?.goods_details?.actual_dimensions}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: "column", gap: 5 }}>
          <div style={{ border: "1px solid #888", padding: '4px 2px', borderRadius: '3px', width: "170px", textAlign: "center", fontWeight: 600, height: '50px' }} >
            FREIGHT DETAILS
            <div style={{ display: "flex", gap: 5 }}>
              <div style={{ display: 'flex', fontSize: '10px', gap: 3 }}>To Pay <div style={{ border: "1px solid #888", borderRadius: '3px', width: '20px', height: '15px', marginTop: '8px' }}></div></div>
              <div style={{ display: 'flex', fontSize: '10px', gap: 3 }}>Paid <div style={{ border: "1px solid #888", borderRadius: '3px', width: '20px', height: '15px', marginTop: '8px' }}></div></div>
              <div style={{ display: 'flex', fontSize: '10px', gap: 3 }}>T.B.B <div style={{ border: "1px solid #888", borderRadius: '3px', width: '20px', height: '15px', marginTop: '8px' }}></div></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: '4px' }}>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px", textAlign: "right" }} >FREIGHT</div>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px" }} ></div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: '4px' }}>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px", textAlign: "right" }} >S.CHARGE</div>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px" }} ></div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: '4px' }}>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px", textAlign: "right" }} >CARTAGE</div>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px" }} ></div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: '4px' }}>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px", textAlign: "right" }} >GST</div>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px" }} ></div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: '4px' }}>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px", textAlign: "right" }} >TOTAL</div>
            <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', width: "85px", height: "30px" }} ></div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: 'space-between' }}>
        <div>
          <div style={{ border: "1px solid #888", borderRadius: '3px', padding: '4px 2px', position: "relative", width: '450px', height: '55px', marginTop: '10px' }}>
            <div style={{ height: '22px' }}>Delivery at:</div>
            <div style={{ background: "#464646", height: '22px', color: '#fff', position: 'absolute', bottom: '0', left: 0, paddingLeft: '10px' }}>Please Inform booking office if the consignee does not take delivery within 7 days.</div>
          </div>

          {/* <div style={{ display: "flex", width: '550px', height: '60px', marginTop: '10px' }}>
            <div style={{ fontSize: 10, color: "#444", width: '180px' }}>
              Goods booked at owner’s packing and insured. Octroi tax is to be produced as per city/consignee.
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ border: "1px solid #222", background: "#222", color: "#fff", textAlign: "center", fontWeight: 700, padding: 4, fontSize: 12 }}>
                GST TAX WILL BE PAID BY
              </div>
              <div style={{ display: "flex", border: "1px solid #888", borderTop: "none" }}>
                <div style={{ flex: 1, textAlign: "center", padding: 4, borderRight: "1px solid #888" }}>
                  <input type="checkbox" style={{ marginRight: 4 }} readOnly /> Consigner
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: 4, borderRight: "1px solid #888" }}>
                  <input type="checkbox" style={{ marginRight: 4 }} readOnly /> Consigner
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: 4, borderRight: "1px solid #888" }}>
                  <input type="checkbox" style={{ marginRight: 4 }} readOnly /> Consigner
                </div>
              </div>
            </div>
          </div> */}

          {/* <div style={{ display: "flex", width: '450px', height: '30px', marginTop: '10px' }}>
            <div style={{ fontSize: 10, color: "#444" }}>
              Goods booked at owner’s packing and insured. Octroi tax is to be produced as per city/consignee.
            </div>
          </div> */}
          {/* <div>
             <div style={{ flex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ border: "1px solid #222", background: "#222", color: "#fff", textAlign: "center", fontWeight: 700, padding: 4, fontSize: 12 }}>
                GST TAX WILL BE PAID BY
              </div>
              <div style={{  display: "flex", border: "1px solid #888", borderTop: "none", alignItems: 'center' }}>
                 <div style={{ flex: 1, padding: 4, borderRight: "1px solid #888", display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <div style={{ height: '12px', width: '12px', border: '1px solid gray', borderRadius: '2px'}}></div>
                    <div style={{ marginBottom: '10px'}}>Consigner</div>
                </div>
                <div style={{ flex: 1,padding: 4, borderRight: "1px solid #888", display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <div style={{ height: '12px', width: '12px', border: '1px solid gray', borderRadius: '2px'}}></div>
                    <div style={{ marginBottom: '10px'}}>Consignee</div>
                </div>
                <div style={{ flex: 1,padding: 4, borderRight: "1px solid #888", display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center'}}>
                    <div style={{ height: '12px', width: '12px', border: '1px solid gray', borderRadius: '2px'}}></div>
                    <div style={{ marginBottom: '10px'}}>Transporter</div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div style={{ fontWeight: 600 }}>
          For SRD LOGISTICS
          <div style={{ height: '40px', display: "flex", justifyContent: 'flex-end', flexDirection: 'column' }}>
            BOOKING CLERK
          </div>
        </div>
      </div>
      {/* --- BLANK FORM SECTION FOR PRINTED PDF --- */}
      {/* <div style={{
        marginTop: 60,
        padding: 24,
        background: '#fff',
        width: '100%',
        maxWidth: 900,
        minHeight: 600,
        fontSize: 12,
        color: '#222',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>TC No: ________________________________________________</div>
          <div>Date: <span style={{ borderBottom: '1px solid #888', minWidth: 120, display: 'inline-block' }}>&nbsp;</span></div>
        </div>
        <div style={{ display: 'flex', marginBottom: 8, gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
            <span>Date truck report:</span>
            <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 60, display: 'inline-block' }}>&nbsp;</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
            <span>Truck No:</span>
            <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 60, display: 'inline-block' }}>&nbsp;</span>
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: 8, gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
            <span>Date truck Unloaded:</span>
            <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 60, display: 'inline-block' }}>&nbsp;</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, justifyContent: 'flex-end' }}>
            <span>Out Time:</span>
            <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 60, display: 'inline-block' }}>&nbsp;</span>
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>Unloaded charges paid by driver Rs.: <span style={{ borderBottom: '1px solid #888', minWidth: 80, display: 'inline-block' }}>&nbsp;</span></div>
        <div style={{ display: 'flex', marginBottom: 8, gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <span>Cases As per LR</span>
            <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 8, minWidth: 0, display: 'block' }}>&nbsp;</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <span>Cases Physically received</span>
            <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 8, minWidth: 0, display: 'block' }}>&nbsp;</span>
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          Remarks (Shortage / Breakage / Packing condition Cold chain Product)
          <div style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, width: 230, display: 'inline-block' }}>&nbsp;</div>
          <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 650, display: 'inline-block' }}>&nbsp;</span>
          <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 650, display: 'inline-block' }}>&nbsp;</span>
          <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 650, display: 'inline-block' }}>&nbsp;</span>
          <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 650, display: 'inline-block' }}>&nbsp;</span>
          <span style={{ flex: 1, borderBottom: '1px solid #888', marginLeft: 4, minWidth: 650, display: 'inline-block' }}>&nbsp;</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          Goods Received Subject to Verification of Quantity / Qty.: <span style={{ borderBottom: '1px solid #888', width: 200, display: 'inline-block' }}>&nbsp;</span>
        </div>
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <div style={{ flex: 1 }}>Signature Transporter / Driver <span style={{ borderBottom: '1px solid #888', minWidth: 140, display: 'inline-block' }}>&nbsp;</span></div>
          <div style={{ flex: 1 }}>Signature of Party with Stamp <span style={{ borderBottom: '1px solid #888', minWidth: 120, display: 'inline-block' }}>&nbsp;</span></div>
        </div>
        <div style={{ marginBottom: 8 }}>Value : Shortage / damage : <span style={{ borderBottom: '1px solid #888', minWidth: 120, display: 'inline-block' }}>&nbsp;</span></div>
        <div style={{ border: '1px solid #888', borderRadius: 3, padding: 8, marginTop: 24, width: 350 }}>
          <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 11 }}>GRN Details (Party to fill once GRN is prepared)</div>
          <div style={{ marginBottom: 20 }}>GRN No. &amp; Date : <span style={{ borderBottom: '1px solid #888', minWidth: 120, display: 'inline-block' }}>&nbsp;</span></div>
          <div>Breakage/Damage Report to HO on  ___/___/___</div>
        </div>
      </div> */}
    </div>
  )
);

PrintableShipment.displayName = "PrintableShipment";

export default PrintableShipment;