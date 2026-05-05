import React, { useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const LiveConsultation = () => {
    const { roomId } = useParams();
    const { dToken, profileData } = useContext(DoctorContext);
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        if (!dToken || !profileData) return;

        const initMeeting = async () => {
            // Please use your own AppID and ServerSecret here.
            // These are mock placeholders.
            const appID = 123456789; 
            const serverSecret = "mockServerSecret12345";
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId,
                profileData._id || Date.now().toString(),
                profileData.name || "Doctor"
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
                onLeaveRoom: () => {
                    navigate('/doctor-dashboard');
                }
            });
        };

        if (containerRef.current) {
            initMeeting();
        }
    }, [dToken, profileData, roomId, navigate]);

    return (
        <div className="w-full h-screen bg-slate-900 flex flex-col">
            <div className="p-4 bg-slate-800 text-white flex justify-between items-center shadow-lg">
                <h1 className="text-xl font-bold">Live Teleconsultation</h1>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/doctor-dashboard')} className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium">Back to Dashboard</button>
                    {/* Add note taking button here which opens the Prescription Builder */}
                    <button onClick={() => navigate(`/prescription-builder/${roomId}`)} className="px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors text-sm font-bold shadow-md shadow-primary/30">Write Prescription</button>
                </div>
            </div>
            <div className="flex-1 flex" ref={containerRef}>
                {/* ZegoCloud Container */}
            </div>
        </div>
    );
};

export default LiveConsultation;
