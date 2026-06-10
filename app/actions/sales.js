"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSale({ items, discount = 0, paymentMethod = "" }) {
  if (!items || items.length === 0) return { error: "Nenhum item na venda." };

  // Validar estoques e preparar totais
  const activeEvent = await prisma.event.findFirst({
    where: { isActive: true }
  });

  if (!activeEvent) {
    return { error: "Nenhum evento ativo. Abra um evento em Relatórios antes de vender." };
  }

  let totalAmount = 0;
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) return { error: `Produto não encontrado: ${item.name}` };
    
    if (product.stock < item.quantity) {
      return { error: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}` };
    }
    totalAmount += item.price * item.quantity;
  }

  const saleItemsData = items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price
  }));

  const finalAmount = Math.max(0, totalAmount - (discount || 0));

  // Transação para criar a venda e abater os estoques
  await prisma.$transaction(async (tx) => {
    await tx.sale.create({
      data: {
        totalAmount,
        discount: discount || 0,
        finalAmount,
        paymentMethod,
        eventId: activeEvent.id,
        items: {
          create: saleItemsData
        }
      }
    });

    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity }
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/historico");
  revalidatePath("/vendas");
  revalidatePath("/produtos");
  return { success: true };
}
