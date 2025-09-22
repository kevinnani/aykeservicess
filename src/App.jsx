// import React, { useState } from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable"; // ✅ import correctly
// import "./App.css";

// const categories = {
//   Vegetables: [
//     { id: 1, en: "Tomato", hi: "टमाटर", te: "టమోటా", price: 30 },
//     { id: 2, en: "Potato", hi: "आलू", te: "బంగాళాదుంప", price: 40 },
//     { id: 3, en: "Onion", hi: "प्याज", te: "ఉల్లి", price: 25 },
//   ],
//   Groceries: [
//     { id: 4, en: "Rice", hi: "चावल", te: "బియ్యం", price: 60 },
//     { id: 5, en: "Wheat", hi: "गेहूं", te: "గోధుమలు", price: 45 },
//   ],
//   Drinks: [
//     { id: 6, en: "Coke", hi: "कोक", te: "కోక్", price: 40 },
//     { id: 7, en: "Pepsi", hi: "पेप्सी", te: "పెప్సి", price: 40 },
//   ],
//   Meat: [{ id: 8, en: "Mutton", hi: "मटन", te: "మటన్", price: 600 }],
//   Chicken: [{ id: 9, en: "Chicken", hi: "चिकन", te: "కోడి మాంసం", price: 250 }],
//   Fish: [{ id: 10, en: "Fish", hi: "मछली", te: "చేప", price: 300 }],
// };

// function App() {
//   const [selectedCategory, setSelectedCategory] = useState(
//     Object.keys(categories)[0]
//   );
//   const [selectedItems, setSelectedItems] = useState({});
//   const [customerName, setCustomerName] = useState("");
//   const [message, setMessage] = useState("");

//   // ✅ Toggle selection
//   const toggleItem = (cat, item) => {
//     const key = `${cat}-${item.id}`;
//     setSelectedItems((prev) => {
//       if (prev[key]) {
//         const copy = { ...prev };
//         delete copy[key];
//         return copy;
//       }
//       return {
//         ...prev,
//         [key]: {
//           ...item,
//           qty: 1,
//           price: item.price ?? 0,
//           unit: "kg",
//         },
//       };
//     });
//   };

//   // ✅ Update qty/price/unit
//   const updateItemField = (key, field, value) => {
//     setSelectedItems((prev) => ({
//       ...prev,
//       [key]: { ...prev[key], [field]: value },
//     }));
//   };

//   // ✅ Generate PDF
//   const generatePDF = () => {
//     const items = Object.values(selectedItems);
//     if (items.length === 0) {
//       setMessage("Please select at least one item before downloading PDF.");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }

//     const doc = new jsPDF({ unit: "pt", format: "a4" });
//     doc.setFontSize(18);
//     doc.text("Grocery Bill", 40, 50);

//     doc.setFontSize(11);
//     doc.text(`Customer: ${customerName || "Guest"}`, 40, 75);
//     doc.text(`Date: ${new Date().toLocaleString()}`, 40, 92);

//     const body = items.map((it, idx) => {
//       const qty = Number(it.qty) || 0;
//       const price = Number(it.price) || 0;
//       const total = qty * price;
//       return [
//         idx + 1,
//         it.en,
//         it.hi,
//         it.te,
//         `${qty} ${it.unit}`,
//         price.toFixed(2),
//         total.toFixed(2),
//       ];
//     });

//     autoTable(doc, {
//       startY: 110,
//       head: [["#", "EN", "HI", "TE", "Qty", "Price (₹)", "Total (₹)"]],
//       body,
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//     });

//     const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 110;
//     const grandTotal = body.reduce((s, r) => s + parseFloat(r[6]), 0);

//     doc.setFontSize(12);
//     doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 40, finalY + 25);
//     doc.setFontSize(10);
//     doc.text("Thank you for your purchase!", 40, finalY + 55);

//     doc.save("grocery-bill.pdf");
//     setMessage("PDF downloaded");
//     setTimeout(() => setMessage(""), 3000);
//   };

//   // ✅ Share order
//   const shareOrder = async () => {
//     const items = Object.values(selectedItems);
//     if (items.length === 0) {
//       setMessage("Please select items before sharing.");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }
//     let text = `🛒 Grocery Order\nCustomer: ${
//       customerName || "Guest"
//     }\nDate: ${new Date().toLocaleString()}\n\n`;
//     let grand = 0;
//     items.forEach((it, idx) => {
//       const qty = Number(it.qty) || 0;
//       const price = Number(it.price) || 0;
//       const total = qty * price;
//       grand += total;
//       text += `${idx + 1}. ${it.en} (${it.hi}, ${it.te}) — ${qty} ${
//         it.unit
//       } × ₹${price} = ₹${total}\n`;
//     });
//     text += `\nGrand Total: ₹${grand.toFixed(2)}`;

//     if (navigator.share) {
//       try {
//         await navigator.share({ title: "Grocery Order", text });
//         setMessage("Shared successfully");
//       } catch {
//         setMessage("Share cancelled");
//       }
//     } else {
//       try {
//         await navigator.clipboard.writeText(text);
//         setMessage("Order copied to clipboard");
//       } catch {
//         setMessage("Copy failed.");
//       }
//     }
//     setTimeout(() => setMessage(""), 3000);
//   };

