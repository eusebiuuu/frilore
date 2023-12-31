import { FC } from "react"
import { AiFillProject,AiFillHome } from 'react-icons/ai'
import { BiTask } from 'react-icons/bi'
import { BsFacebook, BsLinkedin, BsTwitter, BsYoutube,BsChatDots } from 'react-icons/bs'

export type SidebarLink = {
  link: string,
  text: string,
  icon: FC,
  id: number
}

export const sidebarLinks: SidebarLink[] = [
  {
    id: -1,
    text: 'Dashboard',
    link: '/',
    icon: AiFillHome,
  },
  {
    id: 0,
    text: 'Projects',
    link: '/projects',
    icon: AiFillProject
  },
  {
    id: 1,
    text: 'Assigned tasks',
    link: '/tasks',
    icon: BiTask,
  },
  {
    id: 3,
    text: 'Chats',
    link: '/chat',
    icon: BsChatDots
  }
];

export const footerLinks = [
  {
    id: 10,
    name: 'About Us',
    link: '/',
  },
  {
    id: 11,
    name: 'Contact Us',
    link: '/',
  },
  {
    id: 12,
    name: 'Pricing',
    link: '/',
  },
];

export const footerIcons = [
  {
    id: 111,
    icon: BsTwitter,
    link: 'https://twitter.com'
  },
  {
    id: 112,
    icon: BsYoutube,
    link: 'https://youtube.com',
  },
  {
    id: 113,
    icon: BsFacebook,
    link: 'https://facebook.com',
  },
  {
    id: 114,
    icon: BsLinkedin,
    link: 'https://linkedin.com'
  }
]