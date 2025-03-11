/* eslint-disable no-undef */
import { useState } from "react";


export const useBarcodeScanner = () => {
  const [codes, setCodes] = useState([]);
  
  const startBarcodeScanner = async () => {
    if (window.BarcodeDetector) {
      try {
        const video = document.createElement("video");
        document.body.appendChild(video);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
    
        video.srcObject = stream;
        video.play();
    
        const barcodeDetector = new BarcodeDetector({ formats: ["qr_code", "code_128"] });
    
        setInterval(async () => {
          try {
            const barcodes = await barcodeDetector.detect(video);
            if (barcodes.length > 0) {
              setCodes(barcodes);
              stream.getTracks().forEach(track => track.stop());
              video.remove();
            }
          } catch (error) {
            console.error("Ошибка сканирования:", error);
          }
        }, 500);
      } catch (error) {
        console.error("Ошибка доступа к камере:", error);
      }
    }
  }

  return {
    codes,
    startBarcodeScanner,
  }
}
