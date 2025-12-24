import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Image metadata
export const alt = 'Lizi Shaw | Speaker, Writer, Encourager'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    // Use absolute URL for the peony logo (works in production)
    const peonyLogoUrl = 'https://lizishaw.com/images/peony-logo-v4.png'

    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: '#faf8f5', // var(--color-paper)
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                {/* Decorative Border */}
                <div
                    style={{
                        position: 'absolute',
                        top: 24,
                        left: 24,
                        right: 24,
                        bottom: 24,
                        border: '2px solid #e5e2dd', // var(--color-border)
                        borderRadius: 12,
                    }}
                />

                {/* Peony Logo Mark */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: '#4a7c7c', // var(--color-accent)
                        marginBottom: 40,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={peonyLogoUrl}
                        width={140}
                        height={140}
                        alt=""
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                <div
                    style={{
                        fontSize: 72,
                        fontFamily: 'serif',
                        color: '#1a1a1a', // var(--color-ink)
                        marginBottom: 20,
                        textAlign: 'center',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Lizi Shaw
                </div>

                <div
                    style={{
                        fontSize: 32,
                        color: '#737373', // var(--color-ink-muted)
                        textAlign: 'center',
                        fontFamily: 'sans-serif',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                    }}
                >
                    Speaker · Writer · Encourager
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
