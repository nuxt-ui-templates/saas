import { defineCollection, z } from '@nuxt/content'

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])

const createBaseSchema = () => z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty()
})

const createFeatureItemSchema = () => createBaseSchema().extend({
  icon: z.string().nonempty().editor({ input: 'icon' })
})

const createLinkSchema = () => z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: 'icon' }),
  size: sizeEnum.optional(),
  trailing: z.boolean().optional(),
  target: z.string().optional(),
  color: colorEnum.optional(),
  variant: variantEnum.optional()
})

const createImageSchema = () => z.object({
  src: z.string().nonempty().editor({ input: 'media' }),
  alt: z.string().optional(),
  loading: z.enum(['lazy', 'eager']).optional(),
  srcset: z.string().optional()
})

const createLogosSchema = () => z.object({
  title: z.string().nonempty(),
  items: z.array(z.object({
    label: z.string().nonempty(),
    icon: z.string().nonempty().editor({ input: 'icon' })
  }))
})

export const collections = {
  index: defineCollection({
    source: '0.index.yml',
    type: 'page',
    schema: z.object({
      hero: z.object({
        headline: z.object({
          badge: z.string().optional(),
          label: z.string().nonempty(),
          to: z.string().nonempty(),
          target: z.string().optional()
        }),
        links: z.array(createLinkSchema()),
        command: z.string().optional()
      }),
      logos: createLogosSchema(),
      features: createBaseSchema().extend({
        headline: z.string().optional(),
        items: z.array(
          createBaseSchema().extend({
            preview: z.enum(['components', 'auth', 'typescript', 'tokens', 'accessibility', 'color-mode'])
          })
        )
      }),
      foundations: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().optional(),
        features: z.array(createFeatureItemSchema()),
        code: z.string().nonempty(),
        caption: z.string().optional()
      }),
      testimonials: z.object({
        headline: z.string().optional(),
        title: z.string().nonempty(),
        description: z.string().optional(),
        items: z.array(
          z.object({
            quote: z.string().nonempty(),
            user: z.object({
              name: z.string().nonempty(),
              description: z.string().nonempty(),
              to: z.string().optional(),
              target: z.string().optional(),
              avatar: createImageSchema()
            })
          })
        )
      }),
      cta: createBaseSchema().extend({
        links: z.array(createLinkSchema())
      })
    })
  }),
  docs: defineCollection({
    source: '1.docs/**/*',
    type: 'page'
  }),
  pricing: defineCollection({
    source: '2.pricing.yml',
    type: 'page',
    schema: z.object({
      headline: z.string().optional(),
      plans: z.array(
        z.object({
          title: z.string().nonempty(),
          description: z.string().nonempty(),
          price: z.object({
            month: z.string().nonempty(),
            year: z.string().nonempty()
          }),
          badge: z.string().optional(),
          button: createLinkSchema(),
          features: z.array(z.string().nonempty()),
          highlight: z.boolean().optional()
        })
      ),
      logos: createLogosSchema(),
      faq: createBaseSchema().extend({
        items: z.array(
          z.object({
            label: z.string().nonempty(),
            content: z.string().nonempty()
          })
        )
      })
    })
  }),
  blog: defineCollection({
    source: '3.blog.yml',
    type: 'page',
    schema: z.object({
      headline: z.string().optional()
    })
  }),
  posts: defineCollection({
    source: '3.blog/**/*',
    type: 'page',
    schema: z.object({
      image: z.object({ src: z.string().nonempty().editor({ input: 'media' }) }),
      authors: z.array(
        z.object({
          name: z.string().nonempty(),
          to: z.string().nonempty(),
          avatar: z.object({ src: z.string().nonempty().editor({ input: 'media' }) })
        })
      ),
      date: z.date(),
      badge: z.object({ label: z.string().nonempty() })
    })
  }),
  changelog: defineCollection({
    source: '4.changelog.yml',
    type: 'page',
    schema: z.object({
      headline: z.string().optional()
    })
  }),
  versions: defineCollection({
    source: '4.changelog/**/*',
    type: 'page',
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string(),
      date: z.date(),
      image: z.string()
    })
  })
}
