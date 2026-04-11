import type {NextApiRequest, NextApiResponse} from "next";
import supabase from "../../../app/supabaseClient";

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        const{data: tasks, error} = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", {ascending: false});
        
        if (error) return res.status(401).json({error: error.message});
        return res.status(200).json(tasks);
    }
    else{
        res.status(405).end('Method ${req.method} Not Allowed');
    }
}