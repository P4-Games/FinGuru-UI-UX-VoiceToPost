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
        <section className='border-violet-700 bg-violet-100 border-4 rounded-lg w-full p-6 flex flex-row justify-between items-center my-4'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-xl m-0 font-medium'>Reclamar tokens</h3>
            <p>Pendiente: 1000 $FG</p>
            <Button className='bg-violet-700 mt-3'>Reclamar</Button>
          </div>
          <img src="finguru_token.png" alt='finguru token' className='w-[80px] h-[80px]'/>
        </section>
        <Articles />
      </main>
    </>
  )
}
