import React, { useRef, createContext } from 'react'
import styled, { css } from 'styled-components'
import Link from 'next/link'
import { DocsLinkNav } from '../ui/DocsLinkNav'
import { DocsNavProps } from './DocumentationNavigation'
import { NavSection } from './NavSection'
import { useRouter } from 'next/router'
import { matchActualTarget } from 'utils'
import { DynamicLink } from 'components/ui'

export const NavListContext = createContext({ current: null })

const getCategoryMatch = (navItems, currentPath) => {
  for (let item of navItems) {
    if (hasNestedSlug(item.items, currentPath)) {
      return item.category
    }
  }

  // if we don't find a match in the category nav, do some "rule-of-thumb" matching
  return matchHeuristic(currentPath)
}

const matchHeuristic = currentPath => {
  if (currentPath.includes('/docs/releases')) return 'TinaCMS'

  return null
}

const hasNestedSlug = (navItems, slug) => {
  for (let item of navItems) {
    if (item.slug && matchActualTarget(item.slug, slug)) {
      return true
    }
    if (item.href && matchActualTarget(item.href, slug)) {
      return true
    }
    if (item.items) {
      if (hasNestedSlug(item.items, slug)) {
        return true
      }
    }
  }
  return false
}

const useActiveCategory = navItems => {
  const router = useRouter()
  return getCategoryMatch(navItems, router.asPath)
}

interface NavTitleProps {
  selected: boolean
}

const NavTitle = styled.div<NavTitleProps>`
  ${(props: any) =>
    props.selected &&
    css`
      background: white;
      font-weight: bold;
    `}
`

const NavLevel = ({ categoryData }: { categoryData: any }) => {
  const router = useRouter()

  console.log('categoryData ', categoryData)
  const trimUrl = (str: string) => str.replace(/^\|+|\|+$/g, '')

  const expandChildren = trimUrl(router.asPath).includes(
    trimUrl(categoryData.slug)
  )
  return (
    <>
      <DynamicLink href={categoryData.slug} passHref>
        <NavTitle selected={router.asPath == categoryData.slug}>
          {categoryData.title || categoryData.category}
        </NavTitle>
      </DynamicLink>
      {expandChildren && (
        <NavLevelChildContainer>
          {(categoryData.items || []).map(item => (
            <NavLevel categoryData={item} />
          ))}
        </NavLevelChildContainer>
      )}
    </>
  )
}

const NavLevelChildContainer = styled.div`
  margin-left: 0.5rem;
`

export const DocsNavigationList = ({ navItems }: DocsNavProps) => {
  const router = useRouter()

  return (
    <>
      <MobileMainNav>
        <DocsLinkNav />
      </MobileMainNav>
      <DocsNavigationContainer>
        {navItems.map(categoryData => (
          <NavLevel categoryData={categoryData} />
        ))}
      </DocsNavigationContainer>
    </>
  )
}

const DocsCategoryHeading = ({ categoryData, isActive }) => {
  return (
    <Link href={categoryData.slug || '/'} passHref>
      <CategoryAnchor
        onClick={e => {
          if (isActive) {
            e.preventDefault()
          }
        }}
      >
        {categoryData.category} {isActive && <AnchorIcon>→</AnchorIcon>}
      </CategoryAnchor>
    </Link>
  )
}

const DocsNavigationSection = ({ navItems }: DocsNavProps) => {
  const navListRef = useRef<HTMLUListElement>(null)

  return (
    <NavListContext.Provider value={navListRef}>
      <ul ref={navListRef}>
        {navItems &&
          navItems.map(section => (
            <NavSection key={section.id} {...section} collapsible={false} />
          ))}
      </ul>
    </NavListContext.Provider>
  )
}

const MobileMainNav = styled.div`
  padding-top: 0rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-light-dark);
  background-color: white;

  ul {
  }

  li {
    margin: 0;
  }

  a {
    display: block;
    padding: 0.5rem 3.5rem 0.5rem 1.5rem;
    color: var(--color-orange);
    margin: 0;
  }

  @media (min-width: 1200px) {
    display: none;
  }
`

const DocsNavigationContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`

const Breadcrumbs = styled.li`
  display: block;
  padding: 0 1.5rem 0.5rem 1.5rem;

  a {
    color: var(--tina-color-grey-5);
    text-decoration-color: rgba(0, 0, 0, 0.3);
    font-size: 1rem;

    &:hover {
      color: var(--tina-color-grey-6);
      text-decoration-color: var(--tina-color-grey-6);
    }
  }

  a:not(:last-child):after {
    content: '/';
    display: inline-block;
    margin: 0 0.25rem;
    color: var(--tina-color-grey-4);
  }
`

const CategoryDescription = styled.p`
  margin-top: 0.5rem;
  color: var(--color-secondary-dark);
  opacity: 0.65;
  font-size: 0.8em;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  transition: all 150ms ease-out;
`

const AnchorIcon = styled.span`
  display: inline-block;
  position: relative;
  transform: translate3d(0, 0, 0);
  transition: all 150ms ease-out;
`

const CategoryAnchor = styled.a`
  display: block;
  cursor: pointer;
  padding: 0.5rem 1.5rem 0.5rem 1.5rem;
  color: var(--color-orange);
  text-decoration: none;
  transition: all 180ms ease-out;
  font-family: var(--font-tuner);
  font-size: 1.125rem;

  :hover {
    ${CategoryDescription} {
      opacity: 1;
    }

    ${AnchorIcon} {
      transform: translate3d(0.25rem, 0, 0);
    }
  }
`

const IndexLink = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  color: var(--color-orange);
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.9375rem;
  opacity: 0.7;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  transition: all 150ms ease-out;

  &:hover {
    opacity: 1;
  }
`

const NavListHeader = styled.li`
  position: relative;
  padding: 0.5rem 1.5rem 0.75rem 1.5rem;
  z-index: 10;
`

const CategoryHeader = styled.h3`
  color: var(--color-orange);
  text-decoration: none;
  transition: all 180ms ease-out;
  font-family: var(--font-tuner);
  font-size: 1.5rem;
`
