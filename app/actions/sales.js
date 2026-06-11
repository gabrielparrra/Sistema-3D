"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSale({ items, discount = 0, paymentMethod = "" }) {
  if (!items || items.length === 0) return { error: "Nenhum item na venda." };

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Validar evento ativo
      const activeEvent = await tx.event.findFirst({
        where: { isActive: true }
      });
      
      if (!activeEvent) {
        throw new Error("Nenhum evento ativo. Abra um evento em Relatórios antes de vender.");
      }
      
      const eventId = activeEvent.id;
      
      // 2. Validar estoques e calcular total
      let totalAmount = 0;
      const productUpdates = [];
      
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });
        
        if (!product) {
          throw new Error(`Produto não encontrado: ${item.name}`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`);
        }
        
        productUpdates.push({
          id: product.id,
          newStock: product.stock - item.quantity
        });
        
        totalAmount += item.price * item.quantity;
      }
      
      const finalAmount = Math.max(0, totalAmount - (discount || 0));
      
      // 3. Atualizar os estoques
      for (const pd of productUpdates) {
        await tx.product.update({
          where: { id: pd.id },
          data: { stock: pd.newStock }
        });
      }
      
      // 4 & 5. Criar a venda e os itens da venda
      await tx.sale.create({
        data: {
          eventId,
          totalAmount,
          discount: discount || 0,
          finalAmount,
          paymentMethod,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });
      
      return { success: true };
    });
  } catch (error) {
    return { error: error.message };
  } finally {
    revalidatePath("/");
    revalidatePath("/historico");
    revalidatePath("/vendas");
    revalidatePath("/produtos");
  }
}
