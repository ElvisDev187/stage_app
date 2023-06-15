import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/admin/Header';
import TopCards from '../../components/admin/TopCards';
import BarChart from '../../components/admin/BarChart';
import RecentOrders from '../../components/admin/RecentOrders';
import Sidebar from '../../components/admin/Sidebar';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';


export default function Home() {
  const supabase = useSupabaseClient()
  const fectReport = async () => {
    return supabase.from("reports")
      .select('id, created_at, posts(id,profiles(name)), profiles(*)')
      .eq("isread", false)
      .order('created_at', { ascending: false })
  }

  const { data: reports, isLoading } = useQuery({
    queryFn: async () => {
      const res = await fectReport()
      return res.data
    },
    queryKey: ["report"]
  })
  const now = new Date()
  const recent = reports?.filter((report) => {
    const elementDate = new Date(report.created_at);

    // Calculer la différence de temps en millisecondes entre l'heure actuelle et l'heure de l'élément
    const timeDifference = now - elementDate;

    // Vérifier si la différence de temps est inférieure à 12 heures (en millisecondes)
    const twelveHoursInMilliseconds = 72 * 60 * 60 * 1000;
    return timeDifference < twelveHoursInMilliseconds;
  })
  // Obtenir le numéro du jour de la semaine (0 pour dimanche, 1 pour lundi, etc.)
  const currentDayOfWeek = now.getDay();

  // Obtenir la date de début de la semaine en cours (dimanche)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayOfWeek);

  // Obtenir la date de fin de la semaine en cours (samedi)
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (6 - currentDayOfWeek));

  // Créer un objet vide pour regrouper les éléments par jour de la semaine
  const dataChart = reports?.reduce((groups, element) => {
    // Convertir la date de l'élément en objet Date
    const elementDate = new Date(element.created_at);

    // Vérifier si la date de l'élément est comprise dans la semaine en cours
    if (elementDate >= startOfWeek && elementDate <= endOfWeek) {
      // Obtenir le jour de la semaine de l'élément
      const dayOfWeek = elementDate.getDay();

      // Ajouter l'élément au groupe correspondant au jour de la semaine
      if (!groups[dayOfWeek]) {
        groups[dayOfWeek] = [];
      }
      groups[dayOfWeek].push(element);
    }

    return groups;
  }, {});
  
  // console.log();
  return (
    <Sidebar>
      <Head>
        <title>Admin</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='bg-gray-100 min-h-screen'>
        <Header />
        {/* <TopCards /> */}
        <div className='p-4 grid md:grid-cols-3 grid-cols-1  gap-4'>
          <BarChart data={dataChart} isLoading={isLoading}/>
          <RecentOrders recent={recent} isLoading={isLoading} />
        </div>
      </main>
    </Sidebar>
  );
}
