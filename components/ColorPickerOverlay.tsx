
import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerOverlayProps {
  onClose: () => void;
}

const ColorPickerOverlay: React.FC<ColorPickerOverlayProps> = ({ onClose }) => {
  const [color, setColor] = useState('#FFFFFF');
  const [rgb, setRgb] = useState('255, 255, 255');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          requestRef.current = requestAnimationFrame(updateColor);
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const updateColor = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    
    if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
      // Sample a small 10x10 area in the center to get a more stable color
      const sampleSize = 10;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      
      const centerX = video.videoWidth / 2 - sampleSize / 2;
      const centerY = video.videoHeight / 2 - sampleSize / 2;
      
      context.drawImage(video, centerX, centerY, sampleSize, sampleSize, 0, 0, sampleSize, sampleSize);
      
      const imageData = context.getImageData(0, 0, sampleSize, sampleSize).data;
      
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }
      
      const count = imageData.length / 4;
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
      setColor(hex);
      setRgb(`${r}, ${g}, ${b}`);
    }
    
    requestRef.current = requestAnimationFrame(updateColor);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    // Simple visual feedback could be added here
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Target Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-white rounded-full shadow-lg"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/50"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/50"></div>
            <div 
              className="absolute inset-2 rounded-full border border-black/20 shadow-inner transition-colors duration-200"
              style={{ backgroundColor: color }}
            ></div>
          </div>
        </div>

        {/* Top UI */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
           <button onClick={onClose} className="bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-500 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
           <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
             Детектор цвета
           </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-slate-900 p-8 rounded-t-[40px] -mt-10 relative z-10 border-t border-slate-700">
        <div className="flex items-center gap-6 mb-8">
          <div 
            className="w-20 h-20 rounded-3xl border-4 border-slate-800 shadow-2xl transition-colors duration-200"
            style={{ backgroundColor: color }}
          ></div>
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Текущий цвет</span>
            <h3 className="text-white font-black text-3xl tracking-tight mb-1">{color}</h3>
            <p className="text-slate-400 text-sm font-mono">RGB: {rgb}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={copyToClipboard}
            className="bg-white text-slate-900 font-bold py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Копировать HEX
          </button>
          <button 
            className="bg-slate-800 text-white font-bold py-4 rounded-2xl border border-slate-700 active:scale-95 transition-all"
          >
            Сохранить в палитру
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerOverlay;
