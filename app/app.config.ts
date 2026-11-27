export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc'
    },
    container: {
      base: 'px-5 sm:px-8 lg:px-12'
    },
    button: {
      variants: {
        size: {
          lg: {
            base: 'px-3.5 py-2 text-[15px]/6 gap-2'
          },
          xl: {
            base: 'px-5 py-3 text-base gap-2 rounded-lg',
            leadingIcon: 'size-[18px]',
            trailingIcon: 'size-4'
          }
        }
      },
      compoundVariants: [{
        color: 'primary',
        variant: 'solid',
        class: 'text-primary-950'
      }, {
        color: 'neutral',
        variant: 'outline',
        class: 'bg-surface'
      }]
    },
    input: {
      variants: {
        size: {
          xl: {
            base: 'px-3.5 py-3 text-[15px]/5.5 rounded-lg'
          }
        },
        variant: {
          outline: 'bg-surface'
        }
      }
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
        container: 'border-x border-default py-16 sm:py-24 lg:py-28',
        title: 'text-[2.5rem]/[0.98] sm:text-6xl/[0.98] lg:text-[4.75rem]/[0.98] tracking-[-0.045em] font-semibold',
        description: 'max-w-xl text-[17px]/[1.6] sm:text-lg/[1.6]'
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
            headline: 'font-mono text-[13px] font-normal uppercase tracking-[0.04em] text-muted gap-2.5 before:size-2 before:bg-primary'
          }
        }
      }
    },
    pageSection: {
      slots: {
        root: 'border-b border-default',
        container: 'border-x border-default py-16 sm:py-24 lg:py-28',
        title: 'text-[2.125rem]/[1.02] sm:text-5xl/[1.02] lg:text-[3.5rem]/[1.02] tracking-[-0.04em] font-semibold',
        description: 'text-base/[1.6] sm:text-[17px]/[1.6]'
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
            headline: 'font-mono text-[13px] font-normal uppercase tracking-[0.04em] text-muted gap-2.5 before:size-2 before:bg-primary'
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
        leading: 'size-9 shrink-0 rounded-md ring ring-default bg-surface',
        leadingIcon: 'size-4.5 text-highlighted',
        title: 'text-[17px] font-semibold',
        description: 'mt-1.5 text-[15px]/[1.6]'
      },
      variants: {
        orientation: {
          horizontal: {
            root: 'gap-4',
            leading: 'p-0'
          }
        },
        title: {
          true: {
            description: 'mt-1.5'
          }
        }
      }
    },
    formField: {
      variants: {
        size: {
          xl: {
            root: 'text-sm'
          }
        }
      }
    },
    checkbox: {
      variants: {
        size: {
          xl: {
            base: 'size-[18px]',
            icon: 'size-4',
            wrapper: 'ms-2.5 text-sm',
            label: 'font-normal text-toned'
          }
        }
      }
    },
    prose: {
      h2: {
        slots: {
          base: 'text-[26px] font-semibold tracking-[-0.03em] mt-12 first:mt-0 mb-4'
        }
      },
      h3: {
        slots: {
          base: 'font-semibold tracking-[-0.02em]'
        }
      },
      p: {
        base: 'leading-[1.7] text-toned'
      },
      a: {
        base: 'text-highlighted border-b-0 underline underline-offset-2 hover:text-muted'
      },
      ol: {
        base: 'list-none ps-0 [counter-reset:step]'
      },
      li: {
        base: 'leading-[1.6] text-toned in-[ol]:relative in-[ol]:my-0 in-[ol]:not-first:mt-3.5 in-[ol]:ps-10 in-[ol]:[counter-increment:step] in-[ol]:before:absolute in-[ol]:before:start-0 in-[ol]:before:top-0 in-[ol]:before:grid in-[ol]:before:place-items-center in-[ol]:before:size-6.5 in-[ol]:before:rounded-full in-[ol]:before:ring in-[ol]:before:ring-accented in-[ol]:before:font-mono in-[ol]:before:text-xs in-[ol]:before:text-highlighted in-[ol]:before:content-[counter(step)]'
      },
      code: {
        base: 'font-normal rounded-[5px]',
        variants: {
          color: {
            neutral: 'border-0 bg-accented/60 text-highlighted'
          }
        }
      },
      callout: {
        slots: {
          base: 'px-5 py-[18px] rounded-xl text-[15px]/[1.6]',
          icon: 'size-5 me-3'
        },
        variants: {
          color: {
            neutral: {
              base: 'border-default bg-surface text-toned',
              icon: 'text-primary'
            }
          }
        }
      },
      pre: {
        slots: {
          root: 'dark',
          header: 'gap-2 min-h-12 ps-4 pe-2 py-2 bg-default border-default rounded-t-xl font-mono text-[13px] text-muted',
          filename: 'text-muted text-[13px]/6',
          icon: 'size-3.5',
          copy: 'top-2 end-2',
          base: 'bg-default border-default rounded-xl px-4 py-[18px] text-sm/[1.7]'
        }
      }
    },
    authForm: {
      slots: {
        header: 'text-left',
        title: 'text-4xl/[1.05] tracking-[-0.04em]',
        description: 'mt-3',
        body: 'gap-y-7',
        providers: 'space-y-2.5',
        form: 'space-y-[18px]',
        footer: 'text-left text-[13px]/[1.6] text-dimmed mt-1'
      }
    }
  }
})
