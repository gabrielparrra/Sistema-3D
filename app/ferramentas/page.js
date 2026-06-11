import { prisma } from "@/app/lib/prisma";
import ToolsDashboard from "./ToolsDashboard";

export default async function FerramentasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="fade-in">
      <header className="page-header">
        <h1 className="page-title">Ferramentas e Aceleradores</h1>
      </header>

      <div className="mb-6 text-muted">
        Utilize as ferramentas abaixo para agilizar processos repetitivos no seu dia a dia de impressão 3D.
      </div>

      <ToolsDashboard categories={categories} />
    </div>
  );
}
