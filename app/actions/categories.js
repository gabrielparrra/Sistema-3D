"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData) {
  const name = formData.get("name");
  let prefix = formData.get("prefix");

  if (!name) return { error: "Nome é obrigatório" };
  
  if (!prefix) {
    prefix = name.replace(/[^A-Za-z]/g, '').toUpperCase().substring(0, 3);
    if (prefix.length < 3) prefix = prefix.padEnd(3, 'X');
  }

  await prisma.category.create({ data: { name, prefix } });
  revalidatePath("/categorias");
}

export async function deleteCategory(id) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/categorias");
  } catch (e) {
    return { error: "Não é possível excluir uma categoria que possui produtos." };
  }
}