//   const keyFor = (cat, item) => `${cat}-${item.id}`;
//   return (
//     <div className="app">
//       <header className="header">
//         {Object.keys(categories).map((cat) => (
//           <button
//             key={cat}
//             className={selectedCategory === cat ? "active" : ""}
//             onClick={() => setSelectedCategory(cat)}
//           >
//             {cat}
//           </button>
//         ))}
//       </header>

//       <main className="container">
//         <div className="top-row">
//           <div>
//             <label>Customer name</label>
//             <input
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//               placeholder="Enter customer name"
//             />
//           </div>
//           <div className="actions-inline">
//             <button onClick={generatePDF} className="btn primary">
//               Download PDF
//             </button>
//             <button onClick={shareOrder} className="btn">
//               Share order
//             </button>
//           </div>
//         </div>

//         <section className="items-panel">
//           <h3>{selectedCategory}</h3>
//           <div className="items-list">
//             {categories[selectedCategory].map((it) => {
//               const key = keyFor(selectedCategory, it);
//               const selected = selectedItems[key];
//               return (
//                 <div className="item-row" key={key}>
//                   <div className="col check">
//                     <input
//                       type="checkbox"
//                       checked={!!selected}
//                       onChange={() => toggleItem(selectedCategory, it)}
//                     />
//                   </div>

//                   <div className="col name">
//                     <div className="en">{it.en}</div>
//                     <div className="sub">
//                       {it.hi} • {it.te}
//                     </div>
//                   </div>

//                   <div className="col input">
//                     <label>Qty</label>
//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={selected ? selected.qty : ""}
//                       disabled={!selected}
//                       onChange={(e) =>
//                         updateItemField(key, "qty", Number(e.target.value))
//                       }
//                     />
//                   </div>

//                   <div className="col input">
//                     <label>Unit</label>
//                     <select
//                       value={selected ? selected.unit : "kg"}
//                       disabled={!selected}
//                       onChange={(e) => updateItemField(key, "unit", e.target.value)}
//                     >
//                       <option value="kg">Kg</option>
//                       <option value="box">Box</option>
//                       <option value="ltr">Liter</option>
//                       <option value="pcs">Pcs</option>
//                     </select>
//                   </div>

//                   <div className="col input">
//                     <label>Price (₹)</label>
//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={selected ? selected.price : ""}
//                       disabled={!selected}
//                       onChange={(e) =>
//                         updateItemField(key, "price", Number(e.target.value))
//                       }
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         <section className="summary">
//           <h3>Selected Items</h3>
//           <div className="summary-list">
//             {Object.keys(selectedItems).length === 0 && (
//               <div className="empty">No items selected</div>
//             )}

//             {Object.entries(selectedItems).map(([key, it]) => {
//               const qty = Number(it.qty) || 0;
//               const price = Number(it.price) || 0;
//               return (
//                 <div key={key} className="summary-row">
//                   <div>{it.en}</div>
//                   <div>
//                     {qty} {it.unit} × ₹{price.toFixed(2)} = ₹
//                     {(qty * price).toFixed(2)}
//                   </div>
//                 </div>
//               );
//             })}

//             {Object.keys(selectedItems).length > 0 && (
//               <div className="grand">
//                 Grand Total: ₹
//                 {Object.values(selectedItems)
//                   .reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0)
//                   .toFixed(2)}
//               </div>
//             )}
//           </div>
//         </section>

//         {message && <div className="toast">{message}</div>}
//       </main>
//     </div>
//   );
// }

// export default App;



// App.jsx
import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ import
import "./App.css";
import { FaCarrot, FaFish, FaDrumstickBite, FaAppleAlt } from "react-icons/fa";
import { GiChicken, GiMeat } from "react-icons/gi";

const categories = {
  Vegetables: [
    { id: 1, en: "Tomato", te: "Tamota", hi: "Tamatar" },
    { id: 2, en: "Potato", te: "Bangala dumpa", hi: "Aloo" },
    { id: 3, en: "Onion", te: "Ulli", hi: "Pyaj" },
  ],
  Groceries: [
    { id: 4, en: "Rice", te: "Biyyam", hi: "Chawal" },
    { id: 5, en: "Wheat", te: "Godhumalu", hi: "Gehu" },
  ],
  Drinks: [
    { id: 6, en: "Coke", te: "Coke", hi: "Coke" },
    { id: 7, en: "Pepsi", te: "Pepsi", hi: "Pepsi" },
  ],
  Meat: [{ id: 8, en: "Mutton", te: "Mutton", hi: "Mutton" }],
  Chicken: [{ id: 9, en: "Chicken", te: "Kodi mamsam", hi: "Chicken" }],
  Fish: [{ id: 10, en: "Fish", te: "Chepa", hi: "Machhli" }],
};

