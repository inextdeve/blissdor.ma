import { Link } from '@/components/Link'
import logoGreen from '@/images/logo-green.png'
import Image from 'next/image'
import React from 'react'

export interface LogoProps extends React.ComponentPropsWithoutRef<'svg'> {
  className?: string
  href?: string
}

const Logo: React.FC<LogoProps> = ({ className = 'shrink-0', ...props }) => {
  return (
    <Link href={props.href ?? '/'} className={`flex ${className}`} dir="ltr">
      <Image
        src={logoGreen.src}
        width={logoGreen.width}
        height={logoGreen.height}
        alt="logo"
        className="h-[44px] w-[112px]"
      />
    </Link>
  )
}

export default Logo
