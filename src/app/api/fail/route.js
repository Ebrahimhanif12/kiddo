
import {NextResponse} from "next/server";
export async function POST(req) {
        return NextResponse.redirect(new URL('/pricing', req.url),303)
}