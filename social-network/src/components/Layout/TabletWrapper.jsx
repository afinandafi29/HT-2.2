import React from 'react';

const TabletWrapper = ({ children, title = 'HAPPYY TALK App' }) => {
  return (
    <div className="tablet-container">
      <div className="ipad-frame">
        <div className="screen">
          <div className="status-bar">
            <div className="time">9:41</div>
            <div className="title">{title}</div>
            <div className="status-icons">
              <i className="fas fa-wifi"></i>
              <i className="fas fa-battery-full"></i>
            </div>
          </div>
          <div className="app-content-area">
            {children}
          </div>
          <div className="home-indicator"></div>
        </div>
      </div>

      <style>{`
        .tablet-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          perspective: 2000px;
          width: 100%;
          min-height: calc(100vh - 120px);
          background: transparent;
        }

        .ipad-frame {
          width: 100%;
          max-width: 1200px;
          height: auto;
          aspect-ratio: 16 / 11;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border-radius: 54px;
          padding: 20px;
          box-shadow: 
            0 80px 150px -50px rgba(0,0,0,0.9),
            inset 0 0 0 1px rgba(255,255,255,0.1),
            inset 0 0 20px rgba(255,255,255,0.05);
          position: relative;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          border: 12px solid #1a1a1a;
        }

        .ipad-frame::after {
          content: '';
          position: absolute;
          inset: -12px;
          border-radius: 54px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: none;
        }

        .screen {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 36px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
        }

        .status-bar {
          height: 48px;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(30px);
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          z-index: 100;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .status-bar .time {
          font-feature-settings: "tnum";
          font-variant-numeric: tabular-nums;
        }

        .status-bar .title {
          font-size: 13px;
          opacity: 0.6;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .status-icons {
          display: flex;
          gap: 15px;
          align-items: center;
          opacity: 0.9;
        }

        .app-content-area {
          flex: 1;
          overflow-y: auto;
          background: transparent;
          position: relative;
        }

        /* Normalize children for tablet view */
        .app-content-area > div {
          min-height: 100% !important;
          height: auto !important;
          background-color: transparent !important;
        }

        .home-indicator {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 35%;
          max-width: 280px;
          height: 5px;
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
          z-index: 100;
        }

        @media (max-width: 768px) {
          .tablet-container {
            padding: 10px;
          }
          .ipad-frame {
            padding: 8px;
            border-radius: 20px;
            aspect-ratio: auto;
            height: 80vh;
          }
          .screen {
            border-radius: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default TabletWrapper;
