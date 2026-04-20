import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicPortfolio } from '@/types';
import PortfolioView from '@/components/portfolio/PortfolioView';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getPortfolio(username: string): Promise<PublicPortfolio | null> {
  try {
    const res = await fetch(`${API_URL}/public/portfolio/${username}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.portfolio;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    return { title: 'Portofolio tidak ditemukan' };
  }

  const name = portfolio.profile.nama_lengkap;
  const bio = portfolio.profile.bio_singkat;

  return {
    title: `${name} — Portofolio Digital`,
    description: bio || `Portofolio digital profesional ${name}`,
    openGraph: {
      title: `${name} — Portofolio Digital`,
      description: bio || `Portofolio digital profesional ${name}`,
      images: portfolio.profile.foto_closeup ? [portfolio.profile.foto_closeup] : [],
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await getPortfolio(username);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioView portfolio={portfolio} />;
}