// mapping category to icon
const categoryIcons = {
  Vegetables: <FaCarrot />,
  Groceries: <FaAppleAlt />,
  Drinks: <FaDrumstickBite />,
  Meat: <GiMeat />,
  Chicken: <GiChicken />,
  Fish: <FaFish />,
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(categories)[0]);
  const [selectedItems, setSelectedItems] = useState({});
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Toggle item selection
  const toggleItem = (cat, item) => {
    const key = `${cat}-${item.id}`;
    setSelectedItems((prev) => {
      if (prev[key]) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return {
        ...prev,
        [key]: { ...item, qty: "", price: "", unit: "kg" },
      };
    });
  };

  // ✅ Update field
  const updateItemField = (key, field, value) => {
    setSelectedItems((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };
// ✅ PDF download
const generatePDF = () => {
  const items = Object.values(selectedItems);
  if (items.length === 0) {
    setMessage("Please select at least one item before downloading PDF.");
    setTimeout(() => setMessage(""), 3000);
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFontSize(18);
  doc.text("Grocery Bill", 40, 50);

  doc.setFontSize(11);
  doc.text(`Employee Name: ${customerName || "Guest"}`, 40, 75);
  doc.text(`Date: ${new Date().toLocaleString()}`, 40, 92);

  const body = items.map((it, idx) => {
    const qty = Number(it.qty) || 0;
    const price = Number(it.price) || 0;
    return [
      idx + 1,
      it.en,
      it.hi,
      it.te,
      `${qty} ${it.unit}`,
      price.toFixed(2),   // ✅ Take price directly
      price.toFixed(2),   // ✅ Total is same as price (no multiplication)
    ];
  });

  autoTable(doc, {
    startY: 110,
    head: [["#", "English", "Hindi", "Telugu", "Qty", "Price (₹)", "Total (₹)"]],
    body,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 110;
  const grandTotal = body.reduce((s, r) => s + parseFloat(r[6]), 0); // ✅ sum of prices only

  doc.setFontSize(12);
  doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 40, finalY + 25);
  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 40, finalY + 55);

  doc.save("grocery-bill.pdf");
  setMessage("PDF downloaded");
  setTimeout(() => setMessage(""), 3000);
};

  const keyFor = (cat, item) => `${cat}-${item.id}`;
  return (
    <div className="app">
      {/* Header */}
      <header className="h_nav">
       <header className="header">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
          >
            <span className="icon">{categoryIcons[cat]}</span>
            {cat}
          </button>
        ))}
      </header>
      </header>

      <main className="container">
        <div className="top-row">
          <div>
            <label>Employee Name </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter Employee name"
            />
          </div>
          <div className="actions-inline">
            <button onClick={generatePDF} className="btn primary">
              Download PDF
            </button>
          </div>
        </div>

        <section className="items-panel">
          <h3>{selectedCategory}</h3>
          <div className="items-list">
            {categories[selectedCategory].map((it) => {
              const key = keyFor(selectedCategory, it);
              const selected = selectedItems[key];
              return (
                <div className="item-row" key={key}>
                  <div className="col check">
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => toggleItem(selectedCategory, it)}
                    />
                  </div>

                  <div className="col name">
                    <div className="en">{it.en}</div>
                    <div className="sub">
                      {it.hi} / {it.te}
                    </div>
                  </div>

                  <div className="col input">
                    <label>Qty</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={selected ? selected.qty : ""}
                      disabled={!selected}
                      onChange={(e) => updateItemField(key, "qty", e.target.value)}
                    />
                  </div>

                  <div className="col input">
                    <label>Unit</label>
                    <select
                      value={selected ? selected.unit : "kg"}
                      disabled={!selected}
                      onChange={(e) => updateItemField(key, "unit", e.target.value)}
                    >
                      <option value="kg">Kg</option>
                      <option value="box">Box</option>
                      <option value="ltr">Liter</option>
                      <option value="pcs">Pcs</option>
                    </select>
                  </div>

                  <div className="col input">
                    <label>Price </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={selected ? selected.price : ""}
                      disabled={!selected}
                      onChange={(e) => updateItemField(key, "price", e.target.value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="summary">
          <h3>Selected Items</h3>
          <div className="summary-list">
            {Object.keys(selectedItems).length === 0 && (
              <div className="empty">No items selected</div>
            )}

            {Object.entries(selectedItems).map(([key, it]) => {
              const qty = Number(it.qty) || 0;
              const price = Number(it.price) || 0;
              return (
                <div key={key} className="summary-row">
                  <div>{it.en}</div>
                  <div>
                    {/* {qty} {it.unit} × {price.toFixed(2)} =  */}
                    {/* {(qty * price).toFixed(2)} */}
                    {price}
                  </div>
                </div>
              );
            })}

            {Object.keys(selectedItems).length > 0 && (
              <div className="grand">
                Grand Total: 
                {Object.values(selectedItems)
                  .reduce(
                    (sum, i) => sum +  (Number(i.price) || 0),
                    0
                  )
                  .toFixed(2)}
              </div>
            )}
          </div>
        </section>

        {message && <div className="toast">{message}</div>}
      </main>
    </div>
  );
}

export default App;
