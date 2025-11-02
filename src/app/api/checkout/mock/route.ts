import { NextResponse } from "next/server";

export async function POST() {
  // Simule la création d'une session de paiement et renvoie une URL de redirection
  const url = "/mon-compte/achats?status=success";
  return NextResponse.json({ url }, { status: 200 });
}
