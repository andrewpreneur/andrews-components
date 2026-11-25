// Demo from 21st.dev: Editorial Collage Hero (Default) by felipemenezes098. https://21st.dev/felipemenezes098/hero-04  saved 2026-11-25
import { Hero04, type Hero04Props } from './hero-04'

const values = {
  title: 'A gallery for the work',
  titleLine2: 'you are proud of.',
  description:
    'Collect, arrange, and publish your art in a space that feels like a studio, not a spreadsheet.',
  washImage:
    'https://cdn.21st.dev/assets/mirror/a1/a17b190eb8f6463b5d28be076a83f47ac86f2a759fb2295a763ad6b8616a610b.jpg',
  primaryImage:
    'https://cdn.21st.dev/assets/mirror/83/839c9582581e0c20b8fbd2ad66e9c87c31206f709d28534d411674d10c913757.jpg',
  secondaryImage:
    'https://cdn.21st.dev/assets/mirror/18/18129f9729d7e9fd5393c61d23efb785da4320478b3a878a3e6dd084d86a229d.jpg',
  primaryAlt: 'Featured artwork',
  secondaryAlt: 'Abstract artwork',
  animation: 'subtle',
  primaryCTA: {
    ctaEnabled: true,
    text: 'Start your gallery',
    link: '',
    variant: 'default',
    size: 'default',
  },
  secondaryCTA: {
    ctaEnabled: true,
    text: 'See examples',
    link: '',
    variant: 'link',
  },
} satisfies Hero04Props

export default function Hero04Demo() {
  return <Hero04 {...values} />
}
