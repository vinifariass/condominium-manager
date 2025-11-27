import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const condominiumId = searchParams.get("condominiumId");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const role = searchParams.get("role"); // Note: Resident model uses 'type', not 'role' exactly, but we can map
    const apartment = searchParams.get("apartment");

    const where: Prisma.ResidentWhereInput = {};

    if (condominiumId) {
      where.condominiumId = condominiumId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { cpf: { contains: search, mode: "insensitive" } },
        { apartment: { number: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status && status !== "all") {
      where.status = status as any;
    }

    if (role && role !== "all") {
      // Mapping frontend 'role' to ResidentType if applicable, or just ignoring if it's strictly UserRole
      // The frontend sends ADMIN, MANAGER, EMPLOYEE, RESIDENT.
      // Resident model only has ResidentType: OWNER, TENANT, DEPENDENT.
      // We might need to adjust this logic. For now, if role is RESIDENT, we return all.
      // If role is ADMIN/MANAGER/EMPLOYEE, we might return nothing or handle differently.
      // Given this is the "Residents" API, we assume we are listing Residents.
      // If the user wants to filter by ResidentType (OWNER/TENANT), we should support that.
      // For now, let's ignore the 'role' filter if it doesn't map to ResidentType, or map RESIDENT to all.
    }

    if (apartment) {
      where.apartment = {
        number: { contains: apartment, mode: "insensitive" }
      };
    }

    const residents = await prisma.resident.findMany({
      where,
      include: {
        apartment: {
          include: {
            block: true
          }
        },
        condominium: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedResidents = residents.map((resident) => ({
      id: resident.id,
      name: resident.name,
      email: resident.email || "",
      phone: resident.phone,
      cpf: resident.cpf,
      apartment: resident.apartment.number,
      block: resident.apartment.block?.name || "",
      role: "RESIDENT", // Hardcoded as these are all residents
      type: resident.type, // OWNER, TENANT, etc.
      status: resident.status,
      avatar: "", // Resident model doesn't have avatar yet
      createdAt: resident.createdAt.toISOString(),
      condominiumId: resident.condominiumId,
      condominiumName: resident.condominium.name,
    }));

    return NextResponse.json(formattedResidents);
  } catch (error) {
    console.error("Erro ao buscar moradores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar moradores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.condominiumId || !data.apartmentNumber) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Find or create apartment
    // In a real scenario, we might want to ensure the apartment exists first.
    // For this demo, we'll try to find it, or create if it doesn't exist (if blockId is provided).

    let apartmentId = "";

    // Try to find existing apartment
    const existingApartment = await prisma.apartment.findFirst({
      where: {
        condominiumId: data.condominiumId,
        number: data.apartmentNumber,
        blockId: data.blockId || undefined
      }
    });

    if (existingApartment) {
      apartmentId = existingApartment.id;
    } else {
      // Create new apartment if not found
      // Note: This might fail if blockId is required but not provided, or if other constraints exist.
      // We assume basic creation is possible.
      const newApartment = await prisma.apartment.create({
        data: {
          number: data.apartmentNumber,
          condominiumId: data.condominiumId,
          blockId: data.blockId || null,
          floor: 1, // Default
          area: 0, // Default
          bedrooms: 0, // Default
          bathrooms: 0, // Default
          monthlyFee: 0, // Default
          status: "OCCUPIED"
        }
      });
      apartmentId = newApartment.id;
    }

    const resident = await prisma.resident.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        cpf: data.cpf || "", // Assuming CPF might be passed or we generate a placeholder if not required by frontend yet
        type: "OWNER", // Default to OWNER or map from data.role if possible
        status: data.status || "ACTIVE",
        condominiumId: data.condominiumId,
        apartmentId: apartmentId,
        isOwner: true // Default
      },
      include: {
        apartment: {
          include: {
            block: true
          }
        },
        condominium: true
      }
    });

    const formattedResident = {
      id: resident.id,
      name: resident.name,
      email: resident.email || "",
      phone: resident.phone,
      cpf: resident.cpf,
      apartment: resident.apartment.number,
      block: resident.apartment.block?.name || "",
      role: "RESIDENT",
      type: resident.type,
      status: resident.status,
      avatar: "",
      createdAt: resident.createdAt.toISOString(),
      condominiumId: resident.condominiumId,
      condominiumName: resident.condominium.name,
    };

    return NextResponse.json(formattedResident);
  } catch (error) {
    console.error("Erro ao criar morador:", error);
    return NextResponse.json(
      { error: "Erro ao criar morador" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "ID do morador obrigatório" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status,
    };

    // If apartment changed, we need to handle that logic similarly to POST
    // For simplicity, we'll skip apartment update logic here unless explicitly requested
    // assuming basic profile updates for now.

    const resident = await prisma.resident.update({
      where: { id: data.id },
      data: updateData,
      include: {
        apartment: {
          include: {
            block: true
          }
        },
        condominium: true
      }
    });

    const formattedResident = {
      id: resident.id,
      name: resident.name,
      email: resident.email || "",
      phone: resident.phone,
      cpf: resident.cpf,
      apartment: resident.apartment.number,
      block: resident.apartment.block?.name || "",
      role: "RESIDENT",
      type: resident.type,
      status: resident.status,
      avatar: "",
      createdAt: resident.createdAt.toISOString(),
      condominiumId: resident.condominiumId,
      condominiumName: resident.condominium.name,
    };

    return NextResponse.json(formattedResident);
  } catch (error) {
    console.error("Erro ao atualizar morador:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar morador" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID obrigatório" },
        { status: 400 }
      );
    }

    await prisma.resident.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar morador:", error);
    return NextResponse.json(
      { error: "Erro ao deletar morador" },
      { status: 500 }
    );
  }
}
