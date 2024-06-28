import CampaignCard from "./CampaignCard";

//Import Sample data
import campaignData from "../../../public/data/campaign.json"

//Import Needed Icons
import { ArrowLeft3, ArrowRight3 } from "iconsax-react";


const Campaign = () => {
    return ( 
        <main className="py-5 md:py-10 lg:py-20 px-5 sm:px-10 md:px-15 xl:px-20 text-xs md:text-sm xl:text-base mt-10">
            <input type="search" name="search" id="search" placeholder="Enter the campaign name here..." className="w-full caret-accentColor px-5 py-3 border rounded-3xl border-bgDark bg-inherit focus:outline-none focus:border-accentColor"/>
            <section className="mt-10">
                <p className="text-base md:text-lg xl:text-xl font-semibold">Available Campaigns</p>
                <div className="mt-10">
                 <CampaignCard sampleData={campaignData}/>   
                </div>
            </section>
            <section className="flex gap-x-5 justify-end items-center mt-10">
                <div className="flex gap-x-1 items-center group cursor-pointer"><ArrowLeft3 size="20" variant="Bulk" className="text-bgDark group-hover:-translate-x-1 duration-300"/> <p>Prev</p></div>
                <p className="font-medium">Page 1 of 10</p>
                <div className="flex gap-x-1 items-center group cursor-pointer"><p>Next</p><ArrowRight3 size="20" variant="Bulk" className="text-bgDark group-hover:translate-x-1 duration-300"/></div>
            </section>
        </main>
     );
}
 
export default Campaign;