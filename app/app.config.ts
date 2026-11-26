export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc'
    },
    button: {
      compoundVariants: [{
        color: 'primary',
        variant: 'solid',
        class: 'text-primary-950'
      }]
    },
    badge: {
      compoundVariants: [{
        color: 'primary',
        variant: 'solid',
        class: 'text-primary-950'
      }]
    },
    header: {
      slots: {
        container: 'border-x border-default'
      }
    },
    pageHero: {
      slots: {
        root: 'border-b border-default',
        container: 'border-x border-default py-20 sm:py-28 lg:py-32',
        title: 'text-5xl sm:text-7xl lg:text-8xl tracking-tighter font-semibold leading-[0.95]',
        description: 'max-w-2xl'
      },
      variants: {
        orientation: {
          vertical: {
            wrapper: 'text-left',
            headline: 'justify-start',
            description: 'text-pretty',
            links: 'justify-start'
          }
        },
        headline: {
          true: {
            headline: 'font-mono text-sm font-normal uppercase tracking-wider text-muted gap-2.5 before:size-2 before:bg-primary'
          }
        }
      }
    },
    pageSection: {
      slots: {
        root: 'border-b border-default',
        container: 'border-x border-default',
        title: 'tracking-tighter font-semibold'
      },
      variants: {
        orientation: {
          vertical: {
            headline: 'justify-start',
            leading: 'justify-start',
            title: 'text-left',
            description: 'text-left text-pretty',
            links: 'justify-start'
          }
        },
        headline: {
          true: {
            headline: 'font-mono text-sm font-normal uppercase tracking-wider text-muted gap-2.5 before:size-2 before:bg-primary'
          }
        }
      }
    },
    pageHeader: {
      slots: {
        title: 'font-semibold tracking-tight'
      }
    },
    pageFeature: {
      slots: {
        leading: 'size-9 shrink-0 rounded-md ring ring-default bg-default',
        leadingIcon: 'size-4.5 text-highlighted'
      }
    },
    authForm: {
      slots: {
        header: 'text-left',
        title: 'text-3xl tracking-tight',
        footer: 'text-left'
      }
    }
  }
})
