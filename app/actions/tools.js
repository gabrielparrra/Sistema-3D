"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function clearSalesHistory() {
  try {
    await prisma.$transaction([
      prisma.saleItem.deleteMany({}),
      prisma.sale.deleteMany({}),
      prisma.event.deleteMany({})
    ]);
    
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

    const where = categoryId !== "ALL" ? { categoryId } : {};

    const products = await prisma.product.findMany({ where });
    
    await prisma.$transaction(
      products.map(p => 
        prisma.product.update({
          where: { id: p.id },
          data: { price: parseFloat((p.price * multiplier).toFixed(2)) }
        })
      )
    );

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

    const where = categoryId !== "ALL" ? { categoryId } : {};

    await prisma.product.updateMany({
      where,
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
    const where = categoryId !== "ALL" ? { categoryId } : {};

    const products = await prisma.product.findMany({
      where,
      include: { category: true }
    });
    
    let i = 0;
    await prisma.$transaction(
      products.map(p => {
        let newCode = p.code;
        if (p.category && p.category.prefix) {
          newCode = `${p.category.prefix}-${String(i + 1).padStart(3, '0')}`;
          i++;
        }
        return prisma.product.update({
          where: { id: p.id },
          data: { code: newCode }
        });
      })
    );

    revalidatePath("/produtos");
    revalidatePath("/vendas");

    return { success: true };
  } catch (e) {
    return { error: "Erro ao regenerar códigos." };
  }
}

export async function killSystemProcesses() {
  try {
    setTimeout(() => {
      process.exit(0);
    }, 1500);
    return { success: true };
  } catch (e) {
    return { error: "Erro ao encerrar o sistema." };
  }
}
