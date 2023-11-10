/* eslint-disable @next/next/no-img-element */
import { Article } from '@/components/Article'
import { Articles } from '@/components/Articles'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-start justify-between p-6 gap-3">
        <h1 className='text-3xl font-bold'>
          Mis artículos
        </h1>
        <p className='sm:w-[50%] w-full text-left text-xl'>
          Aquí podras ver tus articulos publicados y podrás reclamar tus tokens.
        </p>
        <Articles />
      </main>
    </>
  )
}
