# Letta Consulting career and wellness portal

An interactive Next.js prototype for exploring careers, wellbeing resources and Letta Consulting services. All demonstration workflows use browser-local data. Use fictional information on a shared device.

## Run

Use Node.js 22.13 or newer and pnpm. From this checkout run `pnpm install`, then `pnpm dev`. Open the local URL printed by Next.js. Run `pnpm build` to export the complete static site to `out/`.

## Explore the demo

- On the homepage, tap a dimension or drag it onto **Your next chapter**. Continue into Discover Me.
- Search Career World, save careers, compare them and create goals with milestones in My Future.
- Build a CV or cover letter in Career Toolkit and download the PDF.
- Submit a demo session request and review it in the individual and practice portals.
- Send a school partnership enquiry and review it under Practice → Schools.
- Publish an article in Practice → Content Studio and open it in Resources.

The portal switcher and footer link to every role. Role switching simulates navigation and provides no authentication. Bookings, event registrations and payment statuses are local demonstrations. Email delivery, payments, licensed assessments and clinical records require a separate production implementation.

## Implementation

`src/app` contains the static route entry points and design system. `src/features` contains the user journeys, `src/data` contains the demonstration catalogue, and `src/lib` contains local persistence and language labels. English is the default, with sample navigation translations for isiZulu, Sesotho, Setswana and isiXhosa. Professional content remains in English pending review.

Brand and public contact details are from the supplied logo and the [official business website](https://lettaconsulting.co.za/). The Future Mix interaction takes inspiration from [Newmix](https://newmixcoffee.com/en).
