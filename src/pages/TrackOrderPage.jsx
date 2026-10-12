import React, { useEffect } from 'react';

const TrackOrderPage = () => {
  useEffect(() => {
    window.location.replace('https://track.citypak.lk/');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-600 font-medium">Opening Citypak Tracking...</p>
      </div>
    </div>
  );
};

export default TrackOrderPage;
