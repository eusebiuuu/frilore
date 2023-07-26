import image1 from '../../assets/home1.svg'
import image2 from '../../assets/home2.svg'
import image3 from '../../assets/home3.svg'
import { AiOutlineTeam } from 'react-icons/ai'
import { BsFillBuildingFill } from 'react-icons/bs'
import { MdEmojiPeople, MdPayment, MdPeople } from 'react-icons/md'

export const messages = [
  {
    id: 50,
    title: 'The project management tool to rule them all',
    subtitle: 'The project management tool perfect for your team',
    image: image1
  },
  {
    id: 51,
    title: 'We deliver professional services since 2016',
    subtitle: 'The project management tool perfect for your team',
    image: image2
  },
  {
    id: 52,
    title: 'It`s not another project management tool',
    subtitle: 'The project management tool perfect for your team',
    image: image3
  }
];

export const details = [
  {
    id: 5,
    title: 'Membership Organisations',
    description: 'Our membership management software provides full automation of membership renewals and payments',
    icon: AiOutlineTeam,
  },
  {
    id: 6,
    title: 'National Associations',
    description: 'Our membership management software provides full automation of membership renewals and payments',
    icon: BsFillBuildingFill,
  },
  {
    id: 7,
    title: 'Clubs And Groups',
    description: 'Our membership management software provides full automation of membership renewals and payments',
    icon: MdEmojiPeople,
  },
];

export const numbers = [
  {
    id: 1,
    num: '20,000,000+',
    name: 'Customers',
    icon: MdPeople
  },
  {
    id: 2,
    num: '3,000+',
    name: 'Members',
    icon: AiOutlineTeam,
  },
  {
    id: 3,
    num: '100+',
    name: 'Events',
    icon: MdEmojiPeople
  },
  {
    id: 4,
    num: '1,000,000+',
    name: 'Payments',
    icon: MdPayment
  }
]