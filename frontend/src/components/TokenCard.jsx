import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';

function TokenCard({ token }) {
  const cardRef = useRef(null);

  const downloadAsPDF = () => {
    if (!cardRef.current) {
      alert('Token card not ready.');
      return;
    }

    try {
      const qrSvg = cardRef.current.querySelector('.qr-container svg');
      if (!qrSvg) {
        alert('QR Code not found.');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(qrSvg);
      const formattedDate = token.meal_date?.split('T')[0] || token.meal_date || 'N/A';
      const mealType = token.meal_type || 'N/A';
      const tokenCode = token.token || 'N/A';

      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head><title>Token</title>
          <style>
            body { display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f0fdf4; font-family:Arial; padding:20px; }
            .card { background:white; border-radius:20px; padding:40px; border:3px solid #10b981; text-align:center; max-width:380px; width:100%; }
            .header { display:flex; justify-content:space-between; margin-bottom:16px; }
            .date { font-size:13px; color:#6b7280; }
            .meal-type { background:#d1fae5; color:#065f46; font-size:12px; font-weight:700; padding:4px 16px; border-radius:20px; text-transform:uppercase; }
            .qr { padding:16px; border:1px solid #e5e7eb; border-radius:16px; display:inline-block; margin:12px 0; }
            .qr svg { width:160px; height:160px; }
            .token-code { font-size:22px; font-weight:800; color:#065f46; letter-spacing:4px; background:#f0fdf4; padding:8px 16px; border-radius:8px; display:inline-block; margin:12px 0; }
            .status { font-size:12px; color:#059669; padding-top:12px; border-top:2px solid #e5e7eb; margin-top:12px; }
            .footer { margin-top:16px; padding-top:14px; border-top:2px solid #e5e7eb; font-size:11px; color:#9ca3af; }
            .logo { font-size:13px; font-weight:700; color:#065f46; }
            @media print { body { background:white; } .card { box-shadow:none; } }
          </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <span class="date">📅 ${formattedDate}</span>
                <span class="meal-type">${mealType}</span>
              </div>
              <div class="qr">${svgData}</div>
              <div class="token-code">${tokenCode}</div>
              <div class="status">● Valid Token</div>
              <div class="footer">
                <div class="logo">🏠 RUET Female-2 Hall</div>
                <div>Smart Dining Management System</div>
              </div>
            </div>
            <script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},1000);},500);}<\/script>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 3000);

    } catch (err) {
      console.error('PDF failed:', err);
      alert('Failed to generate PDF.');
    }
  };

  const formattedDate = token.meal_date?.split('T')[0] || token.meal_date || 'N/A';
  const isUnused = token.status !== 'used';

  return (
    <div className="w-full">
      <div
        ref={cardRef}
        className="bg-white rounded-lg border border-gray-200 p-2.5 w-full hover:shadow-sm transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] text-gray-400">{formattedDate}</p>
            <p className="text-xs font-bold text-gray-800 uppercase">{token.meal_type || 'N/A'}</p>
            <p className="text-[9px] font-mono font-medium text-emerald-600">{token.token || 'N/A'}</p>
            <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-medium ${isUnused ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {isUnused ? '● Unused' : '✓ Used'}
            </span>
          </div>
          <div className="qr-container">
            <QRCodeSVG value={token.token || 'N/A'} size={50} />
          </div>
        </div>
      </div>

      {isUnused && (
        <button
          onClick={downloadAsPDF}
          className="mt-1 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[9px] font-medium py-1 rounded transition border border-emerald-200"
        >
          📄 Download PDF
        </button>
      )}
    </div>
  );
}

export default TokenCard;