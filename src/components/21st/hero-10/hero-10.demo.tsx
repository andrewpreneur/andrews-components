// Demo from 21st.dev: Centered Hero with Image Fan (Default) by felipemenezes098. https://21st.dev/felipemenezes098/hero-10  saved 2026-11-25
import { Hero10, type Hero10Props } from './hero-10'

const values = {
  title: 'Build faster interfaces',
  titleLine2Prefix: 'with',
  titleHighlight: 'Ready-Made Blocks',
  description:
    'Compose beautiful products from accessible, production-ready UI blocks that drop straight into your codebase.',
  socialProof: 'Trusted by 2k+ product teams',
  images: [
    'https://cdn.21st.dev/assets/mirror/2f/2f52f0ddd94c14a93f42a61ff2bb8842b52b78e27051e7e0f6fb579d50a5524f.jpg',
    'https://cdn.21st.dev/assets/mirror/94/94fe535ff9ce491f4943129b6ff6b4e5c9465bb578892a2447ecdbbca1907d37.jpg',
    'https://cdn.21st.dev/assets/mirror/ce/ce27c3636cc87ff0803227125972049f68bd4e2c0c5219fa2540549464abc51c.jpg',
  ],
  imageAlts: ['Design detail', 'Product interface', 'Layout composition'],
  animation: 'subtle',
  primaryCTA: {
    ctaEnabled: true,
    text: 'Get Started',
    link: '',
    variant: 'default',
    size: 'default',
  },
  secondaryCTA: {
    ctaEnabled: true,
    text: 'How it works',
    link: '',
    variant: 'outline',
    size: 'default',
  },
} satisfies Hero10Props

export default function Hero10Example() {
  return <Hero10 {...values} />
}
