import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { registrationRateLimit } from "@/lib/rateLimit";
import {
    canSelfRegisterEmail,
    isPublicRegistrationEnabled,
} from "@/lib/securityConfig";

export async function POST(request: NextRequest) {
    const limitReached = await registrationRateLimit(request);
    if (limitReached) return limitReached;

    if (!isPublicRegistrationEnabled()) {
        return NextResponse.json({ error: "Registration is disabled" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { username: rawUsername, email: rawEmail, password: rawPassword, passwordConfirm } = body || {};
        const username = typeof rawUsername === "string" ? rawUsername.trim() : "";
        const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
        const password = typeof rawPassword === "string" ? rawPassword : "";

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        if (!canSelfRegisterEmail(email)) {
            return NextResponse.json({ error: "Registration is not permitted for this address" }, { status: 403 });
        }

        if (username.length < 3 || password.length < 6) {
            return NextResponse.json({ error: "Username >= 3 and password >= 6 chars required" }, { status: 400 });
        }

        if (password !== passwordConfirm) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        const existingByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingByEmail) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }

        const existingByUsername = await prisma.user.findFirst({ where: { username } });
        if (existingByUsername) {
            return NextResponse.json({ error: "Username already in use" }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { username, email, password: hashed } });

        return NextResponse.json({ id: user.id, username: user.username, email: user.email }, { status: 201 });
    } catch (err) {
        console.error("register error", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
