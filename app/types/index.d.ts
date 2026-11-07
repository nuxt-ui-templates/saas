import type { AccordionItem, BadgeProps, ButtonProps, PageCardProps, PageFeatureProps, PricingPlanProps, UserProps } from '@nuxt/ui'

// Nuxt Content v4 generates one data type for the whole `content/` directory, inferred from the
// documents, so every field is optional and string enums (button colors, variants, orientation)
// widen to `string`. These describe the YAML pages and posts with Nuxt UI's prop types instead.

interface PageHeader {
  title: string
  description: string
  seo?: { title?: string, description?: string }
}

export interface IndexPage extends PageHeader {
  hero: { links: ButtonProps[] }
  sections: (PageHeader & {
    id: string
    orientation?: 'vertical' | 'horizontal'
    reverse?: boolean
    features: PageFeatureProps[]
  })[]
  features: PageHeader & { items: PageCardProps[] }
  testimonials: PageHeader & {
    headline?: string
    items: { quote: string, user: UserProps }[]
  }
  cta: PageHeader & { links: ButtonProps[] }
}

export interface PricingPage extends PageHeader {
  plans: (Omit<PricingPlanProps, 'price'> & { price: { month: string, year: string } })[]
  logos: { title: string, icons: string[] }
  faq: PageHeader & { items: AccordionItem[] }
}

export interface BlogPost extends PageHeader {
  date: string
  image: { src: string }
  badge: BadgeProps
  authors: (UserProps & { name: string, to: string })[]
}
