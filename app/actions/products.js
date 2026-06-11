"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function createProduct(formData) {
  const name = formData.get("name");
  const description = formData.get("description") || null;
  const price = parseFloat(formData.get("price")?.toString().replace(",", "."));
  const costStr = formData.get("cost");
  const cost = costStr ? parseFloat(costStr.toString().replace(",", ".")) : null;
  const categoryId = formData.get("categoryId");
  const stock = parseInt(formData.get("stock") || "0", 10);

  const imageFile = formData.get("image");
  let imageUrl = null;

  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const ext = path.extname(imageFile.name) || '';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(process.cwd(), "public", "uploads", uniqueName);
    
    // Ensure dir exists
    await fs.mkdir(path.dirname(filePath), { recursive: true }).catch(() => {});
    await fs.writeFile(filePath, buffer);
    imageUrl = `/uploads/${uniqueName}`;
  }

  if (!name || isNaN(price) || !categoryId) return { error: "Preencha os campos obrigatórios." };

  // Fetch category to generate code
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  let code = null;
  
  if (category && category.prefix) {
    const count = await prisma.product.count({
      where: { categoryId }
    });
    code = `${category.prefix}-${String(count + 1).padStart(3, '0')}`;
  }

  await prisma.product.create({
    data: {
      name, 
      description, 
      price, 
      cost, 
      categoryId, 
      imageUrl, 
      stock, 
      code
    }
  });
  
  revalidatePath("/produtos");
  revalidatePath("/vendas");
}

export async function updateProduct(id, formData) {
  const name = formData.get("name");
  const description = formData.get("description") || null;
  const price = parseFloat(formData.get("price")?.toString().replace(",", "."));
  const costStr = formData.get("cost");
  const cost = costStr ? parseFloat(costStr.toString().replace(",", ".")) : null;
  const categoryId = formData.get("categoryId");
  const stock = parseInt(formData.get("stock") || "0", 10);

  const imageFile = formData.get("image");
  let imageUrl = undefined;

  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const ext = path.extname(imageFile.name) || '';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(process.cwd(), "public", "uploads", uniqueName);
    
    await fs.mkdir(path.dirname(filePath), { recursive: true }).catch(() => {});
    await fs.writeFile(filePath, buffer);
    imageUrl = `/uploads/${uniqueName}`;
  }

  if (!name || isNaN(price) || !categoryId) return { error: "Preencha os campos obrigatórios." };

  const data = { name, description, price, cost, categoryId, stock };
  if (imageUrl !== undefined) {
    data.imageUrl = imageUrl;
  }

  await prisma.product.update({
    where: { id },
    data
  });
  
  revalidatePath("/produtos");
  revalidatePath("/vendas");
  revalidatePath(`/produtos/${id}`);
}

export async function deleteProduct(id) {
  try {
    const salesCount = await prisma.saleItem.count({
      where: { productId: id }
    });
    
    if (salesCount > 0) {
       return { error: "Não é possível excluir produto vinculado a uma venda." };
    }
    
    await prisma.product.delete({ where: { id } });
    
    revalidatePath("/produtos");
    revalidatePath("/vendas");
  } catch (e) {
    return { error: "Erro ao excluir produto." };
  }
}
