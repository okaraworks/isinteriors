import { PageHero } from '../components/ui/PageHero'
import { Seo } from '../components/ui/Seo'

/** Starter privacy notice — have it reviewed for your jurisdiction before launch. */
export default function Privacy() {
  return (
    <>
      <Seo title="Privacy" path="/privacy" />
      <PageHero eyebrow="Privacy notice" lines={['Your details,']} accent="handled with care." crumbs={[{ label: 'Home', to: '/' }, { label: 'Privacy' }]} />
      <section className="pb-28">
        <div className="container-editorial max-w-3xl space-y-6 text-ink-soft [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:text-espresso">
          <p className="border border-dashed border-taupe px-4 py-3 text-xs uppercase tracking-[0.18em] text-taupe">Draft notice — review with a legal adviser and add studio contact details before launch.</p>
          <h2>What we collect</h2>
          <p>When you book a site visit or request a consultation we collect your name, phone number, email, property location and type, preferred date, project description and any photos you choose to upload.</p>
          <h2>How we use it</h2>
          <p>Only to respond to your enquiry, arrange visits and consultations, and prepare for your project. We do not sell your details or use them for unrelated marketing.</p>
          <h2>Photos</h2>
          <p>Photos are resized in your browser before upload, which also removes embedded location data. They are visible only to the studio team.</p>
          <h2>Storage and security</h2>
          <p>Enquiries are stored in Google Firebase. Access is restricted to authorised studio staff, and the database rejects any attempt to read enquiries without studio sign-in.</p>
          <h2>Analytics</h2>
          <p>With your consent we record anonymous page views (page, device type, referring website and date, with no names, IDs or IP addresses) in our own Firebase database, and may use Google Analytics for Firebase. You can decline, and the site works the same.</p>
          <h2>Your rights</h2>
          <p>You can ask us to see, correct or delete the information we hold about you at any time by contacting the studio.</p>
        </div>
      </section>
    </>
  )
}
