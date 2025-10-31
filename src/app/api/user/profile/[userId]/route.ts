import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest, {params}:{params: {userId: string}}){
    try {

        const session = await getServerSession()

        if(!session){
            return NextResponse.json({
                success: false,
                message: "User is not logged in"
            },{status: 400})
        }

        const urlParams = await params
        const userId = urlParams.userId

        if(!userId){
            return NextResponse.json({
                success: false,
                message: "User id is required"
            },{status:404})
        }

        const userData= await prisma.user.findFirst({
            where:{
                id: userId
            },
            omit:{
                password: true
            },
            include:{
                participation: {
                    include:{
                        EventParticipated: true,
                        participants: true
                    }
                }
            }
        })

        if(!userData){
            return NextResponse.json({
                success: false,
                message: "User Does not exists with this id"
            },{status: 400})
        }

        return NextResponse.json({
            success: true,
            message: "User Data is fetched successfully",
            data: userData
        },{status: 200})


        
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Server Error while getting information"
        },{status: 500})
        
    }

}