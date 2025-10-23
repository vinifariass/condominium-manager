import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#2563eb',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px',
        }}
      >
        {/* SVG inline do ícone do condomínio */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path 
            d="M19 2H5C3.895 2 3 2.895 3 4V20C3 21.105 3.895 22 5 22H19C20.105 22 21 21.105 21 20V4C21 2.895 20.105 2 19 2Z" 
            stroke="white" 
            strokeWidth="1.5" 
            fill="none"
          />
          <rect x="7" y="6" width="3" height="3" fill="white" opacity="0.8" rx="0.5"/>
          <rect x="14" y="6" width="3" height="3" fill="white" opacity="0.8" rx="0.5"/>
          <rect x="7" y="11" width="3" height="3" fill="white" opacity="0.6" rx="0.5"/>
          <rect x="14" y="11" width="3" height="3" fill="white" opacity="0.6" rx="0.5"/>
          <rect x="7" y="16" width="3" height="3" fill="white" opacity="0.4" rx="0.5"/>
          <rect x="14" y="16" width="3" height="3" fill="white" opacity="0.4" rx="0.5"/>
          <rect x="11" y="18" width="2" height="2" fill="white" rx="0.2"/>
          <circle cx="12" cy="4.5" r="0.5" fill="white" opacity="0.7"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
