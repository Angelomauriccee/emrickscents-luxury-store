import { Marker } from 'react-map-gl/mapbox';

interface BeaconMarkerProps {
  longitude: number;
  latitude: number;
}

export function BeaconMarker({ longitude, latitude }: BeaconMarkerProps) {
  return (
    <Marker longitude={longitude} latitude={latitude} anchor="center">
      <div
        style={{
          position: 'relative',
          width: '60px',
          height: '60px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid var(--gold)',
            opacity: 0,
            animation: 'beaconPulse 2s ease-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid var(--gold)',
            opacity: 0,
            animation: 'beaconPulse 2s ease-out infinite',
            animationDelay: '0.75s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid var(--gold)',
            opacity: 0,
            animation: 'beaconPulse 2s ease-out infinite',
            animationDelay: '1.5s',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            background: 'var(--gold)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 0 3px rgba(201,168,76,0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-label)',
            fontSize: '9px',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            letterSpacing: '0.15em',
            whiteSpace: 'nowrap',
          }}
        >
          OGUDU MALL
        </div>
      </div>
      <style>{`
        @keyframes beaconPulse {
          0%   { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </Marker>
  );
}
