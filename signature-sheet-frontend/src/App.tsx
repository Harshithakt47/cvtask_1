
// // src/App.tsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// type RecordType = {
//   _id: string;
//   parentName: string;
//   childName: string;
// };

// function App() {
//   const [records, setRecords] = useState<RecordType[]>([]);

//   // Fetch data from backend API
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/records')
//       .then(res => setRecords(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   // Generate PDF with parent-child group and proper row-spanning
//   const generatePDF = () => {
//     const grouped: { [parent: string]: string[] } = {};

//     // Group records by parentName
//     records.forEach(record => {
//       if (!grouped[record.parentName]) {
//         grouped[record.parentName] = [];
//       }
//       grouped[record.parentName].push(record.childName);
//     });

//     const doc = new jsPDF();
//     let slNo = 1;
//     const tableBody: any[] = [];

//     // Build table body with rowSpan for parent and signature
//     Object.entries(grouped).forEach(([parentName, children]) => {
//       children.forEach((child, index) => {
//         const row: any[] = [];

//         // Serial Number
//         row.push({ content: slNo++, rowSpan: 1 });

//         // Parent Name with rowspan only in the first child row
//         if (index === 0) {
//           row.push({
//             content: parentName,
//             rowSpan: children.length,
//             styles: { valign: 'middle' }
//           });
//         }

//         // Child Name (always shown)
//         row.push(child);

//         // Signature column with rowspan only in the first child row
//         if (index === 0) {
//           row.push({
//             content: '',
//             rowSpan: children.length
//           });
//         }

//         tableBody.push(row);
//       });
//     });

//     // Create table using jsPDF-AutoTable
//     autoTable(doc, {
//       head: [['Sl No', 'Parent', 'Child', 'Sign']],
//       body: tableBody,
//       theme: 'grid',
//       styles: {
//         cellPadding: 3,
//         fontSize: 12,
//         valign: 'middle',
//         halign: 'left',
//         lineWidth: 0.1,
//         lineColor: 0
//       },
//       headStyles: {
//         fillColor: [22, 160, 133],
//         halign: 'center'
//       },
//       margin: { top: 20 },
//       didDrawPage: (data) => {
//         doc.setFontSize(14);
//         doc.text('Signature Sheet', data.settings.margin.left, 10);
//       }
//     });

//     doc.save('signature-sheet.pdf');
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Signature Sheet</h1>
//       <button onClick={generatePDF}>Download PDF</button>
//     </div>
//   );
// }

// export default App;
////////////////

// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type RecordType = {
  _id: string;
  parentName: string;
  childName: string;
};

function App() {
  const [records, setRecords] = useState<RecordType[]>([]);

  // Fetch data from backend API
  useEffect(() => {
    axios.get('http://localhost:5000/api/records')
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  }, []);

  // Generate PDF with parent-child group and proper row-spanning
  const generatePDF = () => {
    const grouped: { [parent: string]: string[] } = {};

    // Group records by parentName
    records.forEach(record => {
      if (!grouped[record.parentName]) {
        grouped[record.parentName] = [];
      }
      grouped[record.parentName].push(record.childName);
    });

    const doc = new jsPDF();
    let slNo = 1;
    const tableBody: any[] = [];

    // Build table body with rowSpan for parent and signature
    Object.entries(grouped).forEach(([parentName, children]) => {
      children.forEach((child, index) => {
        const row: any[] = [];

        // Serial Number
        row.push({ content: slNo++, rowSpan: 1 });

        // Parent Name with rowspan only in the first child row
        if (index === 0) {
          row.push({
            content: parentName,
            rowSpan: children.length,
            styles: { valign: 'middle' }
          });
        }

        // Child Name (always shown)
        row.push(child);

        // Signature column with rowspan only in the first child row
        if (index === 0) {
          row.push({
            content: '',
            rowSpan: children.length
          });
        }

        tableBody.push(row);
      });
    });

    // Create table using jsPDF-AutoTable
    autoTable(doc, {
      head: [['Sl No', 'Parent', 'Child', 'Sign']],
      body: tableBody,
      theme: 'grid',
      styles: {
        cellPadding: 3,
        fontSize: 12,
        valign: 'middle',
        halign: 'left',
        lineWidth: 0.1,
        lineColor: 0
      },
      headStyles: {
        fillColor: [22, 160, 133],
        halign: 'center'
      },
      margin: { top: 20 },
      didDrawPage: (data) => {
        // Title on each page
        doc.setFontSize(14);
        doc.text('Signature Sheet', data.settings.margin.left, 10);

        // Page number on each page (bottom right)
        const pageNumber = (doc as any).internal.getCurrentPageInfo().pageNumber;
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        const pageWidth = pageSize.getWidth();

        doc.setFontSize(10);
        doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 10);
      }
    });

    doc.save('signature-sheet.pdf');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Signature Sheet</h1>
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
}

export default App;
