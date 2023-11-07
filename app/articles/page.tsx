/* eslint-disable @next/next/no-img-element */
import { Article } from '@/components/Article'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'

export default function Home() {
  const DUMMY_ARTICLES: Article[] = [
    {
      title: "IA y nuevos paradigmas en la atribución de responsabilidad",
      link: "",
      visits: "1.3k",
    },
    {
      title: "Hacia el abismo",
      link: "",
      visits: "13k",
    },
    {
      title: "Internet de las Cosas y la transformación digital en las empresas posmodernas",
      link: "",
      visits: "10",
    }
  ]

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
        {/* WIP */}
        {
          DUMMY_ARTICLES.map((article, index) => (
            <Article key={index} {...article} />
          ))
        }
      </main>
    </>
  )
}
