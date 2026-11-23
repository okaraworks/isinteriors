import { BeforeAfter } from '../components/sections/BeforeAfter'
import { Collections } from '../components/sections/Collections'
import { ConsultationCTA } from '../components/sections/ConsultationCTA'
import { Hero } from '../components/sections/Hero'
import { InstagramGallery } from '../components/sections/InstagramGallery'
import { Intro } from '../components/sections/Intro'
import { Portfolio } from '../components/sections/Portfolio'
import { ServicesIndex } from '../components/sections/ServicesIndex'
import { Testimonials } from '../components/sections/Testimonials'
import { Tools } from '../components/sections/Tools'
import { Seo, studioJsonLd } from '../components/ui/Seo'

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={studioJsonLd()} />
      <Hero />
      <Intro />
      <ServicesIndex />
      <Collections />
      <Portfolio />
      <BeforeAfter />
      <Tools />
      <ConsultationCTA />
      <Testimonials />
      <InstagramGallery />
    </>
  )
}
