import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'

const Earth = dynamic(() => import('@/components/canvas/Earth'), {
  ssr: false,
})

const Page = ({ title }) => {
  useStore.setState({ title })
  return (
    <>
      <Earth r3f/>
    </>
  )
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Earth',
    },
  }
}
