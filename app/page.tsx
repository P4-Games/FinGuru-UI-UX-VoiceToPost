import { LinkButton } from '@/components/Button'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 gap-12">
      <h1 className='text-6xl font-bold'>
        Graba y Publica!
      </h1>
      <p className='sm:w-[50%] w-[90%] text-center text-xl'>
        Crea tu propio articulo, solo grabando una nota de voz. Nos encargamos de entregarte un articulo de calidad listo para publicar. Gane tokens cada vez que tu artículo recibe una visita.
      </p>
      <LinkButton link='/login'>Comenzar</LinkButton>
    </main>
  )
}
