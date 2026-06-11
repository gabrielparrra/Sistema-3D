"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(formData) {
  const name = formData.get("name");
  if (!name) return { error: "Nome do evento é obrigatório." };

  const activeEvent = await prisma.event.findFirst({
    where: { isActive: true }
  });

  if (activeEvent) {
    return { error: "Já existe um evento ativo. Encerre-o primeiro." };
  }

  await prisma.event.create({
    data: {
      name, 
      isActive: true
    }
  });

  revalidatePath("/relatorios");
  revalidatePath("/vendas");
  revalidatePath("/");
}

export async function closeEvent(id) {
  await prisma.event.update({
    where: { id },
    data: { 
      isActive: false, 
      closedAt: new Date() 
    }
  });

  revalidatePath("/relatorios");
  revalidatePath("/vendas");
  revalidatePath("/");
}

export async function getActiveEvent() {
  const activeEvent = await prisma.event.findFirst({
    where: { isActive: true }
  });
  return activeEvent;
}
