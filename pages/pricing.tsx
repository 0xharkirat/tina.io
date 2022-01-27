import React from 'react'
import { GetStaticProps } from 'next'
import {
  Hero,
  Layout,
  MarkdownContent,
  RichTextWrapper,
  Section,
  Wrapper,
} from 'components/layout'
import { NextSeo } from 'next-seo'
import { getJsonPreviewProps } from 'utils/getJsonPreviewProps'
import { useGithubJsonForm } from 'react-tinacms-github'
import { usePlugin, useCMS } from 'tinacms'
import { Actions, Divider } from 'components/home'

function PricingPage({ file: community, metadata, preview }) {
  const cms = useCMS()

  // Registers Tina Form
  const [data, form] = useGithubJsonForm(community, {
    label: 'Community Page',
    fields: [
      {
        label: 'Headline',
        name: 'headline',
        description: 'Enter the main headline here',
        component: 'text',
      },
      {
        label: 'Community Image',
        name: 'img',
        component: 'group',
        fields: [
          {
            label: 'Image',
            name: 'src',
            component: 'image',
            parse: media => {
              if (!media) return ''
              return media.id
            },
            uploadDir: () => '/img/',
          },
          { label: 'Alt Text', name: 'alt', component: 'text' },
        ],
      },
      {
        label: 'Secondary Headline',
        name: 'supporting_headline',
        description: 'Enter the secondary headline here',
        component: 'textarea',
      },
      {
        label: 'Secondary Body Copy',
        name: 'supporting_body',
        description: 'Enter the body copy here',
        component: 'markdown',
      },
      {
        label: 'Newsletter Header',
        name: 'newsletter_header',
        component: 'text',
      },
      {
        label: 'Newsletter CTA',
        name: 'newsletter_cta',
        component: 'text',
      },
    ],
  })

  usePlugin(form)

  return (
    <Layout>
      <NextSeo
        title={data.title}
        description={data.description}
        openGraph={{
          title: data.title,
          description: data.description,
        }}
      />
      <Hero>Pricing</Hero>
      <RichTextWrapper>
        <Section>
          <Wrapper>
            <div className="intro-text">
              <p>
                <strong>No surprises.</strong> Predictable pricing for every
                project. Complete control of your content, forever.
              </p>
              <p>
                Tina’s source code is open-source. Your content lives in
                accessible formats right in your Git repository.
              </p>
            </div>
            <PricingCard
              actions={[
                {
                  variant: 'orange',
                  label: 'Get Started',
                  icon: 'arrowRight',
                  url: '/',
                },
              ]}
            />
            <div className="card-wrapper">
              <PricingCard
                name="Team"
                price="$99"
                interval="month"
                size="small"
              />
              <PricingCard
                name="Business"
                price="$949"
                interval="month"
                body={`- Tina's Business plan offers **something** per project\n- Each additional something being billed at **$0/month**`}
                size="small"
              />
              <PricingCard
                name="Enterprise"
                price="Contact Us"
                body={`- Our Enterprise plan offers **amazing features**\n- Really **exceptional value**\n- **Anything is possible**`}
                size="small"
              />
            </div>
            <style jsx>{`
              .intro-text {
                margin: 0 auto 4.5rem auto;
                max-width: 40rem;

                :global(p) {
                  &:first-of-type {
                    font-size: 1.5rem;
                  }

                  font-size: 1.25rem;
                  color: var(--color-secondary);
                }
              }
              .card-wrapper {
                padding: 4rem 0;
                display: flex;
                width: 100%;

                @media (max-width: 1099px) {
                  max-width: 40rem;
                  margin: 0 auto;
                  flex-direction: column;
                  align-items: stretch;
                  justify-content: stretch;

                  :global(> *) {
                    &:not(:last-child) {
                      border-bottom-right-radius: 0;
                      border-bottom-left-radius: 0;
                      border-bottom: none;
                    }
                    &:not(:first-child) {
                      border-top-left-radius: 0;
                      border-top-right-radius: 0;
                    }
                  }
                }

                @media (min-width: 1100px) {
                  flex-direction: row;
                  align-items: stretch;
                  justify-content: space-between;

                  :global(> *) {
                    &:not(:last-child) {
                      border-top-right-radius: 0;
                      border-bottom-right-radius: 0;
                      border-right: none;
                    }
                    &:not(:first-child) {
                      border-top-left-radius: 0;
                      border-bottom-left-radius: 0;
                    }
                  }
                }
              }
            `}</style>
          </Wrapper>
        </Section>
      </RichTextWrapper>
    </Layout>
  )
}

