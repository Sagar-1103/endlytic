import { use } from "react";

export default function Page({params}:{params:Promise<{id:string}>}) {
    const {id} = use(params);
    return (
        <div>
            <p className="text-white">{id}</p>
        </div>
    );
}