import React from 'react'
import styled, { css } from 'styled-components'
import { LinkNav } from '../ui/LinkNav'
import TwitterIconSvg from '../../public/svg/twitter-icon.svg'
import GithubIconSvg from '../../public/svg/github-icon.svg'
import { EmailForm } from '../forms/EmailForm'
import { TinaIcon } from 'components/logo'
import Link from 'next/link'
import TinaIconSvg from '../../public/svg/tina-icon.svg'

const footerLinks = [
  {
    link: '/security/',
    label: 'Security',
  },
  {
    link: '/telemetry/',
    label: 'Open Source Telemetry',
  },
  {
    link: '/terms-of-service/',
    label: 'Terms of Service',
  },
  {
    link: '/privacy-notice/',
    label: 'Privacy Notice',
  },
  {
    link: 'https://github.com/tinacms/tinacms/blob/master/LICENSE',
    label: 'License',
  },
]

export const Footer = ({}) => {
  return (
    <div>
      {/* Top */}
      <div className="flex flex-col md:flex-row gap-6 w-full justify-between items-start bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 px-4 py-6 lg:py-10 lg:px-10">
        <div className="max-w-[20%] flex-1 drop-shadow-sm">
          <TinaIcon color="white" />
        </div>
        <div className="flex-1">
          <LinkNav />
        </div>
        <div className="flex items-center gap-4 drop-shadow-sm">
          <iframe
            src="https://ghbtns.com/github-btn.html?user=tinacms&repo=tinacms&type=star&count=true&size=large"
            frameBorder="0"
            scrolling="0"
            width="150px"
            height="30px"
          ></iframe>
          <a
            href="https://twitter.com/tina_cms"
            className="transition ease-out duration-150 opacity-80 hover:opacity-100"
            target="_blank"
          >
            <TwitterIconSvg className="w-8 h-auto fill-white" />
          </a>
          <a
            className="transition ease-out duration-150 opacity-80 hover:opacity-100"
            href="https://github.com/tinacms/tinacms"
            target="_blank"
          >
            <GithubIconSvg className="w-8 h-auto fill-white" />
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col lg:flex-row w-full lg:items-center lg:justify-between bg-gradient-to-br border-t-2 border-orange-500 from-orange-600 via-orange-800 to-orange-900 text-white p-4 lg:py-6 lg:px-10">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span>Stay in touch 👉</span>
          <EmailForm isFooter />
        </div>
        <div className="flex drop-shadow-sm flex-wrap justify-end gap-x-6 gap-y-2">
          <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
            {footerLinks.map(item => {
              const { link, label } = item
              return <FooterLink link={link} label={label} />
            })}
          </div>
          <div>
            <p>
              &copy; TinaCMS 2019–
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const FooterLink = ({ link, label }) => {
  return (
    <Link href={link} passHref>
      <a className="transition ease-out duration-150 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:opacity-100 opacity-70 whitespace-nowrap">
        {label}
      </a>
    </Link>
  )
}
