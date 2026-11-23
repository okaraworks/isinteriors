import { ButtonLink } from '../components/ui/Button'
import { Seo } from '../components/ui/Seo'

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center pt-32 pb-24">
      <Seo title="Page not found" path="/404" noindex />
      <div className="container-editorial">
        <p className="eyebrow">404</p>
        <h1 className="mt-6 text-display-lg">
          This room
          <br />
          <em className="text-taupe">does not exist.</em>
        </h1>
        <p className="mt-8 max-w-md text-ink-soft">The page you were looking for may have moved. Start again from the home page or explore our designs.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/">Back to home</ButtonLink>
          <ButtonLink to="/designs" variant="outline">
            Explore Our Designs
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
