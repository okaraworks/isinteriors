import { BudgetEstimator } from '../tools/BudgetEstimator'
import { MoodboardBuilder } from '../tools/MoodboardBuilder'
import { StyleFinder } from '../tools/StyleFinder'
import { SectionHeading } from '../ui/SectionHeading'

export function Tools() {
  return (
    <div id="tools">
      <section id="style-finder" aria-labelledby="finder-title" className="py-28 sm:py-36">
        <div className="container-editorial">
          <SectionHeading
            index="06"
            eyebrow="Design style finder"
            id="finder-title"
            title={
              <>
                Find the style
                <br />
                <em className="text-taupe">that feels like you.</em>
              </>
            }
            intro="Five quick questions. We will match you to the studio collection that fits how you want to live."
          />
          <div className="mt-16">
            <StyleFinder />
          </div>
        </div>
      </section>

      <section id="moodboard" aria-labelledby="mood-title" className="bg-beige/60 py-28 sm:py-36">
        <div className="container-editorial">
          <SectionHeading
            index="07"
            eyebrow="Moodboard builder"
            id="mood-title"
            title={
              <>
                Compose your
                <br />
                <em className="text-taupe">moodboard.</em>
              </>
            }
            intro="Collect colours, materials and spaces you love. Send the board with your consultation request and we will start from it."
          />
          <div className="mt-16">
            <MoodboardBuilder />
          </div>
        </div>
      </section>

      <section id="budget" aria-labelledby="budget-title" className="py-28 sm:py-36">
        <div className="container-editorial">
          <SectionHeading
            index="08"
            eyebrow="Project budget estimator"
            id="budget-title"
            title={
              <>
                Plan your
                <br />
                <em className="text-taupe">investment.</em>
              </>
            }
            intro="An indicative range to help you plan. We confirm a detailed budget after visiting your space."
          />
          <div className="mt-16">
            <BudgetEstimator />
          </div>
        </div>
      </section>
    </div>
  )
}
