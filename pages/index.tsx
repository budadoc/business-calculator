import Head from 'next/head';
import dynamic from 'next/dynamic';

const BusinessCalculator = dynamic(() => import('../components/BusinessCalculator'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>사장님 계산기</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto">
          <BusinessCalculator />
        </div>
      </main>
    </>
  );
}
