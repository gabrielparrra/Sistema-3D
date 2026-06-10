"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function clearSalesHistory() {
  try {
    // Delete all sale items first (if cascade isn't configured, though Prisma usually handles it)
    await prisma.saleItem.deleteMany({});
    // Delete all sales
    await prisma.sale.deleteMany({});
    // Delete all events
    await prisma.event.deleteMany({});
    
    revalidatePath("/");
    revalidatePath("/vendas");
    revalidatePath("/historico");
    revalidatePath("/produtos");
    revalidatePath("/categorias");
    
    return { success: true };
  } catch (e) {
    return { error: "Erro ao limpar histórico de vendas." };
  }
}

export async function bulkAdjustPrices(categoryId, percentage) {
  try {
    const p = parseFloat(percentage);
    if (isNaN(p)) return { error: "Porcentagem inválida." };

    const multiplier = 1 + (p / 100);

    const whereClause = categoryId === "ALL" ? {} : { categoryId };

    const products = await prisma.product.findMany({ where: whereClause });
    
    // We update one by one to use the multiplier effectively since SQLite might lack complex math updates via Prisma
    for (const prod of products) {
      await prisma.product.update({
        where: { id: prod.id },
        data: { price: parseFloat((prod.price * multiplier).toFixed(2)) }
      });
    }

    revalidatePath("/produtos");
    revalidatePath("/vendas");
    
    return { success: true };
  } catch (e) {
    return { error: "Erro ao atualizar preços." };
  }
}

export async function bulkAdjustStock(categoryId, newStockValue) {
  try {
    const val = parseInt(newStockValue, 10);
    if (isNaN(val) || val < 0) return { error: "Valor de estoque inválido." };

    const whereClause = categoryId === "ALL" ? {} : { categoryId };

    await prisma.product.updateMany({
      where: whereClause,
      data: { stock: val }
    });

    revalidatePath("/produtos");
    revalidatePath("/vendas");
    
    return { success: true };
  } catch (e) {
    return { error: "Erro ao atualizar estoque." };
  }
}

export async function bulkTransferCategory(fromCategoryId, toCategoryId) {
  try {
    if (!fromCategoryId || !toCategoryId) return { error: "Categorias inválidas." };
    if (fromCategoryId === toCategoryId) return { error: "As categorias de origem e destino devem ser diferentes." };

    await prisma.product.updateMany({
      where: { categoryId: fromCategoryId },
      data: { categoryId: toCategoryId }
    });

    revalidatePath("/produtos");
    revalidatePath("/categorias");
    revalidatePath("/vendas");
    
    return { success: true };
  } catch (e) {
    return { error: "Erro ao transferir produtos." };
  }
}

export async function bulkRegenerateCodes(categoryId) {
  try {
    const whereClause = categoryId === "ALL" ? {} : { categoryId };
    
    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true }
    });

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      // Generate a code: Category Prefix (first 3 letters uppercase) + increment number
      const prefix = p.category.name.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
      const number = String(i + 1).padStart(3, '0');
      const newCode = `${prefix}-${number}`;

      await prisma.product.update({
        where: { id: p.id },
        data: { code: newCode }
      });
    }

    revalidatePath("/produtos");
    revalidatePath("/vendas");

    return { success: true };
  } catch (e) {
    return { error: "Erro ao regenerar códigos." };
  }
}