const PricingCard = ({
  size = 'large',
  name = 'Community',
  price = 'Free',
  interval = '',
  actions = [
    {
      variant: '',
      label: 'Contact Us',
      icon: 'arrowRight',
      url: '/',
    },
  ],
  body = defaultCardMarkdown,
}) => {
  return (
    <>
      <div className="card">
        <div className="header">
          <h3 className="title">{name}</h3>
          <hr />
          <h3 className="price">
            {price}
            {interval && <span className="interval">/{interval}</span>}
          </h3>
        </div>
        <div className="body">
          <div className="content">
            <MarkdownContent content={body} />
          </div>
          <Actions items={actions} />
        </div>
      </div>
      <style jsx>{`
        .card {
          flex: 1 1 auto;
          width: 100%;
          margin: 0 auto;
          max-width: 45rem;
          border: 1px solid var(--color-seafoam-300);
          border-radius: 0.75rem;
          box-shadow: 0 6px 24px rgba(0, 37, 91, 0.05),
            0 2px 4px rgba(0, 37, 91, 0.03);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          flex-wrap: wrap;
          align-items: center;
          line-height: 1.2;
          background: var(--color-seafoam-100);
          border-bottom: 1px solid var(--color-seafoam-300);
          padding: ${size === 'large' ? '2rem 2.5rem' : '1.75rem 2.25rem'};
        }
        .title {
          font-family: var(--font-tuner);
          color: var(--color-orange);
          font-size: ${size === 'large' ? '2rem' : '1.5rem'};
          flex: 0 0 auto;
          padding-right: 1rem;
          margin: 0;
        }
        .price {
          font-family: var(--font-tuner);
          color: var(--color-secondary);
          font-size: ${size === 'large' ? '2rem' : '1.5rem'};
          flex: 0 0 auto;
          margin: 0;
        }
        .interval {
          opacity: 0.4;
          font-size: 0.75em;
        }
        .body {
          flex: 1 1 auto;
          padding: ${size === 'large' ? '2.5rem' : '2.25rem'};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: var(--color-secondary);
        }
        .content {
          :global(strong) {
            opacity: 0.8;
          }
          :global(ul) {
            margin: 0 0 1.5rem 0;
            padding: 0;
            list-style-type: none;
          }
          :global(li) {
            position: relative;
            margin: 0 0 0.5rem 0;
            padding: 0 0 0 1.5rem;
            &:before {
              content: '';
              position: absolute;
              left: 0;
              top: 0.6em;
              width: 0.5em;
              height: 0.5em;
              border-radius: 100%;
              background: var(--color-seafoam-300);
              border: 1px solid var(--color-seafoam-400);
            }
          }
          :global(p) {
            font-size: ${size === 'large' ? '1.25rem' : '1.125rem'};
          }
        }
        hr {
          border-top: none;
          border-right: none;
          border-left: none;
          border-image: initial;
          border-bottom: 5px dotted var(--color-seafoam-dark);
          width: 100%;
          max-width: 100%;
          flex: 1 1 0;
          display: block;
          height: 0px;
          margin: 1rem 1rem 1rem 0;
        }
      `}</style>
    </>
  )
}

export default PricingPage

/*
 ** DATA FETCHING -----------------------------------------------
 */

export const getStaticProps: GetStaticProps = async function({
  preview,
  previewData,
}) {
  const { default: metadata } = await import('../content/siteConfig.json')

  const previewProps = await getJsonPreviewProps(
    'content/pages/pricing.json',
    preview,
    previewData
  )
  return { props: { ...previewProps.props, metadata } }
}

/* DUMMY CONTENT */

const defaultCardMarkdown = `- Tina's Community plan offers **3 free users** per project\n- Each additional user being billed at **$15/month**\n- Maximum of **10 users** per project`
