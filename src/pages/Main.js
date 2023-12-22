import { useState } from "react";
import Search from "../components/Search";
import Dashboard from "../components/Dashboard";

export default function Main() {
    const contentHolder = [<Dashboard/>, <Search/>]
    const [contentIndex, setContentIndex] = useState(0);

    return (
        <>
            <div id="contentHolder">
                {contentHolder[contentIndex]}
            </div>
            <div id="contentNavbar">
                <button className={contentIndex === 0 ? "contentNavButtons active" : "contentNavButtons"} onClick={() => {setContentIndex(0)}}>         
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentcolor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"/></svg>
                    <h5>Dashboard</h5>
                </button>
                <button className={contentIndex === 1 ? "contentNavButtons active" : "contentNavButtons"} onClick={() => {setContentIndex(1)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentcolor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <h5>Search</h5>
                </button>
            </div>
        </>
    )
}
